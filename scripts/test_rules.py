#!/usr/bin/env python3
"""Test the gender_rules handout against the 2000 most common French nouns."""

import re
from pathlib import Path

# Parse the 2000 nouns file
nouns = []
with open(Path(__file__).parent.parent / "data" / "2000nouns.txt") as f:
    for line in f:
        # Match lines like: 1. time - temps - masculine
        m = re.match(r'\d+\.\s+\S+.*?-\s+(\S+).*?-\s+(masculine|feminine)', line)
        if m:
            word = m.group(1).lower()
            gender = 'm' if 'masculine' in m.group(2) else 'f'
            nouns.append((word, gender))

print(f"Parsed {len(nouns)} nouns\n")

# ============================================
# RULE 1: -tion, -sion, -aison → always feminine
# ============================================
def rule1(word):
    if word.endswith(('tion', 'sion', 'aison')):
        return 'f'
    return None

# ============================================
# RULE 2: Other consonant-final → masculine
# Consonants: b c d f g h j k l m n p q r s t v w x z
# But NOT if caught by rule 1
# ============================================
CONSONANTS = set('bcdfghjklmnpqrstvwxz')

# Known feminine exceptions to consonant rule
CONSONANT_FEM_EXCEPTIONS = {
    'main', 'nuit', 'fois', 'fin', 'part', 'mort', 'dent',
    'faim', 'soif', 'croix', 'voix', 'noix', 'paix', 'souris',
    'clef', 'clé', 'forêt', 'mer', 'leçon', 'façon', 'chanson',
    'fleur', 'peur', 'douleur', 'chaleur', 'couleur', 'valeur',
    'erreur', 'horreur', 'chair', 'tour', 'cour', 'brebis',
    'sueur', 'vapeur', 'odeur', 'humeur', 'faveur', 'rumeur',
    'terreur', 'fureur', 'splendeur', 'pudeur', 'saveur',
    'hauteur', 'longueur', 'largeur', 'profondeur', 'épaisseur',
    'laideur', 'grandeur', 'raideur', 'maigreur', 'minceur',
    'blancheur', 'noirceur', 'rougeur', 'pâleur', 'lenteur',
    'lourdeur', 'froideur', 'tiédeur', 'moiteur',
}

def rule2(word):
    """Other consonant-final words (not caught by rule 1)."""
    if not word:
        return None
    last = word[-1]
    if last not in CONSONANTS:
        return None
    # Rule 1 already caught -tion/-sion/-aison
    if word.endswith(('tion', 'sion', 'aison')):
        return None
    return 'm'

# ============================================
# SPECIFIC ENDINGS (for non-consonant-final words)
# ============================================
MASC_ENDINGS = [
    # (ending, exceptions_set)
    ('age', {'plage', 'page', 'image', 'cage', 'rage', 'nage', 'plage'}),
    ('isme', set()),
    ('eau', {'peau', 'eau'}),
    ('ège', set()),
    ('phone', set()),
    ('scope', set()),
    ('acle', set()),
    ('ange', {'vidange', 'louange', 'grange'}),
    # Greek/Latin: -ème, -ysme, -asme, etc.
    ('ème', set()),
    ('amme', set()),  # le programme
]

FEM_ENDINGS = [
    ('té', {'côté', 'comité', 'traité', 'pâté', 'été'}),
    ('ée', {'musée', 'lycée', 'trophée', 'mausolée', 'scarabée', 'apogée'}),
    ('ure', {'murmure'}),
    ('ance', {'silence'}),  # -ance
    ('ence', {'silence'}),  # -ence
    ('ie', {'génie', 'incendie', 'parapluie'}),
    ('oire', {'territoire', 'laboratoire', 'conservatoire', 'observatoire', 'répertoire', 'réfectoire', 'accessoire', 'interrogatoire'}),
    ('ose', set()),
    ('ace', {'espace'}),
    ('ue', set()),
    ('ole', {'rôle', 'contrôle'}),
    ('onne', set()),
    ('eure', set()),
    ('ise', set()),
    ('ine', {'magazine'}),
    ('ude', set()),
    ('esse', set()),
    ('ade', {'stade'}),
    ('ère', {'cimetière', 'caractère', 'ministère', 'mystère', 'critère'}),
    ('ette', {'squelette'}),
    ('ille', {'gorille'}),
    ('elle', set()),
    # double consonant + e (approximate)
    ('erre', {'erre'}),
    ('asse', set()),
    ('esse', set()),
    ('atte', set()),
    ('otte', set()),
    ('enne', set()),
    ('amme', {'programme', 'gramme', 'diagramme'}),
    ('omme', {'homme'}),
]

