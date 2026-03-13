#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const TABLE_PATH = path.join(DATA_DIR, 'verbes-prep-table.json');
const EXERCISES_PATH = path.join(DATA_DIR, 'verbes-prep-exercises-raw.json');
const OUTPUT_PATH = path.join(DATA_DIR, 'verbes-prep-exercises.json');
const PROGRESS_PATH = path.join(DATA_DIR, '.solve-exercises-progress.json');

const API_KEY = process.env.ANTHROPIC_API_KEY;
if (!API_KEY) {
  console.error('Error: ANTHROPIC_API_KEY environment variable not set');
  process.exit(1);
}

const MODEL = 'claude-sonnet-4-20250514';
const API_URL = 'https://api.anthropic.com/v1/messages';
const BATCH_SIZE = 30;
const MAX_RETRIES = 3;

async function callClaude(messages, systemPrompt) {
  const body = {
    model: MODEL,
    max_tokens: 4096,
    system: systemPrompt,
    messages,
  };

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`API ${res.status}: ${errText}`);
      }

      const data = await res.json();
      const text = data.content[0].text;
      // Extract JSON from response (handle markdown code blocks)
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) throw new Error('No JSON array found in response');
      return JSON.parse(jsonMatch[0]);
    } catch (e) {
      console.error(`  Attempt ${attempt + 1} failed: ${e.message}`);
      if (attempt < MAX_RETRIES - 1) {
        const delay = Math.pow(2, attempt + 1) * 1000;
        console.log(`  Retrying in ${delay / 1000}s...`);
        await new Promise(r => setTimeout(r, delay));
      } else {
        throw e;
      }
    }
  }
}

function buildSystemPrompt(verbTable) {
  return `You are a French grammar expert. You will be given exercise sentences with blanks (___) that need prepositions filled in.

Here is the reference table of French verbs and their preposition constructions:
${JSON.stringify(verbTable, null, 1)}

Rules:
- Fill in ONLY prepositions or articles contractés: à, de, d', du, des, au, aux, pour, chez, avec, contre, sur, par, en, or "" (empty string) if nothing goes in the blank
- Match each sentence's verb to the table entries to determine the correct construction
- For "de" before a vowel, use "d'"
- For "de + le" use "du", "de + les" use "des", "à + le" use "au", "à + les" use "aux"
- Some blanks are "" when the verb takes a direct object (no preposition needed)
- Return a JSON array with one object per sentence, in the same order as input

Each object must have:
- "exercise": the exercise number
- "number": the sentence number within the exercise
- "sentence_complete": the full sentence with blanks filled in (remove the ___ and insert the answer, or just remove ___ if answer is "")
- "blanks": array of objects, one per blank in order, each with "answer" (string)
- "verb": the main verb being tested (infinitive form matching the table)
- "construction": which construction is being tested (e.g. "à faire qqch", "qqch à qqn", "de qqch", etc.)`;
}

function buildFrequencyPrompt(verbs) {
  return `You are a French language expert. Assign a frequency tier (1-4) to each of these French verbs based on how common they are in everyday spoken/written French.

Tier 1 (most common ~50): fundamental verbs like être, avoir, faire, aller, pouvoir, vouloir, devoir, savoir, dire, parler, penser, demander, donner, prendre, venir, voir, croire, aimer, falloir, laisser, etc.
Tier 2 (very common ~50): common but slightly less fundamental
Tier 3 (common ~50): regularly used but not daily essentials
Tier 4 (less common ~30): literary, formal, or specialized

Verbs to classify:
${JSON.stringify(verbs)}

Return a JSON array of objects: [{"verb": "...", "frequency_tier": N}, ...]
Include every verb from the list. Return ONLY the JSON array.`;
}

