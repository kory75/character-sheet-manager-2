/**
 * D&D 5e (2024) — Character Creation Rules
 *
 * All derivation functions referenced by dnd-5e-2024.schema.json live here.
 * Every exported function name must exactly match a "derivation" value in the schema.
 *
 * Rules sourced from:
 *   - Player's Handbook 2024 (D&D 5e 2024 revision)
 *   - Ability scores: PHB 2024 p. 12–13
 *   - Proficiency bonus: PHB 2024 p. 14
 *   - Hit points: PHB 2024 p. 15
 *   - Skills: PHB 2024 p. 16–17
 *   - Spellcasting: PHB 2024 p. 232–233
 */

// ---------------------------------------------------------------------------
// Constants and lookup tables
// ---------------------------------------------------------------------------

/**
 * Proficiency bonus by character level.
 * Source: PHB 2024, Proficiency Bonus table (p. 14).
 * Levels 1–4 → +2, 5–8 → +3, 9–12 → +4, 13–16 → +5, 17–20 → +6
 */
const PROFICIENCY_BONUS_BY_LEVEL: readonly number[] = [
  0,  // index 0 — unused
  2,  // level 1
  2,  // level 2
  2,  // level 3
  2,  // level 4
  3,  // level 5
  3,  // level 6
  3,  // level 7
  3,  // level 8
  4,  // level 9
  4,  // level 10
  4,  // level 11
  4,  // level 12
  5,  // level 13
  5,  // level 14
  5,  // level 15
  5,  // level 16
  6,  // level 17
  6,  // level 18
  6,  // level 19
  6,  // level 20
] as const;

/**
 * Hit die (max face value) by class.
 * Source: PHB 2024, class descriptions.
 *
 * Barbarian        → d12 (12)
 * Fighter, Paladin, Ranger → d10 (10)
 * Artificer, Bard, Cleric, Druid, Monk, Rogue, Warlock → d8 (8)
 * Sorcerer, Wizard → d6 (6)
 */
export const HIT_DIE_BY_CLASS: Readonly<Record<string, number>> = {
  'barbarian':  12,
  'fighter':    10,
  'paladin':    10,
  'ranger':     10,
  'artificer':   8,
  'bard':        8,
  'cleric':      8,
  'druid':       8,
  'monk':        8,
  'rogue':       8,
  'warlock':     8,
  'sorcerer':    6,
  'wizard':      6,
} as const;

/**
 * Standard Array values for ability scores.
 * Source: PHB 2024, Standard Array (p. 13).
 */
export const STANDARD_ARRAY: readonly number[] = [15, 14, 13, 12, 10, 8] as const;

/**
 * Point Buy cost table. Cost to raise a score from 8 to the target value.
 * Source: PHB 2024, Point Buy (p. 13).
 * Total pool: 27 points.
 *
 * Score 8 → 0 pts, 9 → 1, 10 → 2, 11 → 3, 12 → 4, 13 → 5, 14 → 7, 15 → 9
 */
export const POINT_BUY_COSTS: Readonly<Record<number, number>> = {
  8:  0,
  9:  1,
  10: 2,
  11: 3,
  12: 4,
  13: 5,
  14: 7,
  15: 9,
} as const;

/** Total point buy budget (PHB 2024). */
export const POINT_BUY_POOL = 27 as const;

/**
 * Skill-to-ability mapping for all 18 skills.
 * Source: PHB 2024, Skills list (p. 16–17).
 */
export const SKILL_ABILITY_MAP: Readonly<Record<string, string>> = {
  acrobatics:     'dexterity',
  animalHandling: 'wisdom',
  arcana:         'intelligence',
  athletics:      'strength',
  deception:      'charisma',
  history:        'intelligence',
  insight:        'wisdom',
  intimidation:   'charisma',
  investigation:  'intelligence',
  medicine:       'wisdom',
  nature:         'intelligence',
  perception:     'wisdom',
  performance:    'charisma',
  persuasion:     'charisma',
  religion:       'intelligence',
  sleightOfHand:  'dexterity',
  stealth:        'dexterity',
  survival:       'wisdom',
} as const;

// ---------------------------------------------------------------------------
// Character interface — all fields from dnd-5e-2024.schema.json
// ---------------------------------------------------------------------------

export interface DndCharacter {
  // Step 1: Identity
  characterName: string;
  playerName: string;
  characterLevel: number;
  experiencePoints: string;
  background: string;

  // Step 2: Species
  species: string;

  // Step 3: Class
  characterClass: string;
  subclass: string;
  hitDie: string;

  // Step 4: Ability Scores
  abilityScoreMethod: string;
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;

  // Ability modifiers (calculated)
  strengthMod: number;
  dexterityMod: number;
  constitutionMod: number;
  intelligenceMod: number;
  wisdomMod: number;
  charismaMod: number;

  // Proficiency bonus (calculated)
  proficiencyBonus: number;