# Also: -o tends masculine
def check_specific_masc(word):
    """Check if word matches a masculine-predicting specific ending."""
    # -o (but not -oo)
    if word.endswith('o') and not word.endswith(('moto', 'radio', 'photo', 'vidéo')):
        return True
    for ending, exceptions in MASC_ENDINGS:
        if word.endswith(ending) and word not in exceptions:
            return True
    return False

def check_specific_fem(word):
    """Check if word matches a feminine-predicting specific ending."""
    for ending, exceptions in FEM_ENDINGS:
        if word.endswith(ending) and word not in exceptions:
            return True
    return False

# ============================================
# SEMANTIC RULES
# ============================================
# These are hard to check programmatically, skip for now

# ============================================
# APPLY ALL RULES
# ============================================
correct = 0
wrong = 0
no_rule = 0
correct_list = []
wrong_list = []
no_rule_list = []

for word, actual_gender in nouns:
    predicted = None
    rule_name = None

    # Rule 1: -tion/-sion/-aison
    r1 = rule1(word)
    if r1:
        predicted = r1
        rule_name = "Rule 1 (-tion/-sion/-aison)"

    # Rule 2: consonant-final
    if predicted is None:
        r2 = rule2(word)
        if r2:
            # Check if it's a known exception
            if word in CONSONANT_FEM_EXCEPTIONS:
                predicted = 'f'
                rule_name = "Rule 2 exception"
            else:
                predicted = 'm'
                rule_name = "Rule 2 (consonant)"

    # Specific endings
    if predicted is None:
        if check_specific_masc(word):
            predicted = 'm'
            rule_name = "Masc ending"
        elif check_specific_fem(word):
            predicted = 'f'
            rule_name = "Fem ending"

    if predicted is None:
        no_rule += 1
        no_rule_list.append((word, actual_gender))
    elif predicted == actual_gender:
        correct += 1
        correct_list.append((word, actual_gender, rule_name))
    else:
        wrong += 1
        wrong_list.append((word, actual_gender, predicted, rule_name))

total_with_rule = correct + wrong
total = correct + wrong + no_rule

print("=" * 60)
print(f"RESULTS: {total} nouns tested")
print("=" * 60)
print(f"Covered by a rule:    {total_with_rule}/{total} ({100*total_with_rule/total:.1f}%)")
print(f"  Correct:            {correct}/{total} ({100*correct/total:.1f}%)")
print(f"  Wrong:              {wrong}/{total} ({100*wrong/total:.1f}%)")
print(f"No rule applies:      {no_rule}/{total} ({100*no_rule/total:.1f}%)")
print()

if wrong_list:
    print("=" * 60)
    print(f"WRONG PREDICTIONS ({wrong}):")
    print("=" * 60)
    for word, actual, predicted, rule in sorted(wrong_list):
        actual_label = "fem" if actual == 'f' else "masc"
        pred_label = "fem" if predicted == 'f' else "masc"
        print(f"  {word:20s} actual={actual_label:4s}  predicted={pred_label:4s}  rule={rule}")

print()
if no_rule_list:
    print("=" * 60)
    print(f"NO RULE APPLIES ({no_rule}):")
    print("=" * 60)
    for word, actual in sorted(no_rule_list):
        label = "fem" if actual == 'f' else "masc"
        print(f"  {word:20s} ({label})")

# Summary by rule
print()
print("=" * 60)
print("BREAKDOWN BY RULE:")
print("=" * 60)
from collections import Counter
rule_counts = Counter()
rule_correct = Counter()
for word, actual, rule in correct_list:
    rule_counts[rule] += 1
    rule_correct[rule] += 1
for word, actual, predicted, rule in wrong_list:
    rule_counts[rule] += 1

for rule in sorted(rule_counts, key=rule_counts.get, reverse=True):
    total_r = rule_counts[rule]
    correct_r = rule_correct[rule]
    wrong_r = total_r - correct_r
    print(f"  {rule:35s}  {correct_r}/{total_r} correct ({100*correct_r/total_r:.0f}%) | {wrong_r} wrong")
