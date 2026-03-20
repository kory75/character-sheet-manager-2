/**
 * Paranoia 2nd Edition — Skill Definitions
 *
 * All 46 skills. Organised by skill group (governed attribute).
 * Source: rules summary Data Tables — Skills
 *
 * Field naming follows the schema id convention (skill_ prefix + snake_case).
 * Note: the legacy init.json had the typo "suprious_logic"; corrected here to "skill_spurious_logic".
 */

export type SkillGroup = 'agility' | 'chutzpah' | 'dexterity' | 'mechanical' | 'moxie';

export interface SkillDefinition {
  readonly id: string;
  readonly label: string;
  readonly skillGroup: SkillGroup;
  readonly description: string;
  /** True if use of this skill is explicitly treasonous in the rules. */
  readonly treasonous: boolean;
}

export const PARANOIA_SKILLS: readonly SkillDefinition[] = [
  // -------------------------------------------------------------------------
  // Agility Skills (6) — governed by Agility Skill Base
  // -------------------------------------------------------------------------
  {
    id: 'skill_force_sword',
    label: 'Force Sword',
    skillGroup: 'agility',
    description: 'Melee Combat. Using and maintaining a Force Sword.',
    treasonous: false,
  },
  {
    id: 'skill_grenade',
    label: 'Grenade',
    skillGroup: 'agility',
    description: 'Missile Combat. Throwing grenades accurately and safely.',
    treasonous: false,
  },
  {
    id: 'skill_neurowhip',
    label: 'Neurowhip',
    skillGroup: 'agility',
    description: 'Melee Combat. Using a Neurowhip.',
    treasonous: false,
  },
  {
    id: 'skill_primitive_melee_weapons',
    label: 'Primitive Melee Weapons',
    skillGroup: 'agility',
    description: 'Melee Combat. Using clubs, knives, and other primitive melee weapons.',
    treasonous: false,
  },
  {
    id: 'skill_truncheon',
    label: 'Truncheon',
    skillGroup: 'agility',
    description: 'Melee Combat. Using a truncheon (standard IntSec weapon).',
    treasonous: false,
  },
  {
    id: 'skill_unarmed',
    label: 'Unarmed',
    skillGroup: 'agility',
    description: 'Melee Combat. Unarmed fighting techniques.',
    treasonous: false,
  },

  // -------------------------------------------------------------------------
  // Chutzpah Skills (11) — governed by Chutzpah Skill Base
  // -------------------------------------------------------------------------
  {
    id: 'skill_bootlicking',
    label: 'Bootlicking',
    skillGroup: 'chutzpah',
    description: 'Ingratiating yourself with your superiors.',
    treasonous: false,
  },
  {
    id: 'skill_bribery',
    label: 'Bribery',
    skillGroup: 'chutzpah',
    description: 'Trading items for services. Use of this skill is Treasonous.',
    treasonous: true,
  },
  {
    id: 'skill_con',
    label: 'Con',
    skillGroup: 'chutzpah',
    description: 'Persuading someone to let you do something they probably should not allow.',
    treasonous: false,
  },
  {
    id: 'skill_fast_talk',
    label: 'Fast Talk',
    skillGroup: 'chutzpah',
    description: 'Like Con, but quicker. Getting past guards at a checkpoint.',
    treasonous: false,
  },
  {
    id: 'skill_forgery',
    label: 'Forgery',
    skillGroup: 'chutzpah',
    description: 'Faking forms and signatures. Use of this skill is Treasonous.',
    treasonous: true,
  },
  {
    id: 'skill_interrogation',
    label: 'Interrogation',
    skillGroup: 'chutzpah',
    description: 'Extracting useful information from Commie scum.',
    treasonous: false,
  },
  {
    id: 'skill_intimidation',
    label: 'Intimidation',
    skillGroup: 'chutzpah',
    description: 'Getting cooperation from your inferiors.',
    treasonous: false,
  },
  {
    id: 'skill_motivation',
    label: 'Motivation',
    skillGroup: 'chutzpah',
    description: 'Getting a few people thinking your idea is a good idea.',
    treasonous: false,
  },
  {
    id: 'skill_oratory',
    label: 'Oratory',
    skillGroup: 'chutzpah',
    description: 'Speech-giving. Motivation scaled up for large groups.',
    treasonous: false,
  },
  {
    id: 'skill_psychescan',
    label: 'Psychescan',
    skillGroup: 'chutzpah',
    description: 'Lie detection when talking to someone.',
    treasonous: false,
  },
  {
    id: 'skill_spurious_logic',
    label: 'Spurious Logic',
    skillGroup: 'chutzpah',
    description: 'Con and Fast Talk for use specifically against Bots and computers.',
    treasonous: false,
  },

  // -------------------------------------------------------------------------
  // Dexterity Skills (8) — governed by Dexterity Skill Base
  // -------------------------------------------------------------------------
  {
    id: 'skill_energy_weapons',
    label: 'Energy Weapons',
    skillGroup: 'dexterity',
    description: 'Missile Combat. Using and repairing energy weapons.',
    treasonous: false,
  },
  {
    id: 'skill_field_weapons',
    label: 'Field Weapons',
    skillGroup: 'dexterity',
    description: 'Missile Combat. Using and repairing field weapons.',
    treasonous: false,
  },
  {
    id: 'skill_laser_weapons',
    label: 'Laser Weapons',
    skillGroup: 'dexterity',
    description:
      'Missile Combat. Using and repairing laser weapons. Weapon Skill Number for slot 1 (Laser Pistol) auto-populates from this skill.',
    treasonous: false,
  },
  {
    id: 'skill_projectile_weapons',
    label: 'Projectile Weapons',
    skillGroup: 'dexterity',
    description: 'Missile Combat. Using and repairing projectile weapons.',
    treasonous: false,
  },
  {
    id: 'skill_primitive_missile_weapons',
    label: 'Primitive Missile Weapons',
    skillGroup: 'dexterity',
    description: 'Bow and arrows, Bouncy Bubble Beverage containers, and similar.',
    treasonous: false,
  },
  {
    id: 'skill_vehicle_aimed_weapons',
    label: 'Vehicle Aimed Weapons',
    skillGroup: 'dexterity',
    description: 'Vehicle Combat. Aimed weapon systems on vehicles.',
    treasonous: false,
  },
  {
    id: 'skill_vehicle_field_weapons',
    label: 'Vehicle Field Weapons',
    skillGroup: 'dexterity',
    description: 'Vehicle Combat. Field weapon systems on vehicles.',
    treasonous: false,
  },
  {
    id: 'skill_vehicle_launched_weapons',
    label: 'Vehicle Launched Weapons',
    skillGroup: 'dexterity',
    description: 'Vehicle Combat. Launched weapon systems on vehicles.',
    treasonous: false,
  },

  // -------------------------------------------------------------------------
  // Mechanical Aptitude Skills (7) — governed by Mech Skill Base
  // -------------------------------------------------------------------------
  {
    id: 'skill_habitat_engineering',
    label: 'Habitat Engineering',
    skillGroup: 'mechanical',
    description:
      'Knowledge of the air, comm, transport, water, and waste systems of Alpha Complex.',
    treasonous: false,
  },
  {
    id: 'skill_jackobot_operation',
    label: 'JackoBot Op. & Maint.',
    skillGroup: 'mechanical',
    description: 'How to use and repair the various types of JackoBots.',
    treasonous: false,
  },
  {
    id: 'skill_docbot_operation',
    label: 'DocBot Op. & Maint.',
    skillGroup: 'mechanical',
    description: 'How to use and repair DocBots.',
    treasonous: false,
  },
  {
    id: 'skill_transbot_operation',
    label: 'TransBot Op. & Maint.',
    skillGroup: 'mechanical',
    description: 'How to use and repair TransBots.',
    treasonous: false,
  },
  {
    id: 'skill_scrubot_operation',
    label: 'ScruBot Op. & Maint.',
    skillGroup: 'mechanical',
    description: 'How to use and repair ScruBots.',
    treasonous: false,
  },
  {
    id: 'skill_vulturecraft_operation',
    label: 'Vulturecraft Op. & Maint.',
    skillGroup: 'mechanical',
    description: 'How to use and repair Vulturecraft vehicles.',
    treasonous: false,
  },
  {
    id: 'skill_autocar_operation',
    label: 'Autocar Op. & Maint.',
    skillGroup: 'mechanical',
    description: 'How to use and repair Autocars.',
    treasonous: false,
  },

  // -------------------------------------------------------------------------
  // Moxie Skills (14) — governed by Moxie Skill Base
  // -------------------------------------------------------------------------
  {
    id: 'skill_biochemical_therapy',
    label: 'Biochemical Therapy',
    skillGroup: 'moxie',
    description: 'Better living through chemistry.',
    treasonous: false,
  },
  {
    id: 'skill_biosciences',
    label: 'Biosciences',
    skillGroup: 'moxie',
    description: 'Making mutant monsters and understanding biological systems.',
    treasonous: false,
  },
  {
    id: 'skill_chemical_engineering',
    label: 'Chemical Engineering',
    skillGroup: 'moxie',
    description: 'Mixing chemicals, often with explosive results.',
    treasonous: false,
  },
  {
    id: 'skill_data_analysis',
    label: 'Data Analysis',
    skillGroup: 'moxie',
    description: 'Making sense of Computer-printed materials and data.',
    treasonous: false,
  },
  {
    id: 'skill_data_search',
    label: 'Data Search',
    skillGroup: 'moxie',
    description: 'Finding information using Friend Computer.',
    treasonous: false,
  },
  {
    id: 'skill_demolition',
    label: 'Demolition',
    skillGroup: 'moxie',
    description: 'Blowing big things up without blowing yourself up in the process.',
    treasonous: false,
  },
  {
    id: 'skill_electronic_engineering',
    label: 'Electronic Engineering',
    skillGroup: 'moxie',
    description: 'Making electronic devices from resistors and capacitors.',
    treasonous: false,
  },
  {
    id: 'skill_mechanical_engineering',
    label: 'Mechanical Engineering',
    skillGroup: 'moxie',
    description: 'Rube Goldberg contraptions and other mechanical design.',
    treasonous: false,
  },
  {
    id: 'skill_medical',
    label: 'Medical',
    skillGroup: 'moxie',
    description: 'Healing injured Citizens.',
    treasonous: false,
  },
  {
    id: 'skill_nuclear_engineering',
    label: 'Nuclear Engineering',
    skillGroup: 'moxie',
    description: 'Stopping reactor meltdowns and managing nuclear systems.',
    treasonous: false,
  },
  {
    id: 'skill_old_reckoning_cultures',
    label: 'Old Reckoning Cultures',
    skillGroup: 'moxie',
    description: 'Knowledge of Pre-Oops people and things (forbidden history).',
    treasonous: false,
  },
  {
    id: 'skill_security',
    label: 'Security',
    skillGroup: 'moxie',
    description: 'Disabling locks and alarms.',
    treasonous: false,
  },
  {
    id: 'skill_stealth',
    label: 'Stealth',
    skillGroup: 'moxie',
    description: 'The art of not being seen.',
    treasonous: false,
  },
  {
    id: 'skill_surveillance',
    label: 'Surveillance',
    skillGroup: 'moxie',
    description: 'Bugging and debugging things.',
    treasonous: false,
  },
  {
    id: 'skill_survival',
    label: 'Survival',
    skillGroup: 'moxie',
    description: 'How to live Outdoors without generating clone replacements.',
    treasonous: false,
  },
] as const;

// Convenience: skills grouped by skillGroup
export const PARANOIA_SKILLS_BY_GROUP: Readonly<Record<SkillGroup, readonly SkillDefinition[]>> = {
  agility:    PARANOIA_SKILLS.filter(s => s.skillGroup === 'agility'),
  chutzpah:   PARANOIA_SKILLS.filter(s => s.skillGroup === 'chutzpah'),
  dexterity:  PARANOIA_SKILLS.filter(s => s.skillGroup === 'dexterity'),
  mechanical: PARANOIA_SKILLS.filter(s => s.skillGroup === 'mechanical'),
  moxie:      PARANOIA_SKILLS.filter(s => s.skillGroup === 'moxie'),
};