  // Step 5: Skills & Proficiencies
  // Skill proficiency checkboxes
  acrobaticsProf: boolean;
  animalHandlingProf: boolean;
  arcanaProf: boolean;
  athleticsProf: boolean;
  deceptionProf: boolean;
  historyProf: boolean;
  insightProf: boolean;
  intimidationProf: boolean;
  investigationProf: boolean;
  medicineProf: boolean;
  natureProf: boolean;
  perceptionProf: boolean;
  performanceProf: boolean;
  persuasionProf: boolean;
  religionProf: boolean;
  sleightOfHandProf: boolean;
  stealthProf: boolean;
  survivalProf: boolean;

  // Skill totals (calculated)
  acrobaticsTotal: number;
  animalHandlingTotal: number;
  arcanaTotal: number;
  athleticsTotal: number;
  deceptionTotal: number;
  historyTotal: number;
  insightTotal: number;
  intimidationTotal: number;
  investigationTotal: number;
  medicineTotal: number;
  natureTotal: number;
  perceptionTotal: number;
  performanceTotal: number;
  persuasionTotal: number;
  religionTotal: number;
  sleightOfHandTotal: number;
  stealthTotal: number;
  survivalTotal: number;

  // Saving throw proficiency checkboxes
  strengthSaveProf: boolean;
  dexteritySaveProf: boolean;
  constitutionSaveProf: boolean;
  intelligenceSaveProf: boolean;
  wisdomSaveProf: boolean;
  charismaSaveProf: boolean;

  // Saving throw totals (calculated)
  strengthSaveTotal: number;
  dexteritySaveTotal: number;
  constitutionSaveTotal: number;
  intelligenceSaveTotal: number;
  wisdomSaveTotal: number;
  charismaSaveTotal: number;

  // Step 6: Combat
  armorClass: string;
  initiative: number;
  speed: string;
  maxHitPoints: number;
  hitDice: string;
  deathSaveSuccess1: boolean;
  deathSaveSuccess2: boolean;
  deathSaveSuccess3: boolean;
  deathSaveFailure1: boolean;
  deathSaveFailure2: boolean;
  deathSaveFailure3: boolean;

  // Step 7: Equipment
  gold: string;
  copper: string;
  silver: string;
  electrum: string;
  platinum: string;
  armorName: string;
  armorType: string;
  weapon1Name: string;
  weapon2Name: string;
  weapon3Name: string;
  weapon1DamageType: string;
  weapon2DamageType: string;
  weapon3DamageType: string;
  weapon1Damage: string;
  weapon2Damage: string;
  weapon3Damage: string;
  equipment: string;

  // Step 8: Spellcasting
  spellcastingClass: string;
  spellcastingAbility: string;
  spellSaveDC: number;
  spellAttackBonus: number;
  spellSlots1: string;
  spellSlots2: string;
  spellSlots3: string;
  spellSlots4: string;
  spellSlots5: string;
  spellSlots6: string;
  spellSlots7: string;
  spellSlots8: string;
  spellSlots9: string;
  cantrips: string;
  spells1: string;
  spells2: string;
  spells3: string;
  spells4: string;
  spells5: string;

  // Step 9: Background Features
  backgroundFeature: string;
  personalityTraits: string;
  ideals: string;
  bonds: string;
  flaws: string;
  featName: string;
  featDescription: string;
  languagesKnown: string;
  toolProficiencies: string;
  otherProficiencies: string;

  // Step 10: Notes
  backstory: string;
  alliesOrganizations: string;
  additionalFeatures: string;
  treasure: string;
  notes: string;
}

// ---------------------------------------------------------------------------
// Derivation functions
// Each function name must exactly match a "derivation" value in the schema.
// ---------------------------------------------------------------------------

/**
 * Calculates an ability score modifier from the raw ability score.
 *
 * Formula: floor((score - 10) / 2)
 * Source: PHB 2024, Ability Scores and Modifiers (p. 12).
 *
 * Examples:
 *   10 → 0, 12 → +1, 8 → -1, 20 → +5, 1 → -5
 *
 * Used for: strengthMod, dexterityMod, constitutionMod,
 *           intelligenceMod, wisdomMod, charismaMod
 */
export function calcAbilityModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

/**
 * Calculates proficiency bonus from character level.
 *
 * Band table (PHB 2024, p. 14):
 *   Level  1–4  → +2
 *   Level  5–8  → +3
 *   Level  9–12 → +4
 *   Level 13–16 → +5
 *   Level 17–20 → +6
 *
 * Used for: proficiencyBonus
 */
export function calcProficiencyBonus(level: number): number {
  const clamped = Math.max(1, Math.min(20, level));
  return PROFICIENCY_BONUS_BY_LEVEL[clamped];
}

/**
 * Calculates a skill total from the ability modifier, proficiency bonus,
 * and whether the character is proficient in the skill.
 *
 * Formula: abilityMod + (isProficient ? proficiencyBonus : 0)
 * Source: PHB 2024, Skills (p. 16).
 *
 * Note: Half-proficiency (Jack of All Trades for Bards) and expertise are
 * not modeled in the base schema; they can be applied as manual overrides.
 *
 * Used for: all 18 skill totals (acrobaticsTotal, arcanaTotal, etc.)
 */
export function calcSkillTotal(
  abilityMod: number,
  proficiencyBonus: number,
  isProficient: boolean,
): number {
  return abilityMod + (isProficient ? proficiencyBonus : 0);
}

