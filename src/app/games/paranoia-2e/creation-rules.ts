/**
 * Paranoia 2nd Edition — Character Creation Rules
 *
 * All derivation functions referenced by paranoia-2e.schema.json live here.
 * Every exported function name must exactly match a "derivation" value in the schema.
 *
 * Band tables sourced from:
 *   - init.json `skillbases.skillbase_bands` (skill base calculation)
 *   - main.js damage/macho/carrying formulae
 *   - main.js `randomServiceGroup()` and mutation/society dropdown ordering
 */

// ---------------------------------------------------------------------------
// Band-table types
// ---------------------------------------------------------------------------

interface BandEntry {
  readonly threshold: number; // attribute score must be > this value to reach `band`
  readonly band: number;
}

// ---------------------------------------------------------------------------
// Skill Base Band Table
// Source: init.json `skillbases.skillbase_bands`
// score > 0 → 0, score > 3 → 1, score > 6 → 2, score > 10 → 3, score > 14 → 4, score > 17 → 5
// ---------------------------------------------------------------------------
const SKILL_BASE_BANDS: readonly BandEntry[] = [
  { threshold: 17, band: 5 },
  { threshold: 14, band: 4 },
  { threshold: 10, band: 3 },
  { threshold: 6,  band: 2 },
  { threshold: 3,  band: 1 },
  { threshold: 0,  band: 0 },
] as const;

// ---------------------------------------------------------------------------
// Service Group roll table (d20 → service group id)
// Source: main.js randomServiceGroup()
// ---------------------------------------------------------------------------
interface ServiceGroupRollEntry {
  readonly min: number;
  readonly max: number;
  readonly id: string;
}

const SERVICE_GROUP_ROLL_TABLE: readonly ServiceGroupRollEntry[] = [
  { min: 1,  max: 2,  id: 'intsec' },
  { min: 3,  max: 4,  id: 'tech-services' },
  { min: 5,  max: 8,  id: 'hpdmc' },
  { min: 9,  max: 11, id: 'armed-services' },
  { min: 12, max: 14, id: 'plc' },
  { min: 15, max: 16, id: 'power-services' },
  { min: 17, max: 18, id: 'rd' },
  { min: 19, max: 20, id: 'cpu' },
] as const;

// ---------------------------------------------------------------------------
// Mutation list (1-based d20 index → mutation id)
// Source: paranoia2nd.html dropdown, in order
// ---------------------------------------------------------------------------
const MUTATION_TABLE: readonly string[] = [
  'adrenaline-control',   // 1
  'charm',                // 2
  'deep-probe',           // 3
  'electroshock',         // 4
  'empathy',              // 5
  'energy-field',         // 6
  'hypersenses',          // 7
  'levitation',           // 8
  'machine-empathy',      // 9
  'matter-eater',         // 10
  'mechanical-intuition', // 11
  'mental-blast',         // 12
  'polymorphism',         // 13
  'precognition',         // 14
  'pyrokinesis',          // 15
  'regeneration',         // 16
  'telekinesis',          // 17
  'telepathy',            // 18
  'teleport',             // 19
  'x-ray-vision',         // 20
] as const;

// ---------------------------------------------------------------------------
// Secret Society list (1-based index → society id)
// Rolls 18-20 map to IntSec mole special rule.
// Indices 1-17 map to the 17 named societies.
// ---------------------------------------------------------------------------
const SECRET_SOCIETY_TABLE: readonly string[] = [
  'anti-mutant',            // 1
  'computer-phreaks',       // 2
  'communists',             // 3
  'corpore-metal',          // 4
  'death-leopard',          // 5
  'fcccp',                  // 6
  'frankenstein-destroyers',// 7
  'free-enterprise',        // 8
  'humanists',              // 9
  'illuminati',             // 10
  'mystics',                // 11
  'pro-tech',               // 12
  'psion',                  // 13
  'purge',                  // 14
  'romantics',              // 15
  'sierra-club',            // 16
  'other',                  // 17
  // 18-20 → IntSec mole (handled explicitly in rollSecretSociety)
] as const;

