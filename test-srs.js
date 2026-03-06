#!/usr/bin/env node
"use strict";

// ============================================
// SRS Algorithm Test Harness
// Reimplements core algorithm, simulates learners across days
// ============================================

// --- Core algorithm (mirrors srs.js) ---

function initCard() {
  return { ef: 2.5, interval: 0, reps: 0, lastReview: null, history: [], errors: 0, consecCorrect: 0 };
}

function sm2Update(card, correct, today) {
  if (correct) {
    if (card.reps === 0) card.interval = 1;
    else if (card.reps === 1) card.interval = 6;
    else card.interval = Math.round(card.interval * card.ef);
    card.reps++;
  } else {
    var oldInterval = card.interval;
    card.interval = Math.max(1, Math.round(oldInterval * 0.25));
    card.reps = 0;
  }
  var q = correct ? 5 : 1;
  card.ef = card.ef + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (card.ef < 1.3) card.ef = 1.3;
  if (card.ef > 2.5) card.ef = 2.5;
  card.lastReview = today;
  card.nextReview = today + card.interval;
  return card;
}

function correctsToGraduate(card) {
  if (card.errors <= 1) return 3;
  if (card.errors <= 4) return 4;
  return 5;
}

function learningGap(sessionFails) {
  if (sessionFails <= 1) return 4;
  if (sessionFails === 2) return 3;
  return 2;
}

// --- Simulation engine ---

function simulateSession(cards, today, answerFn) {
  // Build review queue (due cards)
  var reviews = [];
  for (var i = 0; i < cards.length; i++) {
    var c = cards[i];
    if (c.card && c.card.nextReview !== null && c.card.nextReview <= today) {
      reviews.push(i);
    }
  }

  // Sort by most overdue
  reviews.sort(function(a, b) {
    return (cards[a].card.nextReview || 0) - (cards[b].card.nextReview || 0);
  });

  var learning = []; // [{idx, showAfter, sessionFails}]
  var cardsSeen = 0;
  var introduced = cards.filter(c => c.card).length;
  var maxNew = 10; // introduce up to 10 new per session
  var newThisSession = 0;
  var sessionStats = { total: 0, correct: 0, graduated: 0, newIntroduced: 0 };

  function nextCard() {
    // 1. Learning cards ready?
    var best = -1, bestShow = Infinity;
    for (var i = 0; i < learning.length; i++) {
      if (learning[i].showAfter <= cardsSeen && learning[i].showAfter < bestShow) {
        best = i;
        bestShow = learning[i].showAfter;
      }
    }
    if (best >= 0) return learning.splice(best, 1)[0];

    // 2. Due reviews
    if (reviews.length > 0) return { idx: reviews.shift(), fromReview: true };

    // 3. New cards
    while (introduced < cards.length && newThisSession < maxNew) {
      var idx = introduced;
      cards[idx].card = initCard();
      cards[idx].card.nextReview = today;
      introduced++;
      newThisSession++;
      sessionStats.newIntroduced++;
      return { idx: idx, isNew: true, sessionFails: 0 };
    }

    // 4. Forced learning
    if (learning.length > 0) {
      learning.sort((a, b) => a.showAfter - b.showAfter);
      return learning.shift();
    }
    return null;
  }

  var maxIterations = 500; // safety valve
  var iterations = 0;

  while (iterations++ < maxIterations) {
    var entry = nextCard();
    if (!entry) break;

    var idx = entry.idx;
    var card = cards[idx].card;
    var word = cards[idx].word;
    var gender = cards[idx].gender;

    // Reset consecCorrect if 1+ days since last history entry
    if (card.consecCorrect > 0 && card.history.length > 0) {
      var lastTs = card.history[card.history.length - 1][0];
      if (today - lastTs >= 1) {
        card.consecCorrect = 0;
      }
    }

    var isLearning = entry.isNew || entry.sessionFails !== undefined;
    var wasReview = entry.fromReview;
    if (!isLearning && wasReview) {
      isLearning = true;
      entry.sessionFails = 0;
    }

    var sessionFails = entry.sessionFails || 0;
    var consecCorrect = card.consecCorrect || 0;

    // Get answer from simulated learner
    var correct = answerFn(word, gender, card, today);

    card.history.push([today, correct]);
    if (!correct) card.errors++;
    cardsSeen++;
    sessionStats.total++;
    if (correct) sessionStats.correct++;

    if (isLearning) {
      var needed = correctsToGraduate(card);
      if (correct) {
        consecCorrect++;
        card.consecCorrect = consecCorrect;
        if (consecCorrect >= needed) {
          card.consecCorrect = 0;
          sm2Update(card, true, today);
          sessionStats.graduated++;
        } else {
          var gap = Math.max(4, 6 - sessionFails);
          learning.push({ idx: idx, showAfter: cardsSeen + gap, sessionFails: sessionFails });
        }
      } else {
        card.consecCorrect = 0;
        sessionFails++;
        if (wasReview) sm2Update(card, false, today);
        var gap = learningGap(sessionFails);
        learning.push({ idx: idx, showAfter: cardsSeen + gap, sessionFails: sessionFails });
      }
    }
  }

  return sessionStats;
}

