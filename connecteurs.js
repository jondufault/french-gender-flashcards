(function () {
  'use strict';

  var STORAGE_KEY = 'frenchGender_connecteurs';
  var REGISTER_FR = {
    informal: 'familier',
    neutral: 'courant',
    formal: 'soutenu',
    literary: 'littéraire'
  };
  var CAT_DESC = {
    Addition: 'Ajouter une idée',
    Alternative: 'Présenter un choix',
    But: 'Exprimer un objectif',
    Cause: 'Expliquer pourquoi',
    Comparaison: 'Comparer',
    Concession: 'Admettre malgré tout',
    Conclusion: 'Conclure / résumer',
    Condition: 'Poser une condition',
    Conséquence: 'Exprimer un résultat',
    Classification: 'Ordonner / énumérer',
    Illustration: 'Donner un exemple',
    Justification: 'Justifier / expliquer',
    Liaison: 'Enchaîner les idées',
    Opposition: 'Opposer / contredire',
    Restriction: 'Limiter / restreindre',
    Temps: 'Situer dans le temps'
  };

  var data = CONNECTEURS_DATA;
  var catIndex = {};
  var store = loadStore();
  var drill = null; // 'express', 'vary', 'recognize'
  var activeTiers = [1, 2];
  var deck = [];
  var deckIdx = 0;
  var sessionCorrect = 0;
  var sessionTotal = 0;

  // DOM refs
  var dashboardEl = document.getElementById('conn-dashboard');
  var practiceEl = document.getElementById('conn-practice');
  var counterEl = document.getElementById('conn-counter');
  var progressBarEl = document.getElementById('conn-progress-bar');
  var questionEl = document.getElementById('conn-question');
  var promptEl = document.getElementById('conn-card-prompt');
  var answerAreaEl = document.getElementById('conn-answer-area');
  var answerEl = document.getElementById('conn-answer');
  var cardAnswerEl = document.getElementById('conn-card-answer');
  var footerEl = document.getElementById('conn-footer');

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

  function buildIndex() {
    catIndex = {};
    data.forEach(function (c) {
      c.categories.forEach(function (cat) {
        if (!catIndex[cat]) catIndex[cat] = [];
        catIndex[cat].push(c);
      });
    });
  }

  function getActiveConnectors() {
    return data.filter(function (c) {
      return activeTiers.indexOf(c.tier) !== -1;
    });
  }

  function getActiveCats() {
    var cats = {};
    getActiveConnectors().forEach(function (c) {
      c.categories.forEach(function (cat) {
        if (!cats[cat]) cats[cat] = [];
        cats[cat].push(c);
      });
    });
    return cats;
  }

  // ============================================
  // DASHBOARD
  // ============================================

  function updateDashboard() {
    var active = getActiveConnectors();
    var mastered = active.filter(function (c) {
      return store.mastered.indexOf(c.connector) !== -1;
    });

    var countEl = document.getElementById('conn-tier-count');
    if (countEl) {
      countEl.textContent =
        active.length + ' connecteurs actifs · ' + mastered.length + ' maîtrisés';
    }

    // Update tier button states
    var btns = document.querySelectorAll('.conn-tier-btn');
    for (var i = 0; i < btns.length; i++) {
      var t = parseInt(btns[i].getAttribute('data-tier'));
      btns[i].classList.toggle('active', activeTiers.indexOf(t) !== -1);
    }

    // Update menu progress
    var progressEl = document.getElementById('conn-progress');
    if (progressEl) {
      progressEl.textContent = mastered.length + ' / ' + active.length + ' maîtrisés';
    }
  }

  window.connToggleTier = function (t) {
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

  window.startConnecteurs = function () {
    window._showScreen(dashboardEl, 'connecteurs');
    updateDashboard();
  };

  window.connBackToMenu = function () {
    window._showScreen(window._menuScreen, '');
  };

  window.connBackToDash = function () {
    window._showScreen(dashboardEl, 'connecteurs');
    updateDashboard();
  };

  // ============================================
  // DRILL LAUNCHERS
  // ============================================

  window.connStartExpress = function () {
    drill = 'express';
    var cats = getActiveCats();
    deck = Object.keys(cats).map(function (cat) {
      return { category: cat, connectors: cats[cat] };
    });
    shuffle(deck);
    deckIdx = 0;
    window._showScreen(practiceEl, 'conn-express');
    showCard();
  };

  window.connStartVary = function () {
    drill = 'vary';
    var cats = getActiveCats();
    deck = [];
    getActiveConnectors().forEach(function (c) {
      if (c.tier <= 2) {
        for (var i = 0; i < c.categories.length; i++) {
          var cat = c.categories[i];
          if (cats[cat] && cats[cat].length > 1) {
            deck.push({
              source: c,
              category: cat,
              alternatives: cats[cat].filter(function (alt) {
                return alt.connector !== c.connector;
              })
            });
            break;
          }
        }
      }
    });
    shuffle(deck);
    deckIdx = 0;
    window._showScreen(practiceEl, 'conn-vary');
    showCard();
  };

  window.connStartRecognize = function () {
    drill = 'recognize';
    deck = getActiveConnectors().filter(function (c) {
      return store.mastered.indexOf(c.connector) === -1;
    });
    if (deck.length === 0) deck = getActiveConnectors();
    shuffle(deck);
    deckIdx = 0;
    sessionCorrect = 0;
    sessionTotal = 0;
    window._showScreen(practiceEl, 'conn-recognize');
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

    questionEl.classList.remove('hidden');
    answerEl.classList.add('hidden');
    counterEl.textContent = (deckIdx + 1) + ' / ' + deck.length;
    progressBarEl.style.width = (deckIdx / deck.length * 100) + '%';

    if (drill === 'express') showExpressQ();
    else if (drill === 'vary') showVaryQ();
    else showRecognizeQ();
  }

  // ---- EXPRESS ----

  function showExpressQ() {
    var item = deck[deckIdx];
    var desc = CAT_DESC[item.category] || '';
    var count = item.connectors.length;

    promptEl.innerHTML =
      '<div class="conn-mode-tag">Exprimer</div>' +
      '<div class="word">' + escapeHtml(item.category) + '</div>' +
      '<div class="prompt-text">' + escapeHtml(desc) + '</div>' +
      '<div class="conn-challenge">' + count + ' connecteurs — combien pouvez-vous en trouver ?</div>';

    answerAreaEl.innerHTML =
      '<button class="conn-reveal-btn" onclick="connReveal()">Révéler</button>';
  }

  function showExpressA() {
    var item = deck[deckIdx];
    var sorted = item.connectors.slice().sort(function (a, b) {
      return a.tier - b.tier;
    });

    var html = '<div class="conn-answer-title">' + escapeHtml(item.category) +
      ' <span class="conn-answer-count">(' + sorted.length + ')</span></div>';
    html += '<div class="conn-list">';
    sorted.forEach(function (c) {
      var reg = REGISTER_FR[c.register] || c.register;
      var subj = c.subjonctif ? '<span class="conn-subj">+subj.</span>' : '';
      html +=
        '<div class="conn-row">' +
          '<div class="conn-row-main">' +
            '<span class="conn-name">' + escapeHtml(c.connector) + '</span>' +
            subj +
          '</div>' +
          '<div class="conn-row-detail">' +
            '<span class="conn-trans">' + escapeHtml(c.translation) + '</span>' +
            '<span class="conn-reg conn-reg-' + c.register + '">' + reg + '</span>' +
          '</div>' +
        '</div>';
    });
    html += '</div>';

    cardAnswerEl.className = 'card conn-card';
    cardAnswerEl.innerHTML = html;
    footerEl.innerHTML =
      '<button class="next-btn" onclick="connNext()">Suivant &rarr;</button>';
  }

  // ---- VARY ----

  function showVaryQ() {
    var item = deck[deckIdx];
    promptEl.innerHTML =
      '<div class="conn-mode-tag">Varier</div>' +
      '<div class="conn-cat-label">' + escapeHtml(item.category) + '</div>' +
      '<div class="word">' + escapeHtml(item.source.connector) + '</div>' +
      '<div class="conn-trans-hint">' + escapeHtml(item.source.translation) + '</div>' +
      '<div class="prompt-text">Comment dire autrement ?</div>';

    answerAreaEl.innerHTML =
      '<button class="conn-reveal-btn" onclick="connReveal()">Révéler</button>';
  }

  function showVaryA() {
    var item = deck[deckIdx];
    var sorted = item.alternatives.slice().sort(function (a, b) {
      return a.tier - b.tier;
    });

    var html = '<div class="conn-answer-title">Alternatives à «\u00A0' +
      escapeHtml(item.source.connector) + '\u00A0»</div>';
    html += '<div class="conn-list">';
    sorted.forEach(function (c) {
      var reg = REGISTER_FR[c.register] || c.register;
      var subj = c.subjonctif ? '<span class="conn-subj">+subj.</span>' : '';
      html +=
        '<div class="conn-row">' +
          '<div class="conn-row-main">' +
            '<span class="conn-name">' + escapeHtml(c.connector) + '</span>' +
            subj +
          '</div>' +
          '<div class="conn-row-detail">' +
            '<span class="conn-trans">' + escapeHtml(c.translation) + '</span>' +
            '<span class="conn-reg conn-reg-' + c.register + '">' + reg + '</span>' +
          '</div>' +
        '</div>';
    });
    html += '</div>';

    cardAnswerEl.className = 'card conn-card';
    cardAnswerEl.innerHTML = html;
    footerEl.innerHTML =
      '<button class="next-btn" onclick="connNext()">Suivant &rarr;</button>';
  }

  // ---- RECOGNIZE ----

  function showRecognizeQ() {
    var item = deck[deckIdx];
    var correctCats = item.categories;

    var allCats = Object.keys(CAT_DESC);
    var distractors = shuffle(allCats.filter(function (c) {
      return correctCats.indexOf(c) === -1;
    }));

    var options = shuffle([correctCats[0]].concat(distractors.slice(0, 3)));

    promptEl.innerHTML =
      '<div class="conn-mode-tag">Reconnaître</div>' +
      '<div class="word">' + escapeHtml(item.connector) + '</div>' +
      (item.subjonctif ? '<div class="conn-subj-hint">+ subjonctif</div>' : '') +
      '<div class="prompt-text">Quelle fonction ?</div>';

    var btns = '';
    options.forEach(function (cat) {
      btns +=
        '<button class="answer-btn conn-cat-opt" onclick="connAnswer(\'' +
        cat.replace(/'/g, "\\'") + '\')">' +
        escapeHtml(cat) + '<span class="conn-cat-opt-desc">' +
        escapeHtml(CAT_DESC[cat] || '') + '</span></button>';
    });
    answerAreaEl.innerHTML = '<div class="conn-cat-grid">' + btns + '</div>';
  }

  window.connAnswer = function (choice) {
    var item = deck[deckIdx];
    var isCorrect = item.categories.indexOf(choice) !== -1;

    sessionTotal++;
    if (isCorrect) sessionCorrect++;

    questionEl.classList.add('hidden');
    answerEl.classList.remove('hidden');

    var reg = REGISTER_FR[item.register] || item.register;
    var fb = isCorrect ? 'Correct !' : 'Incorrect';
    var fbClass = isCorrect ? 'correct-text' : 'incorrect-text';

    // Gather alternatives from same categories
    var altSet = {};
    item.categories.forEach(function (cat) {
      if (catIndex[cat]) {
        catIndex[cat].forEach(function (c) {
          if (c.connector !== item.connector) altSet[c.connector] = true;
        });
      }
    });
    var altArr = Object.keys(altSet).slice(0, 8);

    var html =
      '<div class="feedback ' + fbClass + '">' + fb + '</div>' +
      '<div class="answer-word">' + escapeHtml(item.connector) + '</div>' +
      '<div class="conn-detail-cats">' + item.categories.map(escapeHtml).join(' · ') + '</div>' +
      '<div class="conn-detail-trans">' + escapeHtml(item.translation) + '</div>' +
      '<div class="conn-detail-reg conn-reg-' + item.register + '">' + reg + '</div>' +
      '<div class="conn-detail-usage">' + escapeHtml(item.usage_note) + '</div>' +
      '<div class="conn-detail-ex">' + escapeHtml(item.example_fr) + '</div>' +
      '<div class="conn-detail-ex-en">' + escapeHtml(item.example_en) + '</div>';

    if (item.subjonctif) {
      html += '<div class="conn-subj-badge">+ subjonctif</div>';
    }

    if (altArr.length > 0) {
      html += '<div class="conn-alt-section"><span class="conn-alt-label">Voir aussi : </span>' +
        altArr.map(escapeHtml).join(', ') + '</div>';
    }

    cardAnswerEl.className = 'card conn-card';
    cardAnswerEl.innerHTML = html;

    var isMastered = store.mastered.indexOf(item.connector) !== -1;
    footerEl.innerHTML =
      '<label class="mastered-label">' +
        '<input type="checkbox" id="conn-mastered-chk"' + (isMastered ? ' checked' : '') + '>' +
        '<span>Maîtrisé</span>' +
      '</label>' +
      '<button class="next-btn" onclick="connNext()">Suivant &rarr;</button>';
  };

  // ---- REVEAL (express + vary) ----

  window.connReveal = function () {
    questionEl.classList.add('hidden');
    answerEl.classList.remove('hidden');
    if (drill === 'express') showExpressA();
    else showVaryA();
  };

  // ---- NEXT ----

  window.connNext = function () {
    if (drill === 'recognize') {
      var chk = document.getElementById('conn-mastered-chk');
      var item = deck[deckIdx];
      var idx = store.mastered.indexOf(item.connector);
      if (chk && chk.checked && idx === -1) {
        store.mastered.push(item.connector);
        saveStore();
      } else if (chk && !chk.checked && idx !== -1) {
        store.mastered.splice(idx, 1);
        saveStore();
      }
    }
    deckIdx++;
    showCard();
  };

  function showComplete() {
    questionEl.classList.add('hidden');
    answerEl.classList.remove('hidden');

    var msg = 'Terminé !';
    if (drill === 'recognize' && sessionTotal > 0) {
      msg += ' ' + sessionCorrect + ' / ' + sessionTotal + ' correct' +
        (sessionCorrect !== 1 ? 's' : '');
    }

    cardAnswerEl.className = 'card conn-card';
    cardAnswerEl.innerHTML =
      '<div class="complete-emoji">&#127881;</div>' +
      '<h2>Bravo !</h2>' +
      '<p style="color:#666;margin-top:8px">' + msg + '</p>';
    footerEl.innerHTML =
      '<button class="next-btn" onclick="connBackToDash()">Retour</button>';
  }

  // ============================================
  // RESET
  // ============================================

  window.connResetConfirm = function () {
    if (confirm('Réinitialiser la progression des connecteurs ?')) {
      store = { mastered: [] };
      saveStore();
      updateDashboard();
    }
  };

  // ============================================
  // INIT
  // ============================================

  buildIndex();
  updateDashboard();

})();