async function main() {
  const verbTable = JSON.parse(fs.readFileSync(TABLE_PATH, 'utf8'));
  const exercises = JSON.parse(fs.readFileSync(EXERCISES_PATH, 'utf8'));

  // Load progress if exists
  let progress = {};
  if (fs.existsSync(PROGRESS_PATH)) {
    progress = JSON.parse(fs.readFileSync(PROGRESS_PATH, 'utf8'));
    console.log(`Loaded progress: ${Object.keys(progress).length} sentences already solved`);
  }

  // Build unique key for each sentence
  const makeKey = (ex) => `${ex.exercise}-${ex.number}-${ex.sentence.slice(0, 40)}`;

  // Find unsolved sentences
  const unsolved = exercises.filter(ex => !progress[makeKey(ex)]);
  console.log(`Total: ${exercises.length}, Unsolved: ${unsolved.length}`);

  if (unsolved.length > 0) {
    const systemPrompt = buildSystemPrompt(verbTable);

    // Process in batches
    for (let i = 0; i < unsolved.length; i += BATCH_SIZE) {
      const batch = unsolved.slice(i, i + BATCH_SIZE);
      const batchEnd = Math.min(i + BATCH_SIZE, unsolved.length);
      console.log(`\nProcessing batch ${Math.floor(i / BATCH_SIZE) + 1}: sentences ${i + 1}-${batchEnd} of ${unsolved.length}`);

      const userMessage = `Solve these ${batch.length} sentences. For exercise 2, it is a matching exercise - the left side is the beginning of a sentence and the right side (a, b, c...) are the endings. Match them correctly and provide the complete matched sentence. For exercise 15, it's a passage with numbered blanks (1)-(30).

Return a JSON array of ${batch.length} objects in the same order.

Sentences:
${batch.map((s, idx) => `${idx + 1}. [Ex ${s.exercise}, #${s.number}] ${s.sentence}`).join('\n')}`;

      const results = await callClaude(
        [{ role: 'user', content: userMessage }],
        systemPrompt
      );

      if (results.length !== batch.length) {
        console.warn(`  Warning: expected ${batch.length} results, got ${results.length}`);
      }

      // Save each result to progress
      for (let j = 0; j < Math.min(results.length, batch.length); j++) {
        const key = makeKey(batch[j]);
        progress[key] = {
          ...batch[j],
          ...results[j],
        };
      }

      // Save intermediate progress
      fs.writeFileSync(PROGRESS_PATH, JSON.stringify(progress, null, 2));
      console.log(`  Saved progress (${Object.keys(progress).length} total)`);
    }
  }

  // Now get frequency tiers for all unique verbs
  console.log('\nGetting frequency tiers for verbs...');
  const allVerbs = [...new Set(Object.values(progress).map(p => p.verb).filter(Boolean))];
  const tableVerbs = verbTable.map(v => v.verb);
  // Include all verbs from both sources
  const uniqueVerbs = [...new Set([...allVerbs, ...tableVerbs])];
  console.log(`Unique verbs to classify: ${uniqueVerbs.length}`);

  const freqResults = await callClaude(
    [{ role: 'user', content: buildFrequencyPrompt(uniqueVerbs) }],
    'You are a French language frequency expert. Return only valid JSON.'
  );

  const freqMap = {};
  for (const item of freqResults) {
    freqMap[item.verb] = item.frequency_tier;
  }

  // Assemble final output in original order
  const output = exercises.map(ex => {
    const key = makeKey(ex);
    const solved = progress[key];
    if (!solved) {
      console.warn(`Missing solution for: ${key}`);
      return { ...ex, error: 'unsolved' };
    }
    return {
      exercise: ex.exercise,
      number: ex.number,
      sentence_original: ex.sentence,
      sentence_complete: solved.sentence_complete,
      blanks: solved.blanks,
      verb: solved.verb,
      construction: solved.construction,
      frequency_tier: freqMap[solved.verb] || 3,
    };
  });

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));
  console.log(`\nDone! Saved ${output.length} exercises to ${OUTPUT_PATH}`);

  // Clean up progress file
  // fs.unlinkSync(PROGRESS_PATH);  // Keep for debugging
}

main().catch(e => {
  console.error('Fatal error:', e);
  process.exit(1);
});