/**
 * Calculates a saving throw total from the ability modifier, proficiency bonus,
 * and whether the character is proficient in that saving throw.
 *
 * Formula: abilityMod + (isProficient ? proficiencyBonus : 0)
 * Source: PHB 2024, Saving Throws (p. 15).
 *
 * Used for: strengthSaveTotal, dexteritySaveTotal, constitutionSaveTotal,
 *           intelligenceSaveTotal, wisdomSaveTotal, charismaSaveTotal
 */
export function calcSavingThrow(
  abilityMod: number,
  proficiencyBonus: number,
  isProficient: boolean,
): number {
  return abilityMod + (isProficient ? proficiencyBonus : 0);
}

/**
 * Calculates Initiative from the Dexterity modifier.
 *
 * In the 2024 PHB revision, Initiative equals the Dexterity modifier by default.
 * Some features (Alert feat, Bard's Jack of All Trades) can modify this further.
 * Source: PHB 2024, Initiative (p. 22).
 *
 * Used for: initiative
 */
export function calcInitiative(dexMod: number): number {
  return dexMod;
}

/**
 * Calculates the Spell Save DC.
 *
 * Formula: 8 + proficiency bonus + spellcasting ability modifier
 * Source: PHB 2024, Spellcasting (p. 232).
 *
 * Used for: spellSaveDC
 */
export function calcSpellSaveDC(
  profBonus: number,
  spellcastingAbilityMod: number,
): number {
  return 8 + profBonus + spellcastingAbilityMod;
}

/**
 * Calculates the Spell Attack Bonus.
 *
 * Formula: proficiency bonus + spellcasting ability modifier
 * Source: PHB 2024, Spellcasting (p. 232).
 *
 * Used for: spellAttackBonus
 */
export function calcSpellAttackBonus(
  profBonus: number,
  spellcastingAbilityMod: number,
): number {
  return profBonus + spellcastingAbilityMod;
}

/**
 * Derives the hit die string from the character's class.
 *
 * Returns a string like "d12", "d10", "d8", or "d6".
 * Source: PHB 2024, class descriptions.
 *
 * Class → Hit Die:
 *   Barbarian                                  → d12
 *   Fighter, Paladin, Ranger                   → d10
 *   Artificer, Bard, Cleric, Druid, Monk,
 *   Rogue, Warlock                             → d8
 *   Sorcerer, Wizard                           → d6
 *
 * Used for: hitDie
 */
export function calcHitDieFromClass(characterClass: string): string {
  const classKey = characterClass.toLowerCase().trim();
  const dieSize = HIT_DIE_BY_CLASS[classKey];
  if (dieSize !== undefined) {
    return `d${dieSize}`;
  }
  // Fallback for unknown class — treat as d8
  return 'd8';
}

/**
 * Calculates maximum hit points.
 *
 * Rules (PHB 2024, p. 15):
 *   - Level 1: Maximum hit die value + Constitution modifier
 *   - Each subsequent level: Average hit die value (rounded up) + Constitution modifier
 *   - Average values: d6→4, d8→5, d10→6, d12→7
 *   - Formula: (hitDieMax + conMod) + ((hitDieAvg + conMod) × (level − 1))
 *
 * Parameters:
 *   hitDie            — maximum face of the hit die (6, 8, 10, or 12)
 *   constitutionMod   — Constitution modifier (can be negative)
 *   level             — character level (1–20)
 *
 * Used for: maxHitPoints
 */
export function calcMaxHitPoints(
  hitDie: number,
  constitutionMod: number,
  level: number,
): number {
  // Average hit die value, rounded up: ceil(hitDie / 2) + 0.5 = floor(hitDie / 2) + 1
  const hitDieAvg = Math.floor(hitDie / 2) + 1;
  const lvl1HP = hitDie + constitutionMod;
  const subsequentHP = (hitDieAvg + constitutionMod) * (level - 1);
  // Minimum 1 HP per level
  const total = lvl1HP + subsequentHP;
  return Math.max(level, total);
}

// ---------------------------------------------------------------------------
// Helper utilities (not schema derivations, but useful for the UI layer)
// ---------------------------------------------------------------------------

/**
 * Returns the point buy cost for a single ability score value.
 * Scores below 8 or above 15 are not valid for point buy.
 * Source: PHB 2024, Point Buy (p. 13).
 */
export function getPointBuyCost(score: number): number {
  return POINT_BUY_COSTS[score] ?? 0;
}

/**
 * Calculates the total points spent across all six ability scores in point buy.
 */
export function calcPointBuyTotal(scores: readonly number[]): number {
  return scores.reduce((sum, score) => sum + (POINT_BUY_COSTS[score] ?? 0), 0);
}

/**
 * Returns the numeric hit die size for a given class string.
 * Useful for feeding calcMaxHitPoints from calcHitDieFromClass output.
 */
export function getHitDieSizeFromClass(characterClass: string): number {
  const classKey = characterClass.toLowerCase().trim();
  return HIT_DIE_BY_CLASS[classKey] ?? 8;
}