// ---------------------------------------------------------------------------
// Service group → skill field ids with max 20
// Source: rules summary Step 5 table
// ---------------------------------------------------------------------------
const SERVICE_GROUP_SKILLS: Readonly<Record<string, readonly string[]>> = {
  'intsec': [
    'skill_truncheon',
    'skill_unarmed',
    'skill_interrogation',
    'skill_intimidation',
    'skill_laser_weapons',
    'skill_security',
    'skill_surveillance',
  ],
  'tech-services': [
    'skill_spurious_logic',
    'skill_autocar_operation',
    'skill_transbot_operation',
    'skill_docbot_operation',
    'skill_jackobot_operation',
    'skill_scrubot_operation',
    'skill_electronic_engineering',
    'skill_mechanical_engineering',
  ],
  'hpdmc': [
    'skill_bootlicking',
    'skill_con',
    'skill_forgery',
    'skill_oratory',
    'skill_docbot_operation',
    'skill_biochemical_therapy',
    'skill_medical',
  ],
  'armed-services': [
    'skill_grenade',
    'skill_primitive_melee_weapons',
    'skill_unarmed',
    'skill_motivation',
    'skill_laser_weapons',
    'skill_projectile_weapons',
    'skill_demolition',
    'skill_survival',
    'skill_vulturecraft_operation',
  ],
  'plc': [
    'skill_bribery',
    'skill_fast_talk',
    'skill_forgery',
    'skill_habitat_engineering',
    'skill_jackobot_operation',
    'skill_biosciences',
  ],
  'power-services': [
    'skill_spurious_logic',
    'skill_habitat_engineering',
    'skill_jackobot_operation',
    'skill_chemical_engineering',
    'skill_electronic_engineering',
    'skill_mechanical_engineering',
    'skill_nuclear_engineering',
  ],
  'rd': [
    'skill_jackobot_operation',
    'skill_biosciences',
    'skill_data_analysis',
    'skill_data_search',
    'skill_electronic_engineering',
    'skill_mechanical_engineering',
  ],
  'cpu': [
    'skill_fast_talk',
    'skill_intimidation',
    'skill_motivation',
    'skill_psychescan',
    'skill_security',
    'skill_data_analysis',
    'skill_data_search',
  ],
} as const;

// ---------------------------------------------------------------------------
// Character interface — all fields from paranoia-2e.schema.json
// ---------------------------------------------------------------------------

export interface ParanoiaCharacter {
  // identity
  characterName: string;
  clearance: string;
  playerName: string;

  // attributes
  strength: number;
  endurance: number;
  agility: number;
  dexterity: number;
  moxie: number;
  chutzpah: number;
  mech: number;
  mutant_power: number;

  // derived stats
  agility_skill_base: number;
  dexterity_skill_base: number;
  moxie_skill_base: number;
  chutzpah_skill_base: number;
  mech_skill_base: number;
  damage_bonus: number;
  macho_bonus: number;
  carrying_capacity: number;

  // service group
  serviceGroupRoll: number;
  serviceGroup: string;

  // skills — agility
  skill_force_sword: number;
  skill_grenade: number;
  skill_neurowhip: number;
  skill_primitive_melee_weapons: number;
  skill_truncheon: number;
  skill_unarmed: number;

  // skills — chutzpah
  skill_bootlicking: number;
  skill_bribery: number;
  skill_con: number;
  skill_fast_talk: number;
  skill_forgery: number;
  skill_interrogation: number;
  skill_intimidation: number;
  skill_motivation: number;
  skill_oratory: number;
  skill_psychescan: number;
  skill_spurious_logic: number;

  // skills — dexterity
  skill_energy_weapons: number;
  skill_field_weapons: number;
  skill_laser_weapons: number;
  skill_projectile_weapons: number;
  skill_primitive_missile_weapons: number;
  skill_vehicle_aimed_weapons: number;
  skill_vehicle_field_weapons: number;
  skill_vehicle_launched_weapons: number;

  // skills — mechanical
  skill_habitat_engineering: number;
  skill_jackobot_operation: number;
  skill_docbot_operation: number;
  skill_transbot_operation: number;
  skill_scrubot_operation: number;
  skill_vulturecraft_operation: number;
  skill_autocar_operation: number;

  // skills — moxie
  skill_biochemical_therapy: number;
  skill_biosciences: number;
  skill_chemical_engineering: number;
  skill_data_analysis: number;
  skill_data_search: number;
  skill_demolition: number;
  skill_electronic_engineering: number;
  skill_mechanical_engineering: number;
  skill_medical: number;
  skill_nuclear_engineering: number;
  skill_old_reckoning_cultures: number;
  skill_security: number;
  skill_stealth: number;
  skill_surveillance: number;
  skill_survival: number;

  // weapons (5 slots)
  weapon1_name: string;
  weapon1_type: string;
  weapon1_damage: string;
  weapon1_range: string;
  weapon1_experimental: boolean;
  weapon2_name: string;
  weapon2_type: string;
  weapon2_damage: string;
  weapon2_range: string;
  weapon2_experimental: boolean;
  weapon3_name: string;
  weapon3_type: string;
  weapon3_damage: string;
  weapon3_range: string;
  weapon3_experimental: boolean;
  weapon4_name: string;
  weapon4_type: string;
  weapon4_damage: string;
  weapon4_range: string;
  weapon4_experimental: boolean;
  weapon5_name: string;
  weapon5_type: string;
  weapon5_damage: string;
  weapon5_range: string;
  weapon5_experimental: boolean;

  // armour
  armour_worn: string;
  armour_rating: string;

  // equipment
  credits: string;
  equipment_notes: string;

  // secret mutation
  mutationRoll: number;
  mutationName: string;
  mutation_notes: string;

