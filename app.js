(function () {
  "use strict";

  // ============================================
  // DATA
  // ============================================

  var NOUNS = [
    { word: "temps", gender: "le", hint: "" },
    { word: "année", gender: "la", hint: "-ée" },
    { word: "jour", gender: "le", hint: "" },
    { word: "fois", gender: "la", hint: "" },
    { word: "homme", gender: "le", hint: "sens" },
    { word: "femme", gender: "la", hint: "sens" },
    { word: "monde", gender: "le", hint: "" },
    { word: "vie", gender: "la", hint: "-ie" },
    { word: "main", gender: "la", hint: "except." },
    { word: "chose", gender: "la", hint: "" },
    { word: "pays", gender: "le", hint: "" },
    { word: "moment", gender: "le", hint: "-ment" },
    { word: "ville", gender: "la", hint: "" },
    { word: "maison", gender: "la", hint: "-son" },
    { word: "travail", gender: "le", hint: "-ail" },
    { word: "place", gender: "la", hint: "" },
    { word: "question", gender: "la", hint: "-tion" },
    { word: "gouvernement", gender: "le", hint: "-ment" },
    { word: "enfant", gender: "le/la", hint: "les deux" },
    { word: "problème", gender: "le", hint: "grec" },
    { word: "groupe", gender: "le", hint: "" },
    { word: "point", gender: "le", hint: "" },
    { word: "partie", gender: "la", hint: "-ie" },
    { word: "famille", gender: "la", hint: "-ille" },
    { word: "droit", gender: "le", hint: "" },
    { word: "cas", gender: "le", hint: "" },
    { word: "guerre", gender: "la", hint: "double+e" },
    { word: "nombre", gender: "le", hint: "" },
    { word: "raison", gender: "la", hint: "-son" },
    { word: "exemple", gender: "le", hint: "" },
    { word: "mot", gender: "le", hint: "" },
    { word: "eau", gender: "la", hint: "except." },
    { word: "corps", gender: "le", hint: "" },
    { word: "idée", gender: "la", hint: "-ée" },
    { word: "système", gender: "le", hint: "grec" },
    { word: "situation", gender: "la", hint: "-tion" },
    { word: "histoire", gender: "la", hint: "-oire" },
    { word: "école", gender: "la", hint: "" },
    { word: "terre", gender: "la", hint: "double+e" },
    { word: "société", gender: "la", hint: "-té" },
    { word: "mois", gender: "le", hint: "" },
    { word: "côté", gender: "le", hint: "except." },
    { word: "rue", gender: "la", hint: "-ue" },
    { word: "livre", gender: "le", hint: "" },
    { word: "bureau", gender: "le", hint: "-eau" },
    { word: "heure", gender: "la", hint: "-eure" },
    { word: "porte", gender: "la", hint: "" },
    { word: "téléphone", gender: "le", hint: "-phone" },
    { word: "personne", gender: "la", hint: "-onne" },
    { word: "nuit", gender: "la", hint: "" }
  ];

  var ENDINGS = [
    // Base rules
    { ending: "-tion / -sion / -aison", gender: "f", examples: "la situation, la décision, la question, la maison, la raison", exceptions: "(aucune)", category: "base" },
    { ending: "consonne finale (sauf -tion/-sion/-aison)", gender: "m", examples: "le temps, le jour, le pays, le point, le droit, le cas", exceptions: "la main, la nuit, la fois, la fin, la part, la mort, la dent, la fleur, la peur, la mer", category: "base" },
    // Masculine endings
    { ending: "-age", gender: "m", examples: "le voyage, le message, le ménage", exceptions: "la plage, la page, l'image, la cage", category: "masc" },
    { ending: "-isme", gender: "m", examples: "le tourisme, le capitalisme, le réalisme", exceptions: "(aucune)", category: "masc" },
    { ending: "-eau", gender: "m", examples: "le bateau, le chapeau, le bureau", exceptions: "la peau, l'eau", category: "masc" },
    { ending: "-ège", gender: "m", examples: "le collège, le piège, le privilège", exceptions: "(aucune)", category: "masc" },
    { ending: "-phone", gender: "m", examples: "le téléphone, le microphone", exceptions: "(aucune)", category: "masc" },
    { ending: "-scope", gender: "m", examples: "le microscope, le télescope", exceptions: "(aucune)", category: "masc" },
    { ending: "-acle", gender: "m", examples: "le spectacle, l'obstacle, le miracle", exceptions: "(aucune)", category: "masc" },
    { ending: "-ange", gender: "m", examples: "le mélange, l'ange, le change", exceptions: "la vidange, la louange, la grange", category: "masc" },
    { ending: "-o", gender: "m", examples: "le vélo, le métro, le piano", exceptions: "la moto, la radio, la photo (abrév. fém.)", category: "masc" },
    { ending: "grec / latin en -e", gender: "m", examples: "le problème, le système, le thème", exceptions: "(aucune)", category: "masc" },
    // Feminine endings
    { ending: "-té", gender: "f", examples: "la liberté, la société, la santé", exceptions: "le côté, le comité, le traité", category: "fem" },
    { ending: "-ée", gender: "f", examples: "la journée, l'idée, la pensée", exceptions: "le musée, le lycée, le trophée", category: "fem" },
    { ending: "-ure", gender: "f", examples: "la voiture, la nature, la culture", exceptions: "le murmure", category: "fem" },
    { ending: "-ance / -ence", gender: "f", examples: "la France, la patience, la violence", exceptions: "le silence", category: "fem" },
    { ending: "-ie", gender: "f", examples: "la vie, la philosophie, la maladie", exceptions: "le génie, l'incendie", category: "fem" },
    { ending: "-oire", gender: "f", examples: "l'histoire, la mémoire, la victoire", exceptions: "le territoire, le laboratoire", category: "fem" },
    { ending: "-ose", gender: "f", examples: "la chose, la rose, la dose, la prose", exceptions: "(aucune)", category: "fem" },
    { ending: "-ace", gender: "f", examples: "la place, la glace, la surface", exceptions: "l'espace (masc.)", category: "fem" },
    { ending: "-ue", gender: "f", examples: "la rue, la vue, la statue, la revue", exceptions: "(rare)", category: "fem" },
    { ending: "-ole", gender: "f", examples: "l'école, la parole, la console", exceptions: "le rôle, le contrôle", category: "fem" },
    { ending: "-onne", gender: "f", examples: "la personne, la couronne, la colonne", exceptions: "(aucune)", category: "fem" },
    { ending: "-eure", gender: "f", examples: "l'heure, la demeure", exceptions: "(aucune)", category: "fem" },
    { ending: "-ise", gender: "f", examples: "la surprise, la crise, l'entreprise", exceptions: "(aucune)", category: "fem" },
    { ending: "-ine", gender: "f", examples: "la machine, la cuisine, la routine", exceptions: "le magazine", category: "fem" },
    { ending: "-ude", gender: "f", examples: "l'attitude, l'étude, la certitude", exceptions: "(aucune)", category: "fem" },
    { ending: "-esse", gender: "f", examples: "la jeunesse, la richesse, la vitesse", exceptions: "(aucune)", category: "fem" },
    { ending: "-aison", gender: "f", examples: "la livraison, la comparaison", exceptions: "(aucune)", category: "fem" },
    { ending: "-ade", gender: "f", examples: "la salade, la promenade, la façade", exceptions: "le stade", category: "fem" },
    { ending: "-ère", gender: "f", examples: "la rivière, la lumière, la frontière", exceptions: "le cimetière, le caractère", category: "fem" },
    { ending: "-ette", gender: "f", examples: "la fourchette, la cigarette, la dette", exceptions: "le squelette", category: "fem" },
    { ending: "-ille", gender: "f", examples: "la ville, la fille, la famille", exceptions: "le gorille", category: "fem" },
    { ending: "-elle", gender: "f", examples: "la demoiselle, la poubelle, la gazelle", exceptions: "(aucune)", category: "fem" },
    { ending: "cons. double + e", gender: "f", examples: "la terre, la guerre, la femme", exceptions: "l'homme, le gramme", category: "fem" }
  ];

  // ============================================
  // STORAGE
  // ============================================

  var STORAGE_KEY = "frenchGender_v1";

  function loadData() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore */ }
    return { masteredNouns: [], masteredEndings: [] };
  }

  function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  var store = loadData();

  // ============================================
  // STATE
  // ============================================

  var currentMode = null; // "nouns" or "endings"
  var deck = [];
  var deckIndex = 0;
  var sessionCorrect = 0;
  var sessionTotal = 0;

  // ============================================
  // DOM REFERENCES
  // ============================================

  var menuScreen = document.getElementById("menu");
  var practiceScreen = document.getElementById("practice");
  var completeScreen = document.getElementById("complete");

  var nounsProgressEl = document.getElementById("nouns-progress");
  var endingsProgressEl = document.getElementById("endings-progress");

  var cardCounter = document.getElementById("card-counter");
  var progressBar = document.getElementById("progress-bar");

  var questionState = document.getElementById("question-state");
  var answerState = document.getElementById("answer-state");
  var cardPrompt = document.getElementById("card-prompt");
  var answerButtons = document.getElementById("answer-buttons");
  var cardAnswer = document.getElementById("card-answer");
  var masteredCheck = document.getElementById("mastered-check");
  var nextBtn = document.getElementById("next-btn");
  var completeMsg = document.getElementById("complete-msg");

  // ============================================
  // UTILITY
  // ============================================

  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
    return arr;
  }

  function showScreen(screen) {
    menuScreen.classList.remove("active");
    practiceScreen.classList.remove("active");
    completeScreen.classList.remove("active");
    screen.classList.add("active");
  }

  // ============================================
  // MENU
  // ============================================

  function updateMenuProgress() {
    nounsProgressEl.textContent = store.masteredNouns.length + " / " + NOUNS.length + " maîtrisés";
    endingsProgressEl.textContent = store.masteredEndings.length + " / " + ENDINGS.length + " maîtrisés";
  }

  window.startMode = function (mode) {
    currentMode = mode;
    deckIndex = 0;
    sessionCorrect = 0;
    sessionTotal = 0;

    if (mode === "nouns") {
      deck = NOUNS.filter(function (n) {
        return store.masteredNouns.indexOf(n.word) === -1;
      });
    } else {
      deck = ENDINGS.filter(function (e) {
        return store.masteredEndings.indexOf(e.ending) === -1;
      });
    }

    if (deck.length === 0) {
      showComplete("Tout est maîtrisé ! Utilisez le menu pour réinitialiser.");
      return;
    }

    shuffle(deck);
    showScreen(practiceScreen);
    showQuestion();
  };

  window.goToMenu = function () {
    showScreen(menuScreen);
    updateMenuProgress();
  };

  window.confirmReset = function () {
    if (confirm("Réinitialiser toute la progression ?")) {
      store = { masteredNouns: [], masteredEndings: [] };
      saveData(store);
      updateMenuProgress();
    }
  };

  // ============================================
  // PRACTICE: QUESTION
  // ============================================

  function showQuestion() {
    if (deckIndex >= deck.length) {
      showComplete("Vous avez terminé ! " + sessionCorrect + " / " + sessionTotal + " correct" + (sessionCorrect !== 1 ? "s" : "") + ".");
      return;
    }

    questionState.classList.remove("hidden");
    answerState.classList.add("hidden");
    masteredCheck.checked = false;

    var item = deck[deckIndex];
    cardCounter.textContent = (deckIndex + 1) + " / " + deck.length;
    progressBar.style.width = (deckIndex / deck.length * 100) + "%";

    if (currentMode === "nouns") {
      cardPrompt.innerHTML =
        '<div class="word">' + escapeHtml(item.word) + '</div>' +
        '<div class="prompt-text">le ou la ?</div>';

      answerButtons.innerHTML =
        '<button class="answer-btn masc" onclick="handleAnswer(\'le\')">le</button>' +
        '<button class="answer-btn fem" onclick="handleAnswer(\'la\')">la</button>';
    } else {
      cardPrompt.innerHTML =
        '<div class="word">' + escapeHtml(item.ending) + '</div>' +
        '<div class="prompt-text">masculin ou féminin ?</div>';

      answerButtons.innerHTML =
        '<button class="answer-btn masc" onclick="handleAnswer(\'m\')">Masculin</button>' +
        '<button class="answer-btn fem" onclick="handleAnswer(\'f\')">Féminin</button>';
    }
  }

  function escapeHtml(s) {
    var d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  // ============================================
  // PRACTICE: ANSWER
  // ============================================

  window.handleAnswer = function (choice) {
    var item = deck[deckIndex];
    var isCorrect;

    if (currentMode === "nouns") {
      if (item.gender === "le/la") {
        // enfant: accept either
        isCorrect = true;
      } else {
        isCorrect = (choice === item.gender);
      }
    } else {
      isCorrect = (choice === item.gender);
    }

    sessionTotal++;
    if (isCorrect) sessionCorrect++;

    questionState.classList.add("hidden");
    answerState.classList.remove("hidden");

    var feedbackClass = isCorrect ? "correct" : "incorrect";
    var feedbackText = isCorrect ? "Correct !" : "Incorrect";
    var feedbackTextClass = isCorrect ? "correct-text" : "incorrect-text";

    cardAnswer.className = "card " + feedbackClass;

    if (currentMode === "nouns") {
      var genderColor = (item.gender === "la") ? "fem-color" : "masc-color";
      var displayGender = item.gender;
      if (item.gender === "le/la") {
        genderColor = "masc-color";
        displayGender = "le/la";
      }

      var html =
        '<div class="feedback ' + feedbackTextClass + '">' + feedbackText + '</div>' +
        '<div class="answer-gender ' + genderColor + '">' + escapeHtml(displayGender) + '</div>' +
        '<div class="answer-word">' + escapeHtml(item.word) + '</div>';

      if (item.gender === "le/la") {
        html += '<div class="answer-hint">le/la — les deux</div>';
      } else if (item.hint) {
        html += '<div class="answer-hint">' + escapeHtml(item.hint) + '</div>';
      }

      cardAnswer.innerHTML = html;
    } else {
      var gColor = (item.gender === "f") ? "fem-color" : "masc-color";
      var gLabel = (item.gender === "f") ? "Féminin" : "Masculin";

      cardAnswer.innerHTML =
        '<div class="feedback ' + feedbackTextClass + '">' + feedbackText + '</div>' +
        '<div class="answer-word">' + escapeHtml(item.ending) + '</div>' +
        '<div class="answer-gender ' + gColor + '">' + gLabel + '</div>' +
        '<div class="answer-examples">' + escapeHtml(item.examples) + '</div>' +
        (item.exceptions !== "(aucune)" ? '<div class="answer-exceptions">Exceptions : ' + escapeHtml(item.exceptions) + '</div>' : '');
    }
  };

  // ============================================
  // NEXT CARD
  // ============================================

  nextBtn.addEventListener("click", function () {
    if (masteredCheck.checked) {
      var item = deck[deckIndex];
      if (currentMode === "nouns") {
        if (store.masteredNouns.indexOf(item.word) === -1) {
          store.masteredNouns.push(item.word);
        }
      } else {
        if (store.masteredEndings.indexOf(item.ending) === -1) {
          store.masteredEndings.push(item.ending);
        }
      }
      saveData(store);
    }

    deckIndex++;
    showQuestion();
  });

  // ============================================
  // COMPLETION
  // ============================================

  function showComplete(msg) {
    completeMsg.textContent = msg;
    showScreen(completeScreen);
  }

  // ============================================
  // INIT
  // ============================================

  updateMenuProgress();
})();
