(function () {
  "use strict";

  // ============================================
  // 1000 MOST COMMON FRENCH NOUNS (by frequency)
  // [word, gender] — rank is array index + 1
  // Top 500: A Frequency Dictionary of French (Lonsdale & Le Bras)
  // 501–1000: Neri frequency list (2000 Most Used French Nouns)
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
    ["lumière","f"],["famille","f"],["milieu","m"],["genre","m"],["bras","m"],["argent","m"],["chambre","f"],["livre","m"],
    ["groupe","m"],["compte","m"],["endroit","m"],["route","f"],["classe","f"],["besoin","m"],["affaire","f"],["politique","f"],
    ["service","m"],["projet","m"],["gouvernement","m"],["société","f"],["pouvoir","m"],["pensée","f"],["figure","f"],["problème","m"],
    ["marche","f"],["mois","m"],["mouvement","m"],["silence","m"],["attention","f"],["lieu","m"],["bonheur","m"],["système","m"],
    ["situation","f"],["intérêt","m"],["droit","m"],["peur","f"],["amour","m"],["sol","m"],["nature","f"],["chemin","m"],
    ["coeur","m"],["ciel","m"],["pas","m"],["âme","f"],["matin","m"],["soeur","f"],["vérité","f"],["suite","f"],
    ["face","f"],["bord","m"],["action","f"],["beauté","f"],["mesure","f"],["ministre","m"],["doute","m"],["chanson","f"],
    ["pierre","f"],["sentiment","m"],["prison","f"],["rapport","m"],["président","m"],["moyen","m"],["condition","f"],["sang","m"],
    ["journal","m"],["direction","f"],["erreur","f"],["soleil","m"],["image","f"],["santé","f"],["voiture","f"],["prix","m"],
    ["rêve","m"],["départ","m"],["bruit","m"],["vue","f"],["passage","m"],["mari","m"],["mur","m"],["fenêtre","f"],
    ["minute","f"],["musique","f"],["recherche","f"],["membre","m"],["centre","m"],["type","m"],["parti","m"],["plan","m"],
    ["médecin","m"],["espèce","f"],["caractère","m"],["résultat","m"],["peine","f"],["souvenir","m"],["rôle","m"],["tour","m"],
    ["table","f"],["lit","m"],["entrée","f"],["âge","m"],["sujet","m"],["relation","f"],["mission","f"],["époque","f"],
    ["signe","m"],["geste","m"],["ombre","f"],["larme","f"],["avenir","m"],["paix","f"],["joie","f"],["coin","m"],
    ["jardin","m"],["siècle","m"],["culture","f"],["art","m"],["folie","f"],["impression","f"],["chef","m"],["honneur","m"],
    ["dame","f"],["visage","m"],["courage","m"],["épaule","f"],["arbre","m"],["langue","f"],["réponse","f"],["scène","f"],
    ["marché","m"],["chance","f"],["cheval","m"],["ligne","f"],["pièce","f"],["dos","m"],["école","f"],["danger","m"],
    ["colère","f"],["vallée","f"],["église","f"],["secret","m"],["salle","f"],["bête","f"],["train","m"],["film","m"],
    ["douleur","f"],["chapitre","m"],["oncle","m"],["champ","m"],["nombre","m"],["bureau","m"],["lèvre","f"],["voyage","m"],
    ["terrain","m"],["effort","m"],["défense","f"],["article","m"],["peuple","m"],["espoir","m"],["genou","m"],["volonté","f"],
    ["poitrine","f"],["sécurité","f"],["confiance","f"],["doigt","m"],["développement","m"],["bois","m"],["plaisir","m"],["sourire","m"],
    ["énergie","f"],["mémoire","f"],["niveau","m"],["cou","m"],["formation","f"],["réalité","f"],["région","f"],["retour","m"],
    ["arme","f"],["troupe","f"],["montagne","f"],["feu","m"],["front","m"],["justice","f"],["position","f"],["différence","f"],
    ["salon","m"],["demande","f"],["population","f"],["début","m"],["bouche","f"],["colline","f"],["habitude","f"],["aide","f"],
    ["armée","f"],["chapeau","m"],["herbe","f"],["patron","m"],["valeur","f"],["couleur","f"],["victoire","f"],["conversation","f"],
    ["expérience","f"],["chien","m"],["importance","f"],["production","f"],["poste","m"],["maître","m"],["choix","m"],["général","m"],
    ["nation","f"],["programme","m"],["ensemble","m"],["autorité","f"],["intérieur","m"],["reine","f"],["prince","m"],["nouvelle","f"],
    ["papier","m"],["événement","m"],["rivière","f"],["plaine","f"],["existence","f"],["bateau","m"],["conséquence","f"],["horizon","m"],
    ["industrie","f"],["intelligence","f"],["matière","f"],["nez","m"],["acte","m"],["apparence","f"],["peau","f"],["dent","f"],
    ["campagne","f"],["obligation","f"],["solution","f"],["combat","m"],["communication","f"],["source","f"],["liberté","f"],["commission","f"],
    ["étoile","f"],["objet","m"],["animal","m"],["technique","f"],["puissance","f"],["chaise","f"],["compagnie","f"],["univers","m"],
    ["accident","m"],["souffrance","f"],["profession","f"],["joueur","m"],["oiseau","m"],["ventre","m"],["étage","m"],["neige","f"],
    ["désir","m"],["escalier","m"],["château","m"],["banque","f"],["aventure","f"],["leçon","f"],["crise","f"],["vent","m"],
    ["explication","f"],["structure","f"],["fête","f"],["marque","f"],["méthode","f"],["science","f"],["principe","m"],["éducation","f"],
    ["surface","f"],["limite","f"],["opération","f"],["progrès","m"],["responsabilité","f"],["plante","f"],["rire","m"],["installation","f"],
    ["bâtiment","m"],["phénomène","m"],["croix","f"],["réaction","f"],["protection","f"],["oreille","f"],["cigarette","f"],["palais","m"],
    ["voisin","m"],["surprise","f"],["frontière","f"],["fleuve","m"],["fortune","f"],["maladie","f"],["base","f"],["titre","m"],
    ["semaine","f"],["élection","f"],["issue","f"],["refus","m"],["décision","f"],["fonction","f"],["période","f"],["occupation","f"],
    ["réforme","f"],["hôtel","m"],["carrière","f"],["menace","f"],["démarche","f"],["pluie","f"],["intention","f"],["plafond","m"],
    ["dimension","f"],["cérémonie","f"],["chiffre","m"],["couverture","f"],["critique","f"],["sable","m"],["plancher","m"],["poussière","f"],
    ["toit","m"],["docteur","m"],["mode","f"],["trou","m"],["flamme","f"],["catégorie","f"],["soutien","m"],["distance","f"],
    ["corde","f"],["clé","f"],["territoire","m"],["discipline","f"],["étranger","m"],["organisation","f"],["poème","m"],["expression","f"],
    ["représentation","f"],["tante","f"],["cousin","m"],["soldat","m"],["paysage","m"],["espace","m"],["philosophie","f"],["religion","f"],
    ["sommet","m"],["pratique","f"],["tradition","f"],["séance","f"],["rive","f"],["contrôle","m"],["destin","m"],["spectacle","m"],
    ["circonstance","f"],["foule","f"],["ressource","f"],["mensonge","m"],["cercle","m"],["appartement","m"],["curé","m"],["conscience","f"],
    ["nuage","m"],["crainte","f"],["échange","m"],["réunion","f"],["feuille","f"],["lune","f"],["saison","f"],["enquête","f"],
    ["lac","m"],["poète","m"],["excuse","f"],["truc","m"],["promesse","f"],["chaussure","f"],["somme","f"],["tâche","f"],
    ["commerce","m"],["vertu","f"],["budget","m"],["revenu","m"],["victime","f"],["dialogue","m"],["connaissance","f"],["influence","f"],
    ["analyse","f"],["compétence","f"],["morceau","m"],["mystère","m"],["portée","f"],["ambition","f"],["poche","f"],["couteau","m"],
    ["phrase","f"],["oeuvre","f"],["personnage","m"],["roman","m"],["aile","f"],["balle","f"],["trésor","m"],["prière","f"],
    ["rage","f"],["tempête","f"],["coutume","f"],["richesse","f"],["soirée","f"],["tribunal","m"],["propos","m"],["procès","m"],
    ["gloire","f"],["cadre","m"],["cheminée","f"],["odeur","f"],["négociation","f"],["marée","f"],["chant","m"],["héros","m"],
    ["miracle","m"],["dignité","f"],["recette","f"],["pelouse","f"],["statut","m"],["revue","f"],["manteau","m"],["bébé","m"],
    ["grief","m"],["navire","m"],["parc","m"],["voleur","m"],
    // 501–1000: from Neri frequency list
    ["façon","f"],["appel","m"],["mec","m"],["gauche","f"],["cours","m"],["papa","m"],["maman","f"],["garçon","m"],
    ["emploi","m"],["épouse","f"],["course","f"],["jeu","m"],["fin","f"],["téléphone","m"],["police","f"],["cœur","m"],
    ["inquiétude","f"],["affaires","f"],["montre","f"],["assise","f"],["seconde","f"],["paiement","m"],["choses","f"],["boisson","f"],
    ["changement","m"],["chèque","m"],["sommeil","m"],["mien","m"],["accord","m"],["cher","m"],["fermeture","f"],["amusement","m"],
    ["numéro","m"],["souhait","m"],["repos","m"],["stand","m"],["coupure","f"],["sœur","f"],["pause","f"],["promenade","f"],
    ["problèmes","m"],["moitié","f"],["bienvenue","f"],["couple","m"],["hâte","f"],["chéri","m"],["devant","m"],["fusil","m"],
    ["équipe","f"],["nouvelles","f"],["capitaine","m"],["haine","f"],["nourriture","f"],["noir","m"],["cause","f"],["dîner","m"],
    ["coffre-fort","m"],["tir","m"],["toucher","m"],["entreprise","f"],["passé","m"],["salope","f"],["son","m"],["cheveux","m"],
    ["humain","m"],["conduite","f"],["froid","m"],["danse","f"],["sexe","m"],["autres","m"],["hôpital","m"],["meurtre","m"],
    ["capture","f"],["douceur","f"],["pari","m"],["tranquillité","f"],["ressenti","m"],["rythme","m"],["café","m"],["rendez-vous","m"],
    ["traction","f"],["faute","f"],["chute","f"],["calme","m"],["goutte","f"],["lancer","m"],["merveille","f"],["œil","m"],
    ["baiser","m"],["travaux","m"],["passe","f"],["réveil","m"],["officier","m"],["vêtements","m"],["trajet","m"],["anniversaire","m"],
    ["obscurité","f"],["cour","f"],["usure","f"],["preuve","f"],["information","f"],["sac","m"],["attaque","f"],["bleu","m"],
    ["gare","f"],["message","m"],["imbécile","m"],["copain","m"],["poignée","f"],["mariage","m"],["rocher","m"],["test","m"],
    ["plomb","m"],["club","m"],["présent","m"],["idiot","m"],["boîte","f"],["bâtard","m"],["crime","m"],["déjeuner","m"],
    ["américain","m"],["charge","f"],["poisson","m"],["bar","m"],["major","m"],["cachette","f"],["bâton","m"],["mer","f"],
    ["thé","m"],["robe","f"],["radio","f"],["disque","m"],["offre","f"],["liste","f"],["or","m"],["après-midi","f"],
    ["agent","m"],["détective","m"],["réparation","f"],["respect","m"],["public","m"],["ivresse","f"],["cerveau","m"],["cellule","f"],
    ["désordre","m"],["mouche","f"],["tueur","m"],["carte","f"],["anglais","m"],["glace","f"],["part","f"],["lieutenant","m"],
    ["cri","m"],["visite","f"],["siège","m"],["enseignant","m"],["collège","m"],["juge","m"],["privé","m"],["arrêt","m"],
    ["français","m"],["machine","f"],["vert","m"],["policier","m"],["vin","m"],["village","m"],["félicitations","f"],["blague","f"],
    ["mal","m"],["avocat","m"],["contact","m"],["magasin","m"],["boutique","f"],["professeur","m"],["madame","f"],["avion","m"],
    ["île","f"],["chat","m"],["bière","f"],["poussée","f"],["sud","m"],["cadeau","m"],["verre","m"],["ours","m"],
    ["nord","m"],["bus","m"],["partenaire","m"],["saisie","f"],["ordinateur","m"],["camion","m"],["atteinte","f"],["planche","f"],
    ["graisse","f"],["planète","f"],["arrestation","f"],["saut","m"],["magie","f"],["merde","f"],["cuisine","f"],["été","m"],
    ["patient","m"],["paradis","m"],["évasion","f"],["adresse","f"],["compagnon","m"],["match","m"],["final","m"],["fumée","f"],
    ["blâme","m"],["pression","f"],["faveur","f"],["devoir","m"],["garde","f"],["risque","m"],["avis","m"],["ennemi","m"],
    ["costume","m"],["ajustement","m"],["directeur","m"],["tache","f"],["poulet","m"],["département","m"],["gaz","m"],["sergent","m"],
    ["bas","m"],["jambe","f"],["goût","m"],["gaspillage","m"],["ouest","m"],["tas","m"],["bataille","f"],["étude","f"],
    ["mention","f"],["cloche","f"],["verrou","m"],["friandise","f"],["brûlure","f"],["petit-déjeuner","m"],["piste","f"],["favori","m"],
    ["rouleau","m"],["témoin","m"],["double","m"],["construction","f"],["bombe","f"],["vol","m"],["gorge","f"],["coût","m"],
    ["suspect","m"],["bouteille","f"],["vidéo","f"],["camp","m"],["honte","f"],["conducteur","m"],["foi","f"],["commandant","m"],
    ["client","m"],["moteur","m"],["pop","f"],["diable","m"],["week-end","m"],["chérie","f"],["drogue","f"],["aveugle","m"],
    ["allemand","m"],["plage","f"],["local","m"],["code","m"],["hall","m"],["occasion","f"],["connerie","f"],["tasse","f"],
    ["fantôme","m"],["restaurant","m"],["est","m"],["camarade","m"],["note","f"],["ange","m"],["règle","f"],["conseil","m"],
    ["pardon","m"],["lait","m"],["vitesse","f"],["dossier","m"],["bande","f"],["urgence","f"],["pont","m"],["entraîneur","m"],
    ["inspecteur","m"],["applaudissements","m"],["souffle","m"],["équipage","m"],["viande","f"],["gâteau","m"],["vote","m"],["copie","f"],
    ["absurdité","f"],["étudiant","m"],["manager","m"],["taille","f"],["astuce","f"],["paquet","m"],["monstre","m"],["cible","f"],
    ["alimentation","f"],["crédit","m"],["suicide","m"],["infirmière","f"],["huile","f"],["criminel","m"],["chemise","f"],["grève","f"],
    ["commande","f"],["défi","m"],["billet","m"],["brun","m"],["lavage","m"],["libération","f"],["naissance","f"],["invité","m"],
    ["ascenseur","m"],["opinion","f"],["chaleur","f"],["cravate","f"],["shérif","m"],["épée","f"],["laboratoire","m"],["crème","f"],
    ["total","m"],["gang","m"],["femelle","f"],["tirage","m"],["mâle","m"],["morsure","f"],["douche","f"],["but","m"],
    ["vis","f"],["médicament","m"],["discussion","f"],["scission","f"],["poids","m"],["unité","f"],["cochon","m"],["piscine","f"],
    ["focalisation","f"],["propriété","f"],["maire","m"],["entretien","m"],["ventilateur","m"],["signal","m"],["chirurgie","f"],["préjudice","m"],
    ["personnel","m"],["processus","m"],["accès","m"],["modèle","m"],["russe","m"],["style","m"],["alarme","f"],["japonais","m"],
    ["sucre","m"],["funérailles","f"],["dommage","m"],["estomac","m"],["pain","m"],["discours","m"],["bloc","m"],["secousse","f"],
    ["fouille","f"],["football","m"],["diffusion","f"],["succès","m"],["permission","f"],["fantaisie","f"],["théorie","f"],["portail","m"],
    ["peinture","f"],["amoureux","m"],["humeur","f"],["page","f"],["fromage","m"],["prêtre","m"],["regret","m"],["contrat","m"],
    ["divorce","m"],["communauté","f"],["loyer","m"],["vengeance","f"],["forêt","f"],["ruée","f"],["propriétaire","m"],["montant","m"],
    ["artiste","m"],["cancer","m"],["paire","f"],["ruine","f"],["grand-père","m"],["vélo","m"],["perte","f"],["menteur","m"],
    ["hiver","m"],["assistant","m"],["meurtrier","m"],["ferme","f"],["toilette","f"],["génie","m"],["carré","m"],["secrétaire","m"],
    ["connexion","f"],["professionnel","m"],["pitié","f"],["horloge","f"],["océan","m"],["ADN","m"],["crash","m"],["bain","m"],
    ["assurance","f"],["aéroport","m"],["temple","m"],["compétition","f"],["bonté","f"],["enfer","m"],["subvention","f"],["tombe","f"],
    ["géant","m"],["site","m"],["déclaration","f"],["hausse","f"],["veste","f"],["miséricorde","f"],["prostituée","f"],["interrupteur","m"],
    ["repas","m"],["données","f"],["corne","f"],["officiel","m"],["rat","m"],["pizza","f"],["choc","m"],["soupe","f"],
    ["jaune","m"],["emplacement","m"],["chocolat","m"],["habituel","m"],["taxi","m"],["pisse","f"],["blessure","f"],["assiette","f"],
    ["télévision","f"],["circulation","f"],["aube","f"],["poison","m"],["indien","m"],["bang","m"],["italien","m"],["fesses","f"],
    ["piège","m"],["minuit","m"],["jury","m"],["nage","f"],["courrier","m"],["vacances","f"],["usine","f"],["fissure","f"],
    ["talent","m"],["quartier","m"],["grand-mère","f"],["gagnant","m"],["licence","f"],["avantage","m"],["singe","m"],["miroir","m"],
    ["syndicat","m"],["chrétien","m"],["violence","f"],["crochet","m"],["enfoiré","m"],["préoccupation","f"],["studio","m"],["sortilège","m"],
    ["fer","m"],["sauvetage","m"],["traitement","m"],["désert","m"],["piano","m"],["amitié","f"],["bonbon","m"],["mariée","f"],
    ["fleur","f"],["os","m"],["junior","m"],["restes","m"],["métal","m"],["pourboire","m"],["taux","m"],["performance","f"],
    ["gouverneur","m"],["véhicule","m"],["toast","m"],["fierté","f"]
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
    return { ef: 2.5, interval: 0, reps: 0, nextReview: todayStr(), lastReview: null, history: [], errors: 0, consecCorrect: 0 };
  }

  // Backfill old cards that lack newer fields
  function ensureCardFields(card) {
    if (!card.errors) card.errors = 0;
    if (card.consecCorrect === undefined) card.consecCorrect = 0;
    if (!card.history) card.history = [];
    // Migrate old-format history (plain numbers) to timestamped
    if (card.history.length > 0 && typeof card.history[0] === "number") {
      card.history = []; // can't reconstruct timestamps, just reset
    }
  }

  // sm2Update only handles between-session scheduling (interval, EF, reps).
  // History and error counting are handled by handleAnswer to avoid double-counting.
  function sm2Update(card, correct) {
    ensureCardFields(card);

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
      // Softer lapse penalty: 25% of old interval (min 1) instead of hard reset to 1
      var oldInterval = card.interval;
      card.interval = Math.max(1, Math.round(oldInterval * 0.25));
      card.reps = 0;
    }

    // Standard SM-2 EF adjustment (capped at 2.5)
    var q = correct ? 5 : 1;
    card.ef = card.ef + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
    if (card.ef < 1.3) card.ef = 1.3;
    if (card.ef > 2.5) card.ef = 2.5;

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
      return { index: idx, isNew: true, step: 0, sessionFails: 0, consecCorrect: 0 };
    }

    // 4. Learning cards not yet ready — show the soonest one anyway
    if (queue.learning.length > 0) {
      queue.learning.sort(function (a, b) { return a.showAfter - b.showAfter; });
      return queue.learning.shift();
    }

    // Nothing left
    return null;
  }

  // How many consecutive corrects needed to graduate from learning.
  // Base is 3 because a single correct on a 50/50 is meaningless (25% chance of fluking 2).
  // Trouble words need even more proof.
  function correctsToGraduate(card) {
    ensureCardFields(card);
    if (card.errors <= 1) return 3;  // standard — 3 in a row (12.5% fluke chance)
    if (card.errors <= 4) return 4;  // trouble word — 4 in a row
    return 5;                         // leech — 5 in a row
  }

  // Within-session spacing: tightens with repeated fails in this session.
  // 1st fail → 4 cards apart, 2nd → 3, 3rd+ → 2 (the "hmm → HMMMM" escalation)
  function learningGap(sessionFails) {
    if (sessionFails <= 1) return 4;
    if (sessionFails === 2) return 3;
    return 2;
  }

  function handleAnswer(wordIndex, correct, entry) {
    var word = W[wordIndex][0];
    var card = state.cards[word];
    ensureCardFields(card);
    var isLearning = entry && (entry.isNew || entry.step !== undefined);

    // All cards go through the learning gate (3+ consecutive corrects).
    // The cost of 2 extra questions is low; the cost of a false graduation is 6+ days.
    var wasReview = !isLearning;
    if (!isLearning) {
      isLearning = true;
      if (!entry) entry = {};
      entry.step = 0;
      entry.sessionFails = 0;
      entry.consecCorrect = 0;
    }

    // Carry forward session-level fail count
    var sessionFails = (entry && entry.sessionFails) || 0;
    // consecCorrect lives on the card — but reset if 1+ days have passed
    // (a gap means real forgetting-curve decay; the old streak is stale)
    var consecCorrect = card.consecCorrect || 0;
    if (consecCorrect > 0 && card.history.length > 0) {
      var lastEntry = card.history[card.history.length - 1];
      if (typeof lastEntry === "object" && lastEntry[0]) {
        var msSince = Date.now() - lastEntry[0];
        if (msSince > 86400000) { // more than 24 hours
          consecCorrect = 0;
          card.consecCorrect = 0;
        }
      }
    }


    stats.total++;
    if (correct) stats.correct++;
    queue.cardsSeen++;

    // Record every answer in history (single source of truth)
    card.history.push([Date.now(), correct]);
    if (!correct) card.errors++;

    if (isLearning) {
      var needed = correctsToGraduate(card);

      if (correct) {
        consecCorrect++;
        card.consecCorrect = consecCorrect;
        if (consecCorrect >= needed) {
          // Graduate! Set up between-session scheduling
          card.consecCorrect = 0; // reset for next review cycle
          sm2Update(card, true);
          saveState(state);
          return { graduated: true };
        } else {
          // Not enough consecutive corrects yet — keep in learning
          var gap = Math.max(4, 6 - sessionFails); // wider gap when doing well
          queue.learning.push({
            index: wordIndex,
            showAfter: queue.cardsSeen + gap,
            step: 1,
            sessionFails: sessionFails
          });
          saveState(state);
          return { remaining: needed - consecCorrect };
        }
      } else {
        // Wrong — reset consecutive streak
        consecCorrect = 0;
        card.consecCorrect = 0;
        sessionFails++;
        // If this was the first answer on a returning review card, register the lapse
        // in SM-2 so the interval and EF get penalized immediately.
        if (wasReview) {
          sm2Update(card, false);
        }
        var gap = learningGap(sessionFails);
        queue.learning.push({
          index: wordIndex,
          showAfter: queue.cardsSeen + gap,
          step: 0,
          sessionFails: sessionFails
        });
        saveState(state);
        return { remaining: needed };
      }
    }
    return { graduated: true };
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
    if (location.hash !== "#srs") location.hash = "srs";

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
    if (location.hash !== "#srs-practice") location.hash = "srs-practice";

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

    document.getElementById("srs-card-prompt").innerHTML =
      badge +
      '<div class="word">' + escapeHtml(word) + '</div>' +
      '<div class="prompt-text">le ou la ?</div>';

    document.getElementById("srs-answer-buttons").innerHTML =
      '<button class="answer-btn masc" onclick="srsHandleAnswer(\'m\')">le</button>' +
      '<button class="answer-btn fem" onclick="srsHandleAnswer(\'f\')">la</button>';
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

    var isCorrect = (choice === gender);

    // Process the answer through the queue
    var result = handleAnswer(wordIndex, isCorrect, entry);

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

    if (card) ensureCardFields(card);

    // Mastery status
    var mastery = "";
    if (result && result.graduated) {
      if (card && card.lastReview && card.interval > 0) {
        mastery = "maîtrise: " + Math.round(retrievability(card) * 100) + "%";
      } else {
        mastery = "validé ✓";
      }
    } else if (result && result.remaining) {
      mastery = "encore " + result.remaining + "× pour valider";
    }

    // Last 5 attempts as visual streak
    var streak = "";
    if (card && card.history.length > 0) {
      var recent = card.history.slice(-5);
      var marks = [];
      for (var h = 0; h < recent.length; h++) {
        var e = recent[h];
        var wasCorrect = (typeof e === "object" && e[1]) || e === 5;
        marks.push(wasCorrect
          ? '<span class="streak-hit">✓</span>'
          : '<span class="streak-miss">✗</span>');
      }
      streak = marks.join(" ");
    }

    // When you'll see it next — only for graduated cards
    var nextDate = "";
    if (card && card.lastReview && card.interval > 0 && card.nextReview) {
      var nr = card.nextReview;
      var today = todayStr();
      if (nr <= today) {
        nextDate = "prochain: aujourd'hui";
      } else {
        var daysUntil = daysBetween(today, nr);
        if (daysUntil === 1) nextDate = "prochain: demain";
        else nextDate = "prochain: " + daysUntil + "j (" + nr.slice(5) + ")";
      }
    }

    var metaParts = ["#" + rank];
    if (mastery) metaParts.push(mastery);
    if (nextDate) metaParts.push(nextDate);
    if (card && card.errors >= 6) metaParts.push("⚠ difficile");

    // Frequency weight (Zipf)
    var freqPct = (FREQ[wordIndex] * 100).toFixed(2) + "% du français";

    // Bottom-right detail line: streak + status
    var detailParts = [];
    if (streak) detailParts.push(streak);

    var html =
      '<div class="feedback ' + feedbackClass + '">' + feedbackText + '</div>' +
      '<div class="answer-gender ' + genderColor + '">' + escapeHtml(displayArticle) + '</div>' +
      '<div class="answer-word">' + escapeHtml(word) + '</div>' +
      '<div class="srs-card-meta">' + metaParts.join(" · ") + '</div>' +
      '<div class="srs-card-freq">' + freqPct + '</div>' +
      (detailParts.length ? '<div class="srs-card-detail">' + detailParts.join(" · ") + '</div>' : '');

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
    showNextCard();
  };

  // "I'm shaky on this" — treat like a miss + enter aggressive learning mode.
  // Resets interval, bumps error count, and requires multiple consecutive corrects.
  window.srsMarkShaky = function () {
    if (!currentEntry) return;
    var word = W[currentEntry.index][0];
    var card = state.cards[word];
    if (card) {
      ensureCardFields(card);
      card.reps = 0;
      card.interval = 1;
      card.nextReview = todayStr();
      card.errors += 2; // treat as 2 errors so it needs more consecutive corrects
      card.history.push([Date.now(), false]); // record as a miss
      saveState(state);
    }
    // Enter learning queue with elevated sessionFails for tight spacing
    queue.learning.push({
      index: currentEntry.index,
      showAfter: queue.cardsSeen + 2,
      step: 0,
      sessionFails: 2,
      consecCorrect: 0
    });
    showNextCard();
  };

  // ============================================
  // WORD LIST — scrollable list, swipe to mark known
  // ============================================

  function wordProb(i) {
    var word = W[i][0];
    if (isKnown(word)) return 1.0;
    var card = state.cards[word];
    return card ? retrievability(card) : 0;
  }

  function buildWordList() {
    var container = document.getElementById("triage-list");
    container.innerHTML = "";

    var knownCount = state.known ? state.known.length : 0;
    document.getElementById("triage-counter").textContent =
      knownCount + " acquis / " + W.length + " mots";

    for (var i = 0; i < W.length; i++) {
      (function (idx) {
        var word = W[idx][0];
        var gender = W[idx][1];
        var known = isKnown(word);
        var prob = wordProb(idx);

        var row = document.createElement("div");
        row.className = "triage-row" + (known ? " triage-known" : "");
        row.setAttribute("data-idx", idx);

        var genderColor = (gender === "f") ? "fem-color" : "masc-color";
        var probPct = Math.round(prob * 100);
        var probClass = probPct >= 80 ? "prob-high" : (probPct >= 40 ? "prob-mid" : "prob-low");

        row.innerHTML =
          '<span class="triage-rank">' + (idx + 1) + '</span>' +
          '<span class="triage-word-text">' + escapeHtml(word) + '</span>' +
          '<span class="triage-prob ' + probClass + '">' + probPct + '%</span>' +
          '<span class="triage-gender ' + genderColor + '">' + escapeHtml(articleFor(gender, word)) + '</span>' +
          (known ? '<span class="triage-check">&#10003;</span>' : '');

        // Tap to toggle known
        row.addEventListener("click", function () {
          if (isKnown(word)) {
            unmarkKnown(word);
          } else {
            markKnown(word);
          }
          buildWordList();
        });

        // Swipe right to mark known
        var startX = 0, startY = 0, swiping = false;
        row.addEventListener("touchstart", function (e) {
          startX = e.touches[0].clientX;
          startY = e.touches[0].clientY;
          swiping = false;
        }, { passive: true });
        row.addEventListener("touchmove", function (e) {
          var dx = e.touches[0].clientX - startX;
          var dy = e.touches[0].clientY - startY;
          if (Math.abs(dx) > Math.abs(dy) && dx > 20) {
            swiping = true;
            row.style.transform = "translateX(" + Math.min(dx, 100) + "px)";
            row.style.opacity = 1 - Math.min(dx, 100) / 200;
          }
        }, { passive: true });
        row.addEventListener("touchend", function (e) {
          if (swiping) {
            var dx = e.changedTouches[0].clientX - startX;
            if (dx > 80) {
              markKnown(word);
              row.style.transform = "translateX(100%)";
              row.style.opacity = "0";
              setTimeout(function () { buildWordList(); }, 200);
              return;
            }
          }
          row.style.transform = "";
          row.style.opacity = "";
        });

        container.appendChild(row);
      })(i);
    }
  }

  window.srsStartTriage = function () {
    hideAllScreens();
    document.getElementById("srs-triage").classList.add("active");
    if (location.hash !== "#srs-triage") location.hash = "srs-triage";
    buildWordList();
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
    location.hash = "";
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