  // secret society
  societyRoll: number;
  primarySociety: string;
  coverSocietyRoll: number;
  coverSociety: string;
  society_notes: string;

  // public notes
  public_notes: string;
}

// ---------------------------------------------------------------------------
// Derivation functions
// Each function name must exactly match a "derivation" value in the schema.
// ---------------------------------------------------------------------------

/**
 * Converts an attribute score to a Skill Base value (0–5).
 *
 * Band table (from init.json `skillbases.skillbase_bands`):
 *   1–3   → 0
 *   4–6   → 1
 *   7–9   → 2
 *   10–13 → 3
 *   14–16 → 4
 *   17–20 → 5
 *
 * Used for: agility_skill_base, dexterity_skill_base, moxie_skill_base,
 *           chutzpah_skill_base, mech_skill_base
 */
export function calcSkillBase(attributeScore: number): number {
  for (const entry of SKILL_BASE_BANDS) {
    if (attributeScore > entry.threshold) {
      return entry.band;
    }
  }
  return 0;
}

/**
 * Calculates the Damage Bonus from Strength.
 *
 * STR 1–13  → 0
 * STR 14–18 → +1
 * STR 19–20 → +2
 *
 * Source: main.js `if STR > 13 → 1; if STR > 18 → 2`
 */
export function calcDamageBonus(strength: number): number {
  if (strength > 18) return 2;
  if (strength > 13) return 1;
  return 0;
}

/**
 * Calculates the Macho Bonus from Endurance.
 *
 * END 1–13  → 0
 * END 14–18 → +1
 * END 19–20 → +2
 *
 * Source: main.js `if END > 13 → 1; if END > 18 → 2`
 */
export function calcMachoBonus(endurance: number): number {
  if (endurance > 18) return 2;
  if (endurance > 13) return 1;
  return 0;
}

/**
 * Calculates Carrying Capacity (in kg) from Strength.
 *
 * Formula: max(0, STR - 12) × 5 + 25
 * Minimum: 25 kg (for STR ≤ 12)
 * Maximum: 65 kg (for STR = 20)
 *
 * Source: main.js
 */
export function calcCarryingCapacity(strength: number): number {
  const base = Math.max(0, strength - 12);
  return base * 5 + 25;
}

// ---------------------------------------------------------------------------
// Roll helpers
// ---------------------------------------------------------------------------

/**
 * Maps a d20 roll (1–20) to a service group id.
 * Source: main.js randomServiceGroup()
 */
export function rollServiceGroup(d20: number): string {
  for (const entry of SERVICE_GROUP_ROLL_TABLE) {
    if (d20 >= entry.min && d20 <= entry.max) {
      return entry.id;
    }
  }
  // fallback — should never occur with a valid d20 roll
  return 'plc';
}

/**
 * Maps a d20 roll (1–20) to a mutation id.
 * Result is 1-based: roll 1 → index 0 in MUTATION_TABLE.
 */
export function rollMutation(d20: number): string {
  const index = Math.max(1, Math.min(20, d20)) - 1;
  return MUTATION_TABLE[index];
}

/**
 * Maps a d20 roll (1–20) to a secret society result.
 * Rolls 18–20 trigger the IntSec mole special rule.
 */
export function rollSecretSociety(d20: number): { primary: string; isIntSec: boolean } {
  if (d20 >= 18) {
    return { primary: 'intsec', isIntSec: true };
  }
  const index = Math.max(1, Math.min(17, d20)) - 1;
  return { primary: SECRET_SOCIETY_TABLE[index], isIntSec: false };
}

/**
 * Maps a d20 roll to a cover society id for IntSec moles.
 * Re-rolls 18–20 internally (simulated by clamping to the 17-entry table).
 * The caller must supply a d20 that was genuinely re-rolled if 18–20 came up;
 * this function will clamp any residual 18–20 result to 'other' as a safety fallback.
 */
export function rollCoverSociety(d20: number): string {
  // Re-roll semantics: any value >= 18 is invalid for a cover society.
  // In practice the UI should re-roll until a valid result appears.
  // Here we clamp to the first 17 entries as a defensive fallback.
  const clamped = Math.max(1, Math.min(17, d20));
  return SECRET_SOCIETY_TABLE[clamped - 1];
}

// ---------------------------------------------------------------------------
// Skill helpers
// ---------------------------------------------------------------------------

/**
 * Returns the list of skill field ids that have a max of 20 (instead of 12)
 * for the given service group.
 */
export function getServiceGroupSkills(serviceGroupId: string): string[] {
  return [...(SERVICE_GROUP_SKILLS[serviceGroupId] ?? [])];
}

/**
 * Returns the maximum allowed value for a skill given the current service group.
 * Service group skills cap at 20; all other skills cap at 12.
 */
export function getSkillMax(skillId: string, serviceGroupId: string): number {
  const groupSkills = SERVICE_GROUP_SKILLS[serviceGroupId] ?? [];
  return (groupSkills as readonly string[]).includes(skillId) ? 20 : 12;
}