// --- Learner profiles ---

// "knows" tracks which words the simulated learner has truly learned
// P(correct) depends on whether they've seen it enough times
function makeLearner(profile) {
  var memory = {}; // word -> {strength, lastSeen}

  return function(word, gender, card, today) {
    if (!memory[word]) {
      memory[word] = { strength: profile.initialAccuracy, exposures: 0 };
    }
    var m = memory[word];
    m.exposures++;

    // Simulate forgetting: strength decays over time
    if (card.history.length > 0) {
      var lastTs = card.history[card.history.length - 1][0];
      var daysSince = today - lastTs;
      if (daysSince > 0) {
        m.strength *= Math.pow(profile.retentionRate, daysSince);
      }
    }

    // Each correct exposure strengthens memory
    var pCorrect = Math.min(0.98, m.strength);

    // Base rate is 50% (coin flip) for unknown words
    pCorrect = Math.max(0.5, pCorrect);

    var correct = Math.random() < pCorrect;

    if (correct) {
      m.strength = Math.min(0.99, m.strength + profile.learnRate);
    } else {
      m.strength *= profile.forgetPenalty;
    }

    return correct;
  };
}

// --- Run simulations ---

function runSimulation(name, profile, numWords, numDays) {
  console.log("\n" + "=".repeat(60));
  console.log("SIMULATION: " + name);
  console.log("  " + numWords + " words, " + numDays + " days");
  console.log("  Profile: initial=" + profile.initialAccuracy +
    " retention=" + profile.retentionRate +
    " learnRate=" + profile.learnRate);
  console.log("=".repeat(60));

  // Create word list
  var cards = [];
  for (var i = 0; i < numWords; i++) {
    cards.push({ word: "word" + i, gender: (i % 2 === 0) ? "m" : "f", card: null });
  }

  var learner = makeLearner(profile);
  var dailyStats = [];

  for (var day = 0; day < numDays; day++) {
    var stats = simulateSession(cards, day, learner);
    dailyStats.push(stats);

    if (day % 7 === 6 || day === numDays - 1) {
      // Weekly summary
      var graduated = cards.filter(c => c.card && c.card.reps > 0).length;
      var introduced = cards.filter(c => c.card).length;
      var avgEf = 0, efCount = 0;
      cards.forEach(c => { if (c.card && c.card.reps > 0) { avgEf += c.card.ef; efCount++; } });
      avgEf = efCount > 0 ? (avgEf / efCount).toFixed(2) : "n/a";

      console.log("\n  Day " + (day + 1) + ":");
      console.log("    Introduced: " + introduced + "/" + numWords);
      console.log("    Graduated: " + graduated);
      console.log("    Avg EF (graduated): " + avgEf);
      console.log("    Today: " + stats.total + " cards, " +
        stats.correct + "/" + stats.total + " correct (" +
        (stats.total > 0 ? Math.round(stats.correct/stats.total*100) : 0) + "%), " +
        stats.newIntroduced + " new, " + stats.graduated + " graduated");
    }
  }

  // Final analysis
  console.log("\n  --- FINAL ANALYSIS ---");
  var graduated = cards.filter(c => c.card && c.card.reps > 0);
  var stuck = cards.filter(c => c.card && c.card.reps === 0 && c.card.history.length > 0);
  var notStarted = cards.filter(c => !c.card);

  console.log("  Graduated: " + graduated.length);
  console.log("  Stuck (introduced but not graduated): " + stuck.length);
  console.log("  Not yet introduced: " + notStarted.length);

  // Check for leeches
  var leeches = cards.filter(c => c.card && c.card.errors >= 6);
  console.log("  Leeches (6+ errors): " + leeches.length);
  leeches.slice(0, 5).forEach(c => {
    console.log("    " + c.word + ": errors=" + c.card.errors +
      " history=" + c.card.history.length + " graduated=" + (c.card.reps > 0));
  });

  // Interval distribution for graduated cards
  var intervals = {};
  graduated.forEach(c => {
    var bucket = c.card.interval <= 1 ? "1d" :
      c.card.interval <= 7 ? "2-7d" :
      c.card.interval <= 30 ? "8-30d" : "30d+";
    intervals[bucket] = (intervals[bucket] || 0) + 1;
  });
  console.log("  Interval distribution: " + JSON.stringify(intervals));

  // EF distribution
  var efBuckets = { "1.3-1.5": 0, "1.5-2.0": 0, "2.0-2.5": 0, "2.5+": 0 };
  graduated.forEach(c => {
    if (c.card.ef < 1.5) efBuckets["1.3-1.5"]++;
    else if (c.card.ef < 2.0) efBuckets["1.5-2.0"]++;
    else if (c.card.ef < 2.5) efBuckets["2.0-2.5"]++;
    else efBuckets["2.5+"]++;
  });
  console.log("  EF distribution: " + JSON.stringify(efBuckets));

  // Validate invariants
  console.log("\n  --- INVARIANT CHECKS ---");
  var issues = [];

  cards.forEach(c => {
    if (!c.card) return;
    var card = c.card;

    // EF should never exceed 2.5 (starting value, no recovery)
    if (card.ef > 2.51) issues.push(c.word + ": EF=" + card.ef + " exceeds 2.5");

    // EF should never be below 1.3
    if (card.ef < 1.29) issues.push(c.word + ": EF=" + card.ef + " below 1.3");

    // errors should match false count in history
    var actualErrors = card.history.filter(h => !h[1]).length;
    if (card.errors !== actualErrors) {
      issues.push(c.word + ": errors=" + card.errors + " but history has " + actualErrors + " failures");
    }

    // Graduated cards should have lastReview set
    if (card.reps > 0 && card.lastReview === null) {
      issues.push(c.word + ": reps=" + card.reps + " but lastReview is null");
    }

    // consecCorrect should be 0 for graduated cards
    if (card.reps > 0 && card.consecCorrect > 0) {
      issues.push(c.word + ": graduated but consecCorrect=" + card.consecCorrect);
    }
  });

  if (issues.length === 0) {
    console.log("  ✓ All invariants passed!");
  } else {
    console.log("  ✗ " + issues.length + " issues found:");
    issues.slice(0, 10).forEach(i => console.log("    - " + i));
    if (issues.length > 10) console.log("    ... and " + (issues.length - 10) + " more");
  }

  return { cards, dailyStats };
}

