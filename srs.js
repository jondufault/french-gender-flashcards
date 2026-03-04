(function () {
  "use strict";

  // ============================================
  // 500 MOST COMMON FRENCH NOUNS (by frequency)
  // [word, gender] — rank is array index + 1
  // ============================================

  var W = [
    ["temps","m"],["fois","f"],["homme","m"],["vie","f"],["jour","m"],["chose","f"],["monde","m"],["femme","f"],
    ["enfant","m"],["main","f"],["tête","f"],["père","m"],["moment","m"],["oeil","m"],["mot","m"],["pays","m"],
    ["mère","f"],["fille","f"],["partie","f"],["cas","m"],["monsieur","m"],["fait","m"],["place","f"],["coup","m"],
    ["heure","f"],["an","m"],["question","f"],["nuit","f"],["gens","m"],["travail","m"],["eau","f"],["année","f"],
    ["fils","m"],["air","m"],["état","m"],["point","m"],["raison","f"],["terre","f"],["guerre","f"],["nom","m"],
    ["côté","m"],["histoire","f"],["porte","f"],["maison","f"],["idée","f"],["ami","m"],["fond","m"],["voix","f"],
    ["frère","m"],["regard","m"],["sorte","f"],["dieu","m"],["rue","f"],["parole","f"],["roi","m"],["exemple","m"],
    ["manière","f"],["bout","m"],["ordre","m"],["loi","f"],["corps","m"],["pied","m"],["lettre","f"],["esprit","m"],
    ["effet","m"],["forme","f"],["mort","f"],["ville","f"],["personne","f"],["soir","m"],["sens","m"],["force","f"],
    ["lumière","f"],["famille","f"],["milieu","m"],["genre","m"],["bras","m"],["argent","m"],["chambre","f"],
    ["livre","m"],["groupe","m"],["compte","m"],["endroit","m"],["route","f"],["classe","f"],["besoin","m"],
    ["affaire","f"],["politique","f"],["service","m"],["projet","m"],["gouvernement","m"],["société","f"],
    ["pouvoir","m"],["pensée","f"],["figure","f"],["problème","m"],["marche","f"],["mois","m"],["mouvement","m"],
    ["silence","m"],["attention","f"],["lieu","m"],["bonheur","m"],["système","m"],["situation","f"],
    ["intérêt","m"],["droit","m"],["peur","f"],["amour","m"],["sol","m"],["nature","f"],["chemin","m"],
    ["coeur","m"],["ciel","m"],["pas","m"],["âme","f"],["matin","m"],["soeur","f"],["vérité","f"],["suite","f"],
    ["face","f"],["bord","m"],["action","f"],["beauté","f"],["mesure","f"],["ministre","m"],["doute","m"],
    ["chanson","f"],["pierre","f"],["sentiment","m"],["prison","f"],["rapport","m"],["président","m"],["moyen","m"],
    ["condition","f"],["sang","m"],["journal","m"],["direction","f"],["erreur","f"],["soleil","m"],["image","f"],
    ["santé","f"],["voiture","f"],["prix","m"],["rêve","m"],["départ","m"],["bruit","m"],["vue","f"],
    ["passage","m"],["mari","m"],["mur","m"],["fenêtre","f"],["minute","f"],["musique","f"],["recherche","f"],
    ["membre","m"],["centre","m"],["type","m"],["parti","m"],["plan","m"],["médecin","m"],["espèce","f"],
    ["caractère","m"],["résultat","m"],["peine","f"],["souvenir","m"],["rôle","m"],["tour","m"],["table","f"],
    ["lit","m"],["entrée","f"],["âge","m"],["sujet","m"],["relation","f"],["mission","f"],["époque","f"],
    ["signe","m"],["geste","m"],["ombre","f"],["larme","f"],["avenir","m"],["paix","f"],["joie","f"],["coin","m"],
    ["jardin","m"],["siècle","m"],["culture","f"],["art","m"],["folie","f"],["impression","f"],["chef","m"],
    ["honneur","m"],["dame","f"],["visage","m"],["courage","m"],["épaule","f"],["arbre","m"],["langue","f"],
    ["réponse","f"],["scène","f"],["marché","m"],["chance","f"],["cheval","m"],["ligne","f"],["pièce","f"],
    ["dos","m"],["école","f"],["danger","m"],["colère","f"],["vallée","f"],["église","f"],["secret","m"],
    ["salle","f"],["bête","f"],["train","m"],["film","m"],["douleur","f"],["chapitre","m"],["oncle","m"],
    ["champ","m"],["nombre","m"],["bureau","m"],["lèvre","f"],["voyage","m"],["terrain","m"],["effort","m"],
    ["défense","f"],["article","m"],["peuple","m"],["espoir","m"],["genou","m"],["volonté","f"],["poitrine","f"],
    ["sécurité","f"],["confiance","f"],["doigt","m"],["développement","m"],["bois","m"],["plaisir","m"],
    ["sourire","m"],["énergie","f"],["mémoire","f"],["niveau","m"],["cou","m"],["formation","f"],["réalité","f"],
    ["région","f"],["retour","m"],["arme","f"],["troupe","f"],["montagne","f"],["feu","m"],["front","m"],
    ["justice","f"],["position","f"],["différence","f"],["salon","m"],["demande","f"],["population","f"],
    ["début","m"],["bouche","f"],["colline","f"],["habitude","f"],["aide","f"],["armée","f"],["chapeau","m"],
    ["herbe","f"],["patron","m"],["valeur","f"],["couleur","f"],["victoire","f"],["conversation","f"],
    ["expérience","f"],["chien","m"],["importance","f"],["production","f"],["poste","m"],["maître","m"],
    ["choix","m"],["général","m"],["nation","f"],["programme","m"],["ensemble","m"],["autorité","f"],
    ["intérieur","m"],["reine","f"],["prince","m"],["nouvelle","f"],["papier","m"],["événement","m"],
    ["rivière","f"],["plaine","f"],["existence","f"],["bateau","m"],["conséquence","f"],["horizon","m"],
    ["industrie","f"],["intelligence","f"],["matière","f"],["nez","m"],["acte","m"],["apparence","f"],
    ["peau","f"],["dent","f"],["campagne","f"],["obligation","f"],["solution","f"],["combat","m"],
    ["communication","f"],["source","f"],["liberté","f"],["commission","f"],["étoile","f"],["objet","m"],
    ["animal","m"],["technique","f"],["puissance","f"],["chaise","f"],["compagnie","f"],["univers","m"],
    ["accident","m"],["souffrance","f"],["profession","f"],["joueur","m"],["oiseau","m"],["ventre","m"],
    ["étage","m"],["neige","f"],["désir","m"],["escalier","m"],["château","m"],["banque","f"],["aventure","f"],
    ["leçon","f"],["crise","f"],["vent","m"],["explication","f"],["structure","f"],["fête","f"],["marque","f"],
    ["méthode","f"],["science","f"],["principe","m"],["éducation","f"],["surface","f"],["limite","f"],
    ["opération","f"],["progrès","m"],["responsabilité","f"],["plante","f"],["rire","m"],["installation","f"],
    ["bâtiment","m"],["phénomène","m"],["croix","f"],["réaction","f"],["protection","f"],["oreille","f"],
    ["cigarette","f"],["palais","m"],["voisin","m"],["surprise","f"],["frontière","f"],["fleuve","m"],
    ["fortune","f"],["maladie","f"],["base","f"],["titre","m"],["semaine","f"],["élection","f"],["issue","f"],
    ["refus","m"],["décision","f"],["fonction","f"],["période","f"],["occupation","f"],["réforme","f"],
    ["hôtel","m"],["carrière","f"],["menace","f"],["démarche","f"],["pluie","f"],["intention","f"],
    ["plafond","m"],["dimension","f"],["cérémonie","f"],["chiffre","m"],["couverture","f"],["critique","f"],
    ["sable","m"],["plancher","m"],["poussière","f"],["toit","m"],["docteur","m"],["mode","f"],["trou","m"],
    ["flamme","f"],["catégorie","f"],["soutien","m"],["distance","f"],["corde","f"],["clé","f"],
    ["territoire","m"],["discipline","f"],["étranger","m"],["organisation","f"],["poème","m"],
    ["expression","f"],["représentation","f"],["tante","f"],["cousin","m"],["soldat","m"],["paysage","m"],
    ["espace","m"],["philosophie","f"],["religion","f"],["sommet","m"],["pratique","f"],["tradition","f"],
    ["séance","f"],["rive","f"],["contrôle","m"],["destin","m"],["spectacle","m"],["circonstance","f"],
    ["foule","f"],["ressource","f"],["mensonge","m"],["cercle","m"],["appartement","m"],["curé","m"],
    ["conscience","f"],["nuage","m"],["crainte","f"],["échange","m"],["réunion","f"],["feuille","f"],
    ["lune","f"],["saison","f"],["enquête","f"],["lac","m"],["poète","m"],["excuse","f"],["truc","m"],
    ["promesse","f"],["chaussure","f"],["somme","f"],["tâche","f"],["commerce","m"],["vertu","f"],
    ["budget","m"],["revenu","m"],["victime","f"],["dialogue","m"],["connaissance","f"],["influence","f"],
    ["analyse","f"],["compétence","f"],["morceau","m"],["mystère","m"],["portée","f"],["ambition","f"],
    ["poche","f"],["couteau","m"],["phrase","f"],["oeuvre","f"],["personnage","m"],["roman","m"],["aile","f"],
    ["balle","f"],["trésor","m"],["prière","f"],["rage","f"],["tempête","f"],["coutume","f"],["richesse","f"],
    ["soirée","f"],["tribunal","m"],["propos","m"],["procès","m"],["gloire","f"],["cadre","m"],
    ["cheminée","f"],["odeur","f"],["négociation","f"],["marée","f"],["chant","m"],["héros","m"],
    ["miracle","m"],["dignité","f"],["recette","f"],["pelouse","f"],["statut","m"],["revue","f"],
    ["manteau","m"],["bébé","m"],["grief","m"],["navire","m"],["parc","m"],["voleur","m"]
  ];

  // ============================================
  // FREQUENCY WEIGHTS (Zipf: 1/rank, normalized)
  // ============================================

  var zipfSum = 0;
  for (var i = 0; i < W.length; i++) zipfSum += 1 / (i + 1);
  var FREQ = [];
  for (var i = 0; i < W.length; i++) FREQ[i] = (1 / (i + 1)) / zipfSum;

  // ============================================
  // STORAGE
  // ============================================

  var STORAGE_KEY = "frenchGender_srs";

  function todayStr() {
    return new Date().toISOString().slice(0, 10);
  }

  function daysBetween(a, b) {
    return Math.round((new Date(b) - new Date(a)) / 86400000);
  }

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore */ }
    return {
      cards: {},       // word → {ef, interval, reps, nextReview, lastReview, history}
      introduced: 0,   // how many words have been introduced (index into W)
      known: []        // words permanently marked as "I'll never get this wrong"
    };
  }

  function saveState(st) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(st));
  }

  var state = loadState();

  // ============================================
  // SM-2 ENGINE
  // ============================================

  function initCard() {
    return { ef: 2.5, interval: 0, reps: 0, nextReview: todayStr(), lastReview: null, history: [] };
  }

  function sm2Update(card, correct) {
    var q = correct ? 5 : 1;
    card.history.push(q);
    if (card.history.length > 20) card.history.shift();

    if (correct) {
      if (card.reps === 0) {
        card.interval = 1;
      } else if (card.reps === 1) {
        card.interval = 6;
      } else {
        card.interval = Math.round(card.interval * card.ef);
      }
      card.reps++;
    } else {
      card.reps = 0;
      card.interval = 1;
    }

    card.ef = card.ef + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
    if (card.ef < 1.3) card.ef = 1.3;

    card.lastReview = todayStr();
    card.nextReview = addDays(todayStr(), card.interval);
    return card;
  }

  function addDays(dateStr, days) {
    var d = new Date(dateStr);
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
  }

  // ============================================
  // RETRIEVABILITY & SCORING
  // ============================================

  function retrievability(card) {
    if (!card || !card.lastReview) return 0.5;
    var daysSince = daysBetween(card.lastReview, todayStr());
    if (card.interval <= 0) return 0.5;
    var t = daysSince / card.interval;
    return Math.pow(0.9, t);
  }

  // Global expected % correct across all 500 words, weighted by frequency.
  // Unseen words contribute 0 (not coin-flip 0.5 — only tested knowledge counts).
  // "Known forever" words contribute 1.0.
  function globalScore() {
    var score = 0;
    for (var i = 0; i < W.length; i++) {
      var word = W[i][0];
      var r;
      if (state.known && state.known.indexOf(word) !== -1) {
        r = 1.0;
      } else {
        var card = state.cards[word];
        r = card ? retrievability(card) : 0;
      }
      score += FREQ[i] * r;
    }
    return score;
  }

  // ============================================
  // CONTINUOUS QUEUE
  // ============================================
  //
  // The queue feeds cards continuously until you stop.
  //   1. Learning cards (wrong answers / new cards needing confirmation) — shown again after N other cards
  //   2. Due reviews — sorted by most overdue first
  //   3. New cards — introduced from the frequency list when the queue thins out
  //
  // Self-regulating: struggling → learning cards pile up → fewer new cards flow in.
  // Crushing it → learning cards graduate fast → new cards appear sooner.

  var queue = {
    learning: [],   // [{index, showAfter, step}] — cards to re-show this session
    reviews: [],    // [{index}] — due reviews, pre-sorted
    cardsSeen: 0,
    newThisSession: 0
  };

  // Session stats
  var stats = { correct: 0, total: 0, newCount: 0 };

  function isKnown(word) {
    return state.known && state.known.indexOf(word) !== -1;
  }

  function initQueue() {
    var today = todayStr();
    var reviews = [];

    for (var i = 0; i < state.introduced; i++) {
      var word = W[i][0];
      if (isKnown(word)) continue;
      var card = state.cards[word];
      if (card && card.nextReview <= today) {
        var overdue = daysBetween(card.nextReview, today);
        reviews.push({ index: i, overdue: overdue });
      }
    }
    // Most overdue first
    reviews.sort(function (a, b) { return b.overdue - a.overdue; });

    queue.reviews = reviews;
    queue.learning = [];
    queue.cardsSeen = 0;
    queue.newThisSession = 0;
    stats = { correct: 0, total: 0, newCount: 0 };
  }

  function nextCard() {
    // 1. Any learning cards ready?
    var best = -1, bestShow = Infinity;
    for (var i = 0; i < queue.learning.length; i++) {
      if (queue.learning[i].showAfter <= queue.cardsSeen && queue.learning[i].showAfter < bestShow) {
        best = i;
        bestShow = queue.learning[i].showAfter;
      }
    }
    if (best >= 0) {
      return queue.learning.splice(best, 1)[0];
    }

    // 2. Any due reviews?
    if (queue.reviews.length > 0) {
      return queue.reviews.shift();
    }

    // 3. Introduce a new card (if available, skip known words)
    while (state.introduced < W.length) {
      var idx = state.introduced;
      var word = W[idx][0];
      if (isKnown(word)) {
        state.introduced++;
        continue;
      }
      state.cards[word] = initCard();
      state.introduced++;
      queue.newThisSession++;
      stats.newCount++;
      saveState(state);
      return { index: idx, isNew: true, step: 0 };
    }

    // 4. Learning cards not yet ready — show the soonest one anyway
    if (queue.learning.length > 0) {
      queue.learning.sort(function (a, b) { return a.showAfter - b.showAfter; });
      return queue.learning.shift();
    }

    // Nothing left
    return null;
  }

  function handleAnswer(wordIndex, correct, entry) {
    var word = W[wordIndex][0];
    var card = state.cards[word];
    var isLearning = entry && (entry.isNew || entry.step !== undefined);
    var step = (entry && entry.step) || 0;

    stats.total++;
    if (correct) stats.correct++;
    queue.cardsSeen++;

    if (isLearning && step === 0) {
      // First time seeing this card (new or first learning step)
      // Don't run SM-2 yet — just schedule a confirmation
      if (correct) {
        // Show once more to confirm
        queue.learning.push({ index: wordIndex, showAfter: queue.cardsSeen + 5, step: 1 });
      } else {
        // Wrong — show again soon
        queue.learning.push({ index: wordIndex, showAfter: queue.cardsSeen + 3, step: 0 });
      }
    } else if (isLearning && step === 1) {
      // Confirmation step
      if (correct) {
        // Graduate! Run SM-2 with "correct"
        sm2Update(card, true);
        saveState(state);
      } else {
        // Back to step 0
        queue.learning.push({ index: wordIndex, showAfter: queue.cardsSeen + 3, step: 0 });
      }
    } else {
      // Regular review card
      sm2Update(card, correct);
      saveState(state);
      if (!correct) {
        // Re-show within session for reinforcement
        queue.learning.push({ index: wordIndex, showAfter: queue.cardsSeen + 4, step: 0 });
      }
    }
  }

  // ============================================
  // EXPORT / IMPORT
  // ============================================

  function exportData() {
    var blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "french-srs-" + todayStr() + ".json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function importData(file) {
    var reader = new FileReader();
    reader.onload = function (e) {
      try {
        var imported = JSON.parse(e.target.result);
        if (imported.cards && typeof imported.introduced === "number") {
          state = imported;
          saveState(state);
          showDashboard();
        } else {
          alert("Format invalide.");
        }
      } catch (err) {
        alert("Erreur de lecture: " + err.message);
      }
    };
    reader.readAsText(file);
  }

  // ============================================
  // UI HELPERS
  // ============================================

  function escapeHtml(s) {
    var d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  function startsWithVowelSound(word) {
    return /^[aeéèêëiîïoôuûùüâäæœh]/i.test(word);
  }

  function articleFor(gender, word) {
    var vowel = startsWithVowelSound(word);
    if (gender === "m") return vowel ? "un" : "le";
    return vowel ? "une" : "la";
  }

  // ============================================
  // SCREENS
  // ============================================

  var srsDashboard = document.getElementById("srs-dashboard");
  var srsPractice = document.getElementById("srs-practice");
  var currentEntry = null; // the current card being shown

  // ============================================
  // DASHBOARD
  // ============================================

  function showDashboard() {
    hideAllScreens();
    srsDashboard.classList.add("active");

    var score = globalScore();
    var today = todayStr();
    var dueCount = 0;
    for (var i = 0; i < state.introduced; i++) {
      var card = state.cards[W[i][0]];
      if (card && card.nextReview <= today) dueCount++;
    }
    var remaining = W.length - state.introduced;

    var knownCount = state.known ? state.known.length : 0;

    document.getElementById("srs-score").textContent = (score * 100).toFixed(1) + "%";
    document.getElementById("srs-learned").textContent = state.introduced + " / " + W.length;
    document.getElementById("srs-due").textContent = dueCount + " à réviser";
    document.getElementById("srs-known").textContent = knownCount + " acquis";

    var startBtn = document.getElementById("srs-start-btn");
    var hasWork = dueCount > 0 || (state.introduced - knownCount) < W.length;
    if (!hasWork) {
      startBtn.textContent = "Rien à faire — revenez demain";
      startBtn.disabled = true;
    } else {
      startBtn.textContent = "Commencer";
      startBtn.disabled = false;
    }

    var scoreBar = document.getElementById("srs-score-bar");
    if (scoreBar) scoreBar.style.width = (score * 100) + "%";
  }

  // ============================================
  // SESSION
  // ============================================

  function startSession() {
    initQueue();
    showNextCard();
  }

  function showNextCard() {
    var entry = nextCard();
    if (!entry) {
      showSRSComplete();
      return;
    }
    currentEntry = entry;

    hideAllScreens();
    srsPractice.classList.add("active");

    var wordIndex = entry.index;
    var word = W[wordIndex][0];

    var qState = document.getElementById("srs-question-state");
    var aState = document.getElementById("srs-answer-state");
    qState.classList.remove("hidden");
    aState.classList.add("hidden");

    // Running stats
    updateRunningStats();

    // New badge or learning badge
    var badge = '';
    if (entry.isNew && entry.step === 0) {
      badge = '<span class="srs-new-badge">nouveau</span>';
    } else if (entry.step !== undefined) {
      badge = '<span class="srs-learning-badge">apprentissage</span>';
    }

    var useUnUne = startsWithVowelSound(word);
    var promptText = useUnUne ? "un ou une ?" : "le ou la ?";
    var mascLabel = useUnUne ? "un" : "le";
    var femLabel = useUnUne ? "une" : "la";

    document.getElementById("srs-card-prompt").innerHTML =
      badge +
      '<div class="word">' + escapeHtml(word) + '</div>' +
      '<div class="prompt-text">' + promptText + '</div>';

    document.getElementById("srs-answer-buttons").innerHTML =
      '<button class="answer-btn masc" onclick="srsHandleAnswer(\'' + mascLabel + '\')">' + mascLabel + '</button>' +
      '<button class="answer-btn fem" onclick="srsHandleAnswer(\'' + femLabel + '\')">' + femLabel + '</button>';
  }

  function updateRunningStats() {
    var pct = stats.total > 0 ? Math.round(stats.correct / stats.total * 100) : 0;
    var parts = [];
    parts.push("Carte " + (stats.total + 1));
    if (stats.total > 0) parts.push(stats.correct + "/" + stats.total + " (" + pct + "%)");
    if (stats.newCount > 0) parts.push(stats.newCount + " nouveau" + (stats.newCount !== 1 ? "x" : ""));

    document.getElementById("srs-card-counter").textContent = parts.join(" · ");

    // Show queue depth as a subtle indicator
    var pending = queue.reviews.length + queue.learning.length;
    var depthEl = document.getElementById("srs-queue-depth");
    if (depthEl) {
      depthEl.textContent = pending > 0 ? pending + " en attente" : "file vide — nouveaux mots";
    }
  }

  window.srsHandleAnswer = function (choice) {
    var entry = currentEntry;
    var wordIndex = entry.index;
    var word = W[wordIndex][0];
    var gender = W[wordIndex][1];

    var correctArticle = articleFor(gender, word);
    var isCorrect = (choice === correctArticle);

    // Process the answer through the queue
    handleAnswer(wordIndex, isCorrect, entry);

    // Show answer card
    var qState = document.getElementById("srs-question-state");
    var aState = document.getElementById("srs-answer-state");
    qState.classList.add("hidden");
    aState.classList.remove("hidden");

    var feedbackText = isCorrect ? "Correct !" : "Incorrect";
    var feedbackClass = isCorrect ? "correct-text" : "incorrect-text";
    var genderClass = (gender === "f") ? "gender-fem" : "gender-masc";
    var genderColor = (gender === "f") ? "fem-color" : "masc-color";
    var displayArticle = articleFor(gender, word);
    var card = state.cards[word];

    var rank = wordIndex + 1;
    var cardEl = document.getElementById("srs-card-answer");
    cardEl.className = "card " + genderClass;

    var metaParts = ["#" + rank];
    if (card && card.interval > 0) metaParts.push("intervalle: " + card.interval + "j");
    if (card && card.reps > 0) metaParts.push("série: " + card.reps);

    var html =
      '<div class="feedback ' + feedbackClass + '">' + feedbackText + '</div>' +
      '<div class="answer-gender ' + genderColor + '">' + escapeHtml(displayArticle) + '</div>' +
      '<div class="answer-word">' + escapeHtml(word) + '</div>' +
      '<div class="srs-card-meta">' + metaParts.join(" · ") + '</div>';

    cardEl.innerHTML = html;

    // Update running stats display
    updateRunningStats();
  };

  window.srsNext = function () {
    showNextCard();
  };

  // ============================================
  // END SESSION
  // ============================================

  window.srsEndSession = function () {
    showSRSComplete();
  };

  function showSRSComplete() {
    var score = globalScore();

    hideAllScreens();
    srsDashboard.classList.add("active");

    if (stats.total > 0) {
      var pct = Math.round(stats.correct / stats.total * 100);
      var overlay = document.getElementById("srs-complete-overlay");
      overlay.classList.remove("hidden");
      document.getElementById("srs-complete-session-score").textContent =
        stats.correct + " / " + stats.total + " (" + pct + "%)";
      document.getElementById("srs-complete-global-score").textContent =
        (score * 100).toFixed(1) + "%";
      document.getElementById("srs-complete-learned").textContent =
        state.introduced + " / " + W.length + " mots introduits" +
        (stats.newCount > 0 ? " (+" + stats.newCount + " nouveaux)" : "");
    }

    showDashboard();
  }

  // ============================================
  // KNOWN FOREVER
  // ============================================

  function markKnown(word) {
    if (!state.known) state.known = [];
    if (state.known.indexOf(word) === -1) {
      state.known.push(word);
      saveState(state);
    }
  }

  function unmarkKnown(word) {
    if (!state.known) return;
    var idx = state.known.indexOf(word);
    if (idx !== -1) {
      state.known.splice(idx, 1);
      saveState(state);
    }
  }

  // Called from the answer card during practice
  window.srsMarkKnown = function () {
    if (!currentEntry) return;
    var word = W[currentEntry.index][0];
    markKnown(word);
    // Remove from learning queue if present
    queue.learning = queue.learning.filter(function (e) { return e.index !== currentEntry.index; });
    // Move to next card
    showNextCard();
  };

  // ============================================
  // TRIAGE SCREEN — bulk mark words you already know
  // ============================================

  var triageIndex = 0;

  function showTriage() {
    hideAllScreens();
    document.getElementById("srs-triage").classList.add("active");
    triageIndex = 0;
    showTriageCard();
  }

  function showTriageCard() {
    // Skip already-known words
    while (triageIndex < W.length && isKnown(W[triageIndex][0])) {
      triageIndex++;
    }
    if (triageIndex >= W.length) {
      showDashboard();
      return;
    }

    var word = W[triageIndex][0];
    var gender = W[triageIndex][1];
    var rank = triageIndex + 1;
    var knownCount = state.known ? state.known.length : 0;

    document.getElementById("triage-counter").textContent =
      rank + " / " + W.length + " · " + knownCount + " déjà connus";
    document.getElementById("triage-word").textContent = word;

    // Hide the gender reveal
    var reveal = document.getElementById("triage-reveal");
    reveal.classList.add("hidden");
    document.getElementById("triage-buttons").classList.remove("hidden");
  }

  window.srsTriageKnow = function () {
    var word = W[triageIndex][0];
    var gender = W[triageIndex][1];
    markKnown(word);

    // Briefly show the gender as confirmation
    var reveal = document.getElementById("triage-reveal");
    var genderColor = (gender === "f") ? "fem-color" : "masc-color";
    reveal.innerHTML = '<span class="' + genderColor + '">' + escapeHtml(articleFor(gender, word)) + ' ' + escapeHtml(word) + '</span>';
    reveal.classList.remove("hidden");
    document.getElementById("triage-buttons").classList.add("hidden");

    setTimeout(function () {
      triageIndex++;
      showTriageCard();
    }, 600);
  };

  window.srsTriageTest = function () {
    triageIndex++;
    showTriageCard();
  };

  window.srsStartTriage = function () {
    showTriage();
  };

  window.srsTriageBack = function () {
    showDashboard();
  };

  // ============================================
  // NAVIGATION
  // ============================================

  function hideAllScreens() {
    var screens = document.querySelectorAll(".screen");
    for (var i = 0; i < screens.length; i++) {
      screens[i].classList.remove("active");
    }
    var overlay = document.getElementById("srs-complete-overlay");
    if (overlay) overlay.classList.add("hidden");
  }

  window.startSRS = function () {
    showDashboard();
  };

  window.srsStartSession = function () {
    startSession();
  };

  window.srsBackToMenu = function () {
    hideAllScreens();
    document.getElementById("menu").classList.add("active");
    var el = document.getElementById("srs-progress");
    if (el) {
      var score = globalScore();
      el.textContent = state.introduced + " mots · " + (score * 100).toFixed(1) + "% couverture";
    }
  };

  window.srsBackToDashboard = function () {
    if (stats.total > 0) {
      showSRSComplete();
    } else {
      showDashboard();
    }
  };

  window.srsDismissComplete = function () {
    document.getElementById("srs-complete-overlay").classList.add("hidden");
  };

  window.srsExport = function () {
    exportData();
  };

  window.srsImport = function () {
    document.getElementById("srs-import-file").click();
  };

  window.srsHandleImport = function (input) {
    if (input.files && input.files[0]) {
      importData(input.files[0]);
      input.value = "";
    }
  };

  window.srsResetConfirm = function () {
    if (confirm("Réinitialiser toute la progression SRS ? Cette action est irréversible.")) {
      state = { cards: {}, introduced: 0, known: [] };
      saveState(state);
      showDashboard();
    }
  };

  // ============================================
  // INIT
  // ============================================

  var srsProgressEl = document.getElementById("srs-progress");
  if (srsProgressEl) {
    var score = globalScore();
    srsProgressEl.textContent = state.introduced + " mots · " + (score * 100).toFixed(1) + "% couverture";
  }

})();
