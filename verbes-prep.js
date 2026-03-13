(function () {
  'use strict';

  var STORAGE_KEY = 'frenchGender_verbesPrep';
  var data = VERBES_PREP_DATA;
  var store = loadStore();
  var deck = [];
  var deckIdx = 0;
  var blankIdx = 0; // which blank we're currently filling
  var sessionCorrect = 0;
  var sessionTotal = 0;
  var activeTiers = [1, 2];
  var currentAnswers = []; // user's answers for current sentence

  // Preposition options for buttons
  var PREP_OPTIONS = ['à', 'de', "(rien)", 'au', 'aux', 'du', 'des', "d'", 'pour', 'chez'];

  // DOM refs
  var dashboardEl = document.getElementById('vp-dashboard');
  var practiceEl = document.getElementById('vp-practice');
  var counterEl = document.getElementById('vp-counter');
  var progressBarEl = document.getElementById('vp-progress-bar');
  var questionEl = document.getElementById('vp-question');
  var promptEl = document.getElementById('vp-card-prompt');
  var answerAreaEl = document.getElementById('vp-answer-area');
  var answerEl = document.getElementById('vp-answer');
  var cardAnswerEl = document.getElementById('vp-card-answer');
  var footerEl = document.getElementById('vp-footer');

  function loadStore() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore */ }
    return { mastered: [] };
  }

  function saveStore() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }

  function escapeHtml(s) {
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    }
    return arr;
  }

  function getActiveExercises() {
    return data.filter(function (e) {
      return activeTiers.indexOf(e.tier) !== -1;
    });
  }

  function sentenceId(e) {
    return 'ex' + e.exercise + '_' + e.number;
  }

  // ============================================
  // DASHBOARD
  // ============================================

  function updateDashboard() {
    var active = getActiveExercises();
    var mastered = active.filter(function (e) {
      return store.mastered.indexOf(sentenceId(e)) !== -1;
    });

    var countEl = document.getElementById('vp-tier-count');
    if (countEl) {
      countEl.textContent =
        active.length + ' phrases actives · ' + mastered.length + ' maîtrisées';
    }

    // Unique verbs in active set
    var verbSet = {};
    active.forEach(function (e) { if (e.verb) verbSet[e.verb] = true; });
    var verbCountEl = document.getElementById('vp-verb-count');
    if (verbCountEl) {
      verbCountEl.textContent = Object.keys(verbSet).length + ' verbes couverts';
    }

    // Tier button states
    var btns = document.querySelectorAll('.vp-tier-btn');
    for (var i = 0; i < btns.length; i++) {
      var t = parseInt(btns[i].getAttribute('data-tier'));
      btns[i].classList.toggle('active', activeTiers.indexOf(t) !== -1);
    }

    // Menu progress
    var progressEl = document.getElementById('vp-progress');
    if (progressEl) {
      progressEl.textContent = mastered.length + ' / ' + active.length + ' maîtrisées';
    }
  }

  window.vpToggleTier = function (t) {
    var idx = activeTiers.indexOf(t);
    if (idx !== -1) {
      if (activeTiers.length > 1) activeTiers.splice(idx, 1);
    } else {
      activeTiers.push(t);
      activeTiers.sort();
    }
    updateDashboard();
  };

  // ============================================
  // NAVIGATION
  // ============================================

  window.startVerbesPrep = function () {
    window._showScreen(dashboardEl, 'verbes-prep');
    updateDashboard();
  };

  window.vpBackToMenu = function () {
    window._showScreen(window._menuScreen, '');
  };

  window.vpBackToDash = function () {
    window._showScreen(dashboardEl, 'verbes-prep');
    updateDashboard();
  };

  // ============================================
  // START PRACTICE
  // ============================================

  window.vpStartPractice = function () {
    deck = getActiveExercises().filter(function (e) {
      return store.mastered.indexOf(sentenceId(e)) === -1;
    });
    if (deck.length === 0) deck = getActiveExercises();
    shuffle(deck);
    deckIdx = 0;
    sessionCorrect = 0;
    sessionTotal = 0;
    window._showScreen(practiceEl, 'vp-practice');
    showCard();
  };

  // ============================================
  // CARD DISPLAY
  // ============================================

  function showCard() {
    if (deckIdx >= deck.length) {
      showComplete();
      return;
    }

    var item = deck[deckIdx];
    blankIdx = 0;
    currentAnswers = [];

    questionEl.classList.remove('hidden');
    answerEl.classList.add('hidden');
    counterEl.textContent = (deckIdx + 1) + ' / ' + deck.length;
    progressBarEl.style.width = (deckIdx / deck.length * 100) + '%';

    showBlank();
  }

  function showBlank() {
    var item = deck[deckIdx];
    var blanks = item.blanks || [];

    // Build sentence HTML with blanks highlighted
    var parts = item.sentence_original.split('___');
    var html = '';
    for (var i = 0; i < parts.length; i++) {
      html += escapeHtml(parts[i]);
      if (i < parts.length - 1) {
        if (i < blankIdx) {
          // Already answered
          var ans = currentAnswers[i];
          var cls = ans === '' ? 'vp-blank-empty' : 'vp-blank-filled';
          html += '<span class="' + cls + '">' + (ans === '' ? '(rien)' : escapeHtml(ans)) + '</span>';
        } else if (i === blankIdx) {
          // Current blank
          html += '<span class="vp-blank-current">___</span>';
        } else {
          // Future blank
          html += '<span class="vp-blank">___</span>';
        }
      }
    }

    var verbHint = item.verb ? '<div class="vp-verb-hint">Verbe : ' + escapeHtml(item.verb) + '</div>' : '';

    promptEl.innerHTML =
      '<div class="vp-sentence">' + html + '</div>' + verbHint;

    // Show preposition buttons
    // Determine likely options based on what's needed
    var btnsHtml = '';
    PREP_OPTIONS.forEach(function (prep) {
      var display = prep;
      var val = prep === '(rien)' ? '' : prep;
      btnsHtml +=
        '<button class="answer-btn vp-prep-btn" onclick="vpAnswer(\'' +
        val.replace(/'/g, "\\'") + '\')">' + escapeHtml(display) + '</button>';
    });
    answerAreaEl.innerHTML = '<div class="vp-prep-grid">' + btnsHtml + '</div>';
  }

  // ============================================
  // ANSWER HANDLING
  // ============================================

  window.vpAnswer = function (choice) {
    var item = deck[deckIdx];
    var blanks = item.blanks || [];
    currentAnswers.push(choice);

    blankIdx++;

    if (blankIdx < blanks.length) {
      // More blanks to fill
      showBlank();
      return;
    }

    // All blanks filled — check correctness
    var allCorrect = true;
    for (var i = 0; i < blanks.length; i++) {
      var expected = blanks[i].answer;
      var given = currentAnswers[i] || '';
      // Normalize: d' and de are considered equivalent if context matches
      if (normalizePrep(given) !== normalizePrep(expected)) {
        allCorrect = false;
      }
    }

    sessionTotal++;
    if (allCorrect) sessionCorrect++;

    questionEl.classList.add('hidden');
    answerEl.classList.remove('hidden');

    var fb = allCorrect ? 'Correct !' : 'Incorrect';
    var fbClass = allCorrect ? 'correct-text' : 'incorrect-text';

    // Show completed sentence
    var html =
      '<div class="feedback ' + fbClass + '">' + fb + '</div>' +
      '<div class="vp-complete-sentence">' + escapeHtml(item.sentence_complete) + '</div>';

    // Show what user answered vs correct if wrong
    if (!allCorrect) {
      html += '<div class="vp-answer-compare">';
      for (var j = 0; j < blanks.length; j++) {
        var exp = blanks[j].answer || '(rien)';
        var got = currentAnswers[j] || '(rien)';
        var match = normalizePrep(currentAnswers[j] || '') === normalizePrep(blanks[j].answer);
        html += '<div class="vp-compare-row">' +
          '<span class="vp-compare-label">Blanc ' + (j + 1) + ' :</span>' +
          '<span class="vp-compare-got ' + (match ? 'vp-match' : 'vp-miss') + '">' + escapeHtml(got) + '</span>' +
          (match ? '' : ' → <span class="vp-compare-expected">' + escapeHtml(exp) + '</span>') +
          '</div>';
      }
      html += '</div>';
    }

    // Show construction info
    if (item.verb && item.construction) {
      html += '<div class="vp-construction">' +
        escapeHtml(item.verb) + ' — ' + escapeHtml(item.construction) + '</div>';
    }

    cardAnswerEl.className = 'card vp-card';
    cardAnswerEl.innerHTML = html;

    var isMastered = store.mastered.indexOf(sentenceId(item)) !== -1;
    footerEl.innerHTML =
      '<label class="mastered-label">' +
        '<input type="checkbox" id="vp-mastered-chk"' + (isMastered ? ' checked' : '') + '>' +
        '<span>Maîtrisé</span>' +
      '</label>' +
      '<button class="next-btn" onclick="vpNext()">Suivant &rarr;</button>';
  };

  function normalizePrep(p) {
    if (!p) return '';
    var s = p.trim().toLowerCase();
    // d' and de are close but distinct in usage; be lenient
    // "d'" before vowel is just "de" contracted
    if (s === "d'") return "de";
    return s;
  }

  // ============================================
  // NEXT
  // ============================================

  window.vpNext = function () {
    var chk = document.getElementById('vp-mastered-chk');
    var item = deck[deckIdx];
    var id = sentenceId(item);
    var idx = store.mastered.indexOf(id);
    if (chk && chk.checked && idx === -1) {
      store.mastered.push(id);
      saveStore();
    } else if (chk && !chk.checked && idx !== -1) {
      store.mastered.splice(idx, 1);
      saveStore();
    }
    deckIdx++;
    showCard();
  };

  function showComplete() {
    questionEl.classList.add('hidden');
    answerEl.classList.remove('hidden');

    var msg = 'Terminé ! ' + sessionCorrect + ' / ' + sessionTotal + ' correct' +
      (sessionCorrect !== 1 ? 's' : '');

    cardAnswerEl.className = 'card vp-card';
    cardAnswerEl.innerHTML =
      '<div class="complete-emoji">&#127881;</div>' +
      '<h2>Bravo !</h2>' +
      '<p style="color:#666;margin-top:8px">' + msg + '</p>';
    footerEl.innerHTML =
      '<button class="next-btn" onclick="vpBackToDash()">Retour</button>';
  }

  // ============================================
  // RESET
  // ============================================

  window.vpResetConfirm = function () {
    if (confirm('Réinitialiser la progression des verbes + prépositions ?')) {
      store = { mastered: [] };
      saveStore();
      updateDashboard();
    }
  };

  // ============================================
  // INIT
  // ============================================

  updateDashboard();

})();
