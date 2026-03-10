#!/usr/bin/env node
//
// Enrich connecteurs.json with translations, register, usage notes, and examples.
// Uses Claude API in batches of ~25 connectors per call.
// Saves intermediate progress to data/connecteurs-enriched.json after each batch.
//
// Usage:
//   ANTHROPIC_API_KEY=sk-... node scripts/enrich-connecteurs.js
//
// To resume after a partial failure, just re-run — it skips already-enriched entries.

const fs = require("fs");
const path = require("path");

const INPUT = path.join(__dirname, "..", "data", "connecteurs.json");
const OUTPUT = path.join(__dirname, "..", "data", "connecteurs-enriched.json");
const BATCH_SIZE = 25;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 5000;
const API_URL = "https://api.anthropic.com/v1/messages";

const API_KEY = process.env.ANTHROPIC_API_KEY;
if (!API_KEY) {
  console.error("Error: Set ANTHROPIC_API_KEY environment variable");
  process.exit(1);
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function callClaude(connectors) {
  const list = connectors
    .map(
      (c, i) =>
        `${i + 1}. "${c.connector}" [categories: ${c.categories.join(", ")}]`
    )
    .join("\n");

  const prompt = `You are a French language expert helping an intermediate French learner (preparing for DELF B2).

For each connector below, provide:
- "translation": concise English equivalent(s)
- "register": one of "informal", "neutral", "formal", "literary"
- "usage_note": 1 sentence on when/how to use it (in English). Include whether it starts a sentence, links clauses, etc.
- "example_fr": a natural example sentence in French
- "example_en": English translation of that example

Return ONLY a JSON array (no markdown fences) with objects in the same order, each having keys: "connector", "translation", "register", "usage_note", "example_fr", "example_en".

Connectors:
${list}`;

  const body = {
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    messages: [{ role: "user", content: prompt }],
  };

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status}: ${text.slice(0, 300)}`);
  }

  const data = await res.json();
  const content = data.content[0].text.trim();

  // Try to parse JSON — handle potential markdown fences
  let jsonStr = content;
  const fenceMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) jsonStr = fenceMatch[1].trim();

  const parsed = JSON.parse(jsonStr);
  if (!Array.isArray(parsed) || parsed.length !== connectors.length) {
    throw new Error(
      `Expected ${connectors.length} results, got ${Array.isArray(parsed) ? parsed.length : "non-array"}`
    );
  }
  return parsed;
}

async function callWithRetry(connectors, batchIndex) {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(
        `  Batch ${batchIndex + 1}: attempt ${attempt}/${MAX_RETRIES} (${connectors.length} connectors)...`
      );
      return await callClaude(connectors);
    } catch (err) {
      console.error(`  Batch ${batchIndex + 1} attempt ${attempt} failed: ${err.message}`);
      if (attempt < MAX_RETRIES) {
        const delay = RETRY_DELAY_MS * attempt;
        console.log(`  Retrying in ${delay / 1000}s...`);
        await sleep(delay);
      }
    }
  }
  return null; // all retries exhausted
}

async function main() {
  const connectors = JSON.parse(fs.readFileSync(INPUT, "utf-8"));

  // Load existing progress if available
  let enriched;
  if (fs.existsSync(OUTPUT)) {
    enriched = JSON.parse(fs.readFileSync(OUTPUT, "utf-8"));
    console.log(`Loaded existing progress: ${OUTPUT}`);
  } else {
    enriched = connectors.map((c) => ({ ...c }));
  }

  // Find which entries still need enrichment
  const needsEnrichment = [];
  for (let i = 0; i < enriched.length; i++) {
    if (!enriched[i].translation) {
      needsEnrichment.push(i);
    }
  }

  if (needsEnrichment.length === 0) {
    console.log("All connectors already enriched!");
    return;
  }

  console.log(
    `${needsEnrichment.length} connectors need enrichment (${enriched.length - needsEnrichment.length} already done)`
  );

  // Process in batches
  const batches = [];
  for (let i = 0; i < needsEnrichment.length; i += BATCH_SIZE) {
    batches.push(needsEnrichment.slice(i, i + BATCH_SIZE));
  }

  console.log(`Processing ${batches.length} batches of ~${BATCH_SIZE}...\n`);

  let failedBatches = [];

  for (let b = 0; b < batches.length; b++) {
    const indices = batches[b];
    const batchConnectors = indices.map((i) => enriched[i]);

    const results = await callWithRetry(batchConnectors, b);

    if (results) {
      // Merge results back
      for (let j = 0; j < indices.length; j++) {
        const idx = indices[j];
        enriched[idx] = { ...enriched[idx], ...results[j] };
        // Keep our connector name (not the LLM's potentially altered version)
        enriched[idx].connector = connectors[idx].connector;
      }
      console.log(`  Batch ${b + 1} done.\n`);
    } else {
      console.error(`  Batch ${b + 1} FAILED after ${MAX_RETRIES} retries. Skipping.\n`);
      failedBatches.push(indices.map((i) => enriched[i].connector));
    }

    // Save progress after each batch
    fs.writeFileSync(OUTPUT, JSON.stringify(enriched, null, 2), "utf-8");

    // Small delay between batches to be polite to the API
    if (b < batches.length - 1) await sleep(1000);
  }

  console.log(`\nDone! Output: ${OUTPUT}`);
  const enrichedCount = enriched.filter((c) => c.translation).length;
  console.log(`Enriched: ${enrichedCount}/${enriched.length}`);

  if (failedBatches.length > 0) {
    console.log(
      `\nFailed batches (re-run to retry):\n` +
        failedBatches.map((b) => `  - ${b.join(", ")}`).join("\n")
    );
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
