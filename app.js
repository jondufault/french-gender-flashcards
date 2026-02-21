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

  // Rule info for noun flip-card details
  var NOUN_RULES = {
    "-ée":      { rule: "Noms en -ée → féminins", examples: "la journée, l'idée, la pensée", exceptions: "le musée, le lycée, le trophée" },
    "-ie":      { rule: "Noms en -ie → féminins", examples: "la vie, la philosophie, la maladie", exceptions: "le génie, l'incendie" },
    "-ment":    { rule: "Noms en -ment → masculins", examples: "le moment, le mouvement, le département", exceptions: "(aucune)" },
    "-son":     { rule: "Noms en -son/-aison → féminins", examples: "la raison, la saison, la chanson", exceptions: "(aucune)" },
    "-ail":     { rule: "Noms en -ail → masculins", examples: "le travail, le détail, le vitrail", exceptions: "(aucune)" },
    "-tion":    { rule: "Noms en -tion → féminins", examples: "la situation, l'attention, la nation", exceptions: "(aucune)" },
    "grec":     { rule: "Mots d'origine grecque en -ème → masculins", examples: "le problème, le système, le thème", exceptions: "(aucune)" },
    "-ille":    { rule: "Noms en -ille → féminins", examples: "la ville, la fille, la famille", exceptions: "le gorille" },
    "double+e": { rule: "Consonne double + e → féminins", examples: "la terre, la guerre, la femme", exceptions: "l'homme, le gramme" },
    "-té":      { rule: "Noms en -té → féminins", examples: "la liberté, la société, la santé", exceptions: "le côté, le comité, le traité" },
    "-ue":      { rule: "Noms en -ue → féminins", examples: "la rue, la vue, la statue", exceptions: "(rare)" },
    "-oire":    { rule: "Noms en -oire → féminins", examples: "l'histoire, la mémoire, la victoire", exceptions: "le territoire, le laboratoire" },
    "-eau":     { rule: "Noms en -eau → masculins", examples: "le bateau, le chapeau, le bureau", exceptions: "la peau, l'eau" },
    "-eure":    { rule: "Noms en -eure → féminins", examples: "l'heure, la demeure", exceptions: "(aucune)" },
    "-phone":   { rule: "Noms en -phone → masculins", examples: "le téléphone, le microphone", exceptions: "(aucune)" },
    "-onne":    { rule: "Noms en -onne → féminins", examples: "la personne, la couronne, la colonne", exceptions: "(aucune)" },
    "except.":  { rule: "Exception courante — à mémoriser" },
    "sens":     { rule: "Genre déterminé par le sens" }
  };

  function startsWithVowelSound(word) {
    return /^[aeéèêëiîïoôuûùüâäæœh]/i.test(word);
  }

  function articleFor(gender, word) {
    var vowel = startsWithVowelSound(word);
    if (gender === "le/la") return vowel ? "un/une" : "le/la";
    if (gender === "le") return vowel ? "un" : "le";
    if (gender === "la") return vowel ? "une" : "la";
    return gender;
  }

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

  var VERBS = [
    // A
    { verb: "s'abstenir", prep: "de", example: "Il s'abstient de fumer.", note: "" },
    { verb: "accepter", prep: "de", example: "Elle accepte de partir.", note: "" },
    { verb: "aider", prep: "à", example: "Il aide Marie à déménager.", note: "" },
    { verb: "aimer", prep: "", example: "J'aime voyager.", note: "" },
    { verb: "aller", prep: "", example: "Je vais chercher du pain.", note: "" },
    { verb: "s'amuser", prep: "à", example: "Il s'amuse à dessiner.", note: "" },
    { verb: "s'appliquer", prep: "à", example: "Elle s'applique à bien écrire.", note: "" },
    { verb: "apprendre", prep: "à", example: "J'apprends à nager.", note: "" },
    { verb: "arrêter", prep: "de", example: "Il arrête de fumer.", note: "" },
    { verb: "s'arrêter", prep: "de", example: "Il s'arrête de courir.", note: "" },
    { verb: "s'attendre", prep: "à", example: "Je m'attends à gagner.", note: "" },
    // C
    { verb: "cesser", prep: "de", example: "Il cesse de pleuvoir.", note: "" },
    { verb: "chercher", prep: "à", example: "Il cherche à comprendre.", note: "" },
    { verb: "choisir", prep: "de", example: "Elle choisit de rester.", note: "" },
    { verb: "commencer", prep: "à", example: "Il commence à pleuvoir.", note: "" },
    { verb: "conseiller", prep: "de", example: "Je conseille de partir tôt.", note: "" },
    { verb: "continuer", prep: "de", example: "Il continue de travailler.", note: "" },
    { verb: "contribuer", prep: "à", example: "Il contribue à améliorer les choses.", note: "" },
    { verb: "convaincre", prep: "de", example: "Il convainc Marie de venir.", note: "" },
    { verb: "craindre", prep: "de", example: "Je crains de tomber.", note: "" },
    { verb: "croire", prep: "", example: "Je crois comprendre.", note: "" },
    // D
    { verb: "décider", prep: "à", example: "Il décide Paul à venir.", note: "décider qqn à faire qqch" },
    { verb: "se décider", prep: "à", example: "Elle se décide à partir.", note: "" },
    { verb: "demander", prep: "de", example: "Il demande de se taire.", note: "mais : je demande à faire qqch" },
    { verb: "désirer", prep: "", example: "Je désire voyager.", note: "" },
    { verb: "détester", prep: "", example: "Il déteste attendre.", note: "" },
    { verb: "devoir", prep: "", example: "Je dois partir.", note: "" },
    { verb: "dire", prep: "de", example: "Il dit de venir.", note: "" },
    { verb: "donner", prep: "à", example: "Il donne à manger au chat.", note: "" },
    // E
    { verb: "écouter", prep: "", example: "J'écoute chanter les oiseaux.", note: "" },
    { verb: "empêcher", prep: "de", example: "Il empêche Paul de sortir.", note: "" },
    { verb: "encourager", prep: "à", example: "Elle encourage Paul à lire.", note: "" },
    { verb: "s'ennuyer", prep: "de", example: "Il s'ennuie de travailler seul.", note: "" },
    { verb: "enseigner", prep: "à", example: "Il enseigne à lire aux enfants.", note: "" },
    { verb: "entendre", prep: "", example: "J'entends chanter les oiseaux.", note: "" },
    { verb: "espérer", prep: "", example: "J'espère réussir.", note: "" },
    { verb: "essayer", prep: "de", example: "Il essaie de comprendre.", note: "" },
    { verb: "éviter", prep: "de", example: "Il évite de sortir.", note: "" },
    { verb: "s'excuser", prep: "de", example: "Il s'excuse d'être en retard.", note: "" },
    { verb: "exiger", prep: "de", example: "Il exige de partir.", note: "" },
    // F
    { verb: "falloir", prep: "", example: "Il faut partir.", note: "impersonnel" },
    { verb: "se fatiguer", prep: "de", example: "Il se fatigue de répéter.", note: "" },
    { verb: "féliciter", prep: "de", example: "Je le félicite d'avoir réussi.", note: "" },
    { verb: "finir", prep: "de", example: "Il finit de manger.", note: "" },
    // H
    { verb: "habituer", prep: "à", example: "Il habitue Paul à se lever tôt.", note: "" },
    { verb: "s'habituer", prep: "à", example: "Je m'habitue à vivre ici.", note: "" },
    { verb: "hésiter", prep: "à", example: "Il hésite à répondre.", note: "" },
    // I
    { verb: "interdire", prep: "de", example: "Il interdit de fumer.", note: "" },
    { verb: "inviter", prep: "à", example: "Il invite Marie à danser.", note: "" },
    // J
    { verb: "jouer", prep: "à", example: "Il joue à faire le clown.", note: "" },
    // L
    { verb: "laisser", prep: "", example: "Laisse-moi passer.", note: "" },
    // M
    { verb: "manquer", prep: "de", example: "Il manque de tomber.", note: "" },
    { verb: "menacer", prep: "de", example: "Il menace de partir.", note: "" },
    { verb: "mériter", prep: "de", example: "Il mérite de gagner.", note: "" },
    { verb: "se mettre", prep: "à", example: "Il se met à pleuvoir.", note: "" },
    // N
    { verb: "négliger", prep: "de", example: "Il néglige de répondre.", note: "" },
    // O
    { verb: "obliger", prep: "à", example: "Il oblige Paul à rester.", note: "" },
    { verb: "s'occuper", prep: "de", example: "Il s'occupe de ranger.", note: "" },
    { verb: "oser", prep: "", example: "Il ose parler.", note: "" },
    { verb: "oublier", prep: "de", example: "J'oublie de fermer la porte.", note: "" },
    // P
    { verb: "parler", prep: "de", example: "Il parle de déménager.", note: "" },
    { verb: "passer", prep: "", example: "Il passe voir Marie.", note: "" },
    { verb: "penser", prep: "à", example: "Il pense à partir.", note: "" },
    { verb: "permettre", prep: "de", example: "Il permet de sortir.", note: "" },
    { verb: "persuader", prep: "de", example: "Il persuade Marie de venir.", note: "" },
    { verb: "se plaindre", prep: "de", example: "Il se plaint de travailler trop.", note: "" },
    { verb: "pouvoir", prep: "", example: "Je peux nager.", note: "" },
    { verb: "préférer", prep: "", example: "Je préfère rester.", note: "" },
    { verb: "se préparer", prep: "à", example: "Il se prépare à partir.", note: "" },
    { verb: "promettre", prep: "de", example: "Il promet de venir.", note: "" },
    { verb: "proposer", prep: "de", example: "Il propose de sortir.", note: "" },
    // R
    { verb: "se rappeler", prep: "", example: "Je me rappelle avoir vu ce film.", note: "" },
    { verb: "recommander", prep: "de", example: "Il recommande de lire ce livre.", note: "" },
    { verb: "refuser", prep: "de", example: "Il refuse de payer.", note: "" },
    { verb: "regarder", prep: "", example: "Il regarde tomber la neige.", note: "" },
    { verb: "regretter", prep: "de", example: "Il regrette d'être parti.", note: "" },
    { verb: "remercier", prep: "de", example: "Je le remercie d'être venu.", note: "" },
    { verb: "renoncer", prep: "à", example: "Il renonce à comprendre.", note: "" },
    { verb: "réussir", prep: "à", example: "Il réussit à nager.", note: "" },
    { verb: "rêver", prep: "de", example: "Il rêve de voyager.", note: "de = penser, désirer" },
    { verb: "risquer", prep: "de", example: "Il risque de pleuvoir.", note: "" },
    // S
    { verb: "savoir", prep: "", example: "Il sait nager.", note: "" },
    { verb: "servir", prep: "à", example: "Ça sert à couper.", note: "" },
    { verb: "songer", prep: "à", example: "Il songe à démissionner.", note: "" },
    { verb: "souhaiter", prep: "de", example: "Il souhaite de réussir.", note: "" },
    { verb: "se souvenir", prep: "de", example: "Il se souvient d'avoir ri.", note: "" },
    { verb: "suggérer", prep: "de", example: "Il suggère de partir.", note: "" },
    // T
    { verb: "tenir", prep: "à", example: "Il tient à venir.", note: "" },
    { verb: "tenter", prep: "de", example: "Il tente de comprendre.", note: "" },
    // V
    { verb: "venir", prep: "", example: "Viens voir !", note: "" },
    { verb: "vouloir", prep: "", example: "Je veux partir.", note: "" }
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
    return { masteredNouns: [], masteredEndings: [], masteredVerbs: [] };
  }

  function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  var store = loadData();

  // ============================================
  // STATE
  // ============================================

  var currentMode = null; // "nouns", "endings", or "verbs"
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
  var verbsProgressEl = document.getElementById("verbs-progress");

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
    verbsProgressEl.textContent = (store.masteredVerbs || []).length + " / " + VERBS.length + " maîtrisés";
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
    } else if (mode === "endings") {
      deck = ENDINGS.filter(function (e) {
        return store.masteredEndings.indexOf(e.ending) === -1;
      });
    } else {
      if (!store.masteredVerbs) store.masteredVerbs = [];
      deck = VERBS.filter(function (v) {
        return store.masteredVerbs.indexOf(v.verb) === -1;
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
      store = { masteredNouns: [], masteredEndings: [], masteredVerbs: [] };
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

    answerButtons.className = "answer-buttons";

    if (currentMode === "nouns") {
      var useUnUne = startsWithVowelSound(item.word);
      var promptText = useUnUne ? "un ou une ?" : "le ou la ?";
      var mascLabel = useUnUne ? "un" : "le";
      var femLabel = useUnUne ? "une" : "la";

      cardPrompt.innerHTML =
        '<div class="word">' + escapeHtml(item.word) + '</div>' +
        '<div class="prompt-text">' + promptText + '</div>';

      answerButtons.innerHTML =
        '<button class="answer-btn masc" onclick="handleAnswer(\'' + mascLabel + '\')">' + mascLabel + '</button>' +
        '<button class="answer-btn fem" onclick="handleAnswer(\'' + femLabel + '\')">' + femLabel + '</button>';
    } else if (currentMode === "endings") {
      cardPrompt.innerHTML =
        '<div class="word">' + escapeHtml(item.ending) + '</div>' +
        '<div class="prompt-text">masculin ou féminin ?</div>';

      answerButtons.innerHTML =
        '<button class="answer-btn masc" onclick="handleAnswer(\'m\')">Masculin</button>' +
        '<button class="answer-btn fem" onclick="handleAnswer(\'f\')">Féminin</button>';
    } else {
      cardPrompt.innerHTML =
        '<div class="word">' + escapeHtml(item.verb) + ' ___ faire qqch</div>' +
        '<div class="prompt-text">à, de ou direct ?</div>';

      answerButtons.className = "answer-buttons three-col";
      answerButtons.innerHTML =
        '<button class="answer-btn prep" onclick="handleAnswer(\'à\')">à</button>' +
        '<button class="answer-btn prep" onclick="handleAnswer(\'de\')">de</button>' +
        '<button class="answer-btn prep" onclick="handleAnswer(\'\')">(direct)</button>';
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
        isCorrect = true;
      } else {
        var correctArticle = articleFor(item.gender, item.word);
        isCorrect = (choice === correctArticle);
      }
    } else if (currentMode === "endings") {
      isCorrect = (choice === item.gender);
    } else {
      isCorrect = (choice === item.prep);
    }

    sessionTotal++;
    if (isCorrect) sessionCorrect++;

    questionState.classList.add("hidden");
    answerState.classList.remove("hidden");

    var feedbackText = isCorrect ? "Correct !" : "Incorrect";
    var feedbackTextClass = isCorrect ? "correct-text" : "incorrect-text";

    // Card color based on mode
    if (currentMode === "verbs") {
      cardAnswer.className = "card prep-answer";
    } else {
      var genderClass;
      if (currentMode === "nouns") {
        genderClass = (item.gender === "la") ? "gender-fem" : "gender-masc";
      } else {
        genderClass = (item.gender === "f") ? "gender-fem" : "gender-masc";
      }
      cardAnswer.className = "card " + genderClass;
    }

    if (currentMode === "nouns") {
      var displayArticle = articleFor(item.gender, item.word);
      var genderColor = (item.gender === "la") ? "fem-color" : "masc-color";

      var html =
        '<div class="feedback ' + feedbackTextClass + '">' + feedbackText + '</div>' +
        '<div class="answer-gender ' + genderColor + '">' + escapeHtml(displayArticle) + '</div>' +
        '<div class="answer-word">' + escapeHtml(item.word) + '</div>';

      if (item.gender === "le/la") {
        html += '<div class="answer-hint">les deux genres acceptés</div>';
      } else if (item.hint) {
        var ruleInfo = NOUN_RULES[item.hint];
        if (ruleInfo) {
          html += '<div class="answer-hint">' + escapeHtml(ruleInfo.rule) + '</div>';
          if (ruleInfo.examples) {
            html += '<div class="answer-examples">' + escapeHtml(ruleInfo.examples) + '</div>';
          }
          if (ruleInfo.exceptions && ruleInfo.exceptions !== "(aucune)") {
            html += '<div class="answer-exceptions">Exceptions : ' + escapeHtml(ruleInfo.exceptions) + '</div>';
          }
        } else {
          html += '<div class="answer-hint">' + escapeHtml(item.hint) + '</div>';
        }
      }

      cardAnswer.innerHTML = html;
    } else if (currentMode === "endings") {
      var gColor = (item.gender === "f") ? "fem-color" : "masc-color";
      var gLabel = (item.gender === "f") ? "Féminin" : "Masculin";

      cardAnswer.innerHTML =
        '<div class="feedback ' + feedbackTextClass + '">' + feedbackText + '</div>' +
        '<div class="answer-word">' + escapeHtml(item.ending) + '</div>' +
        '<div class="answer-gender ' + gColor + '">' + gLabel + '</div>' +
        '<div class="answer-examples">' + escapeHtml(item.examples) + '</div>' +
        (item.exceptions !== "(aucune)" ? '<div class="answer-exceptions">Exceptions : ' + escapeHtml(item.exceptions) + '</div>' : '');
    } else {
      var prepLabel = item.prep === "" ? "(direct)" : item.prep;
      var construction = item.prep === "" ? (item.verb + " faire qqch") : (item.verb + " " + item.prep + " faire qqch");

      var vhtml =
        '<div class="feedback ' + feedbackTextClass + '">' + feedbackText + '</div>' +
        '<div class="answer-word">' + escapeHtml(construction) + '</div>' +
        '<div class="answer-gender" style="color:#4A235A">' + escapeHtml(prepLabel) + '</div>' +
        '<div class="answer-examples">' + escapeHtml(item.example) + '</div>';

      if (item.note) {
        vhtml += '<div class="answer-exceptions">' + escapeHtml(item.note) + '</div>';
      }

      cardAnswer.innerHTML = vhtml;
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
      } else if (currentMode === "endings") {
        if (store.masteredEndings.indexOf(item.ending) === -1) {
          store.masteredEndings.push(item.ending);
        }
      } else {
        if (!store.masteredVerbs) store.masteredVerbs = [];
        if (store.masteredVerbs.indexOf(item.verb) === -1) {
          store.masteredVerbs.push(item.verb);
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
