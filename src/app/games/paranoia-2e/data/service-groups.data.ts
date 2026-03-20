/**
 * Paranoia 2nd Edition — Service Group Definitions
 *
 * All 8 service groups. Each entry includes:
 *   - id / label / description / provides
 *   - d20 roll range for random selection
 *   - skill ids that have a raised maximum of 20 (instead of the standard 12)
 *
 * Source: rules summary Step 4 and Step 5 tables
 */

export interface ServiceGroupDefinition {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly provides: string;
  /** Minimum d20 roll (inclusive) that maps to this service group. */
  readonly d20Min: number;
  /** Maximum d20 roll (inclusive) that maps to this service group. */
  readonly d20Max: number;
  /** Skill field ids for which this service group raises the max to 20. */
  readonly skillIds: readonly string[];
}

export const PARANOIA_SERVICE_GROUPS: readonly ServiceGroupDefinition[] = [
  {
    id: 'intsec',
    label: 'IntSec — Internal Security',
    description:
      'Internal Security identifies and eliminates traitors within Alpha Complex. They are the secret police. Not all citizens are Good and Loyal — IntSec makes sure their treasonous behaviour is Being Watched.',
    provides: 'Security for all Citizens; Termination Vouchers',
    d20Min: 1,
    d20Max: 2,
    skillIds: [
      'skill_truncheon',
      'skill_unarmed',
      'skill_interrogation',
      'skill_intimidation',
      'skill_laser_weapons',
      'skill_security',
      'skill_surveillance',
    ],
  },
  {
    id: 'tech-services',
    label: 'Tech Services — Technical Services',
    description:
      'If it\'s broken (which it isn\'t), Tech Services can fix it. All manner of devices and weapons can be brought to them to repair. Happily, things don\'t need repairing often, do they Citizen?',
    provides: 'Repairs',
    d20Min: 3,
    d20Max: 4,
    skillIds: [
      'skill_spurious_logic',
      'skill_autocar_operation',
      'skill_transbot_operation',
      'skill_docbot_operation',
      'skill_jackobot_operation',
      'skill_scrubot_operation',
      'skill_electronic_engineering',
      'skill_mechanical_engineering',
    ],
  },
  {
    id: 'hpdmc',
    label: 'HPD&MC — Housing Preservation Development & Mind Control',
    description:
      'HPD&MC is responsible for the health and welfare of all citizens. They house, clothe, provide medicines, and make sure that everyone is a Happy Citizen. Are you Happy?',
    provides: 'Medicines and drugs',
    d20Min: 5,
    d20Max: 8,
    skillIds: [
      'skill_bootlicking',
      'skill_con',
      'skill_forgery',
      'skill_oratory',
      'skill_docbot_operation',
      'skill_biochemical_therapy',
      'skill_medical',
    ],
  },
  {
    id: 'armed-services',
    label: 'Armed Services — The Army',
    description:
      'Armed Services protects Alpha Complex from invaders from without. The fact that no one has invaded Alpha Complex in its entire history is testament to their excellent work. These stalwart troops are armed to the teeth and prepared to die for the safety of the Complex.',
    provides: 'Heavy Weaponry',
    d20Min: 9,
    d20Max: 11,
    skillIds: [
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
  },
  {
    id: 'plc',
    label: 'PLC — Production, Logistics, and Commissary',
    description:
      'PLC provides needed goods and services — foodstuffs (Hot Fun! and Cold Fun!), drinks (Bouncy Bubble Beverage!), and clothing (One Size Fits All uniforms!). They also have all the lasers.',
    provides: 'Food, Clothes, Lasers',
    d20Min: 12,
    d20Max: 14,
    skillIds: [
      'skill_bribery',
      'skill_fast_talk',
      'skill_forgery',
      'skill_habitat_engineering',
      'skill_jackobot_operation',
      'skill_biosciences',
    ],
  },
  {
    id: 'power-services',
    label: 'Power Services',
    description:
      'Power Services provides power for the entire Complex. This difficult work typically involves standing around large poles drinking Hot Fun for many hours a day. They are also in charge of requisitioning large vehicles and devices.',
    provides: 'Big Devices and Vehicles',
    d20Min: 15,
    d20Max: 16,
    skillIds: [
      'skill_spurious_logic',
      'skill_habitat_engineering',
      'skill_jackobot_operation',
      'skill_chemical_engineering',
      'skill_electronic_engineering',
      'skill_mechanical_engineering',
      'skill_nuclear_engineering',
    ],
  },
  {
    id: 'rd',
    label: 'R&D — Research and Design',
    description:
      'Research and Design are in charge of creating new, wonderful devices — marvels of technology that explore brave new worlds and carry out heretofore unknown functions. All Troubleshooters should be proud to have R&D\'s experimental prototypes at their side.',
    provides: 'Experimental devices',
    d20Min: 17,
    d20Max: 18,
    skillIds: [
      'skill_jackobot_operation',
      'skill_biosciences',
      'skill_data_analysis',
      'skill_data_search',
      'skill_electronic_engineering',
      'skill_mechanical_engineering',
    ],
  },
  {
    id: 'cpu',
    label: 'CPU — Central Processing Unit',
    description:
      'CPU ensures that all other service groups carry out their tasks in coordination with each other. They are essential to the flawless functioning of Alpha Complex, providing endless amounts of guiding hierarchy. Most significantly they help note potentially treasonous or promotional behaviour.',
    provides: 'Records of missions; witness of Troubleshooter actions',
    d20Min: 19,
    d20Max: 20,
    skillIds: [
      'skill_fast_talk',
      'skill_intimidation',
      'skill_motivation',
      'skill_psychescan',
      'skill_security',
      'skill_data_analysis',
      'skill_data_search',
    ],
  },
] as const;

/** Convenience lookup: service group id → definition */
export const SERVICE_GROUP_BY_ID: Readonly<Record<string, ServiceGroupDefinition>> =
  Object.fromEntries(PARANOIA_SERVICE_GROUPS.map(sg => [sg.id, sg]));