// --- Profiles ---

var fastLearner = {
  initialAccuracy: 0.7,  // starts knowing ~70% (like your data shows)
  retentionRate: 0.95,    // forgets slowly
  learnRate: 0.15,        // learns quickly from exposure
  forgetPenalty: 0.7      // misses don't hurt much
};

var averageLearner = {
  initialAccuracy: 0.55,  // barely above coin flip
  retentionRate: 0.88,    // moderate forgetting
  learnRate: 0.10,        // steady learner
  forgetPenalty: 0.6      // misses set back a bit
};

var struggler = {
  initialAccuracy: 0.5,   // pure coin flip
  retentionRate: 0.80,    // forgets fast
  learnRate: 0.06,        // slow to pick up
  forgetPenalty: 0.5      // misses really hurt
};

var confuser = {
  initialAccuracy: 0.5,
  retentionRate: 0.85,
  learnRate: 0.08,
  forgetPenalty: 0.3      // misses are devastating — keeps mixing things up
};

// Run all profiles
console.log("SRS Algorithm Simulation");
console.log("Testing algorithm behavior across learner profiles and time\n");

runSimulation("Fast Learner (like Jonathan's 86% accuracy)", fastLearner, 100, 21);
runSimulation("Average Learner", averageLearner, 100, 21);
runSimulation("Struggler (slow learner, fast forgetter)", struggler, 50, 28);
runSimulation("Confuser (keeps mixing up genders)", confuser, 50, 28);
