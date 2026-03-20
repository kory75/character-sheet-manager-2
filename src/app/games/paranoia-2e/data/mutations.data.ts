/**
 * Paranoia 2nd Edition — Mutation Definitions
 *
 * All 20 mutations. Listed in d20 order (d20Index is 1-based).
 * Source: rules summary Step 8 and Data Tables — Mutations
 *
 * Type classification (Metabolic / Psionic) is adopted as canonical
 * per resolved clarification #3 in the rules summary.
 */

export type MutationType = 'Metabolic' | 'Psionic';

export interface MutationDefinition {
  /** 1-based index corresponding to the d20 roll result. */
  readonly d20Index: number;
  readonly id: string;
  readonly label: string;
  readonly type: MutationType;
  readonly description: string;
}

export const PARANOIA_MUTATIONS: readonly MutationDefinition[] = [
  {
    d20Index: 1,
    id: 'adrenaline-control',
    label: 'Adrenaline Control',
    type: 'Metabolic',
    description:
      'Boosts Agility and Unarmed Combat to 18; confers a degree of superhuman strength and speed.',
  },
  {
    d20Index: 2,
    id: 'charm',
    label: 'Charm',
    type: 'Psionic',
    description:
      'Basic use targets one other clone for a scene; a harder push can affect multiple targets.',
  },
  {
    d20Index: 3,
    id: 'deep-probe',
    label: 'Deep Probe',
    type: 'Psionic',
    description: 'Deep mental scan or probe of a target\'s thoughts or memories.',
  },
  {
    d20Index: 4,
    id: 'electroshock',
    label: 'Electroshock',
    type: 'Psionic',
    description:
      'Touch-range electrical discharge; more power extends the effect to a ranged zap.',
  },
  {
    d20Index: 5,
    id: 'empathy',
    label: 'Empathy',
    type: 'Psionic',
    description: 'Sense the emotional state of nearby persons.',
  },
  {
    d20Index: 6,
    id: 'energy-field',
    label: 'Energy Field',
    type: 'Metabolic',
    description: 'Generate a protective energy field around the body.',
  },
  {
    d20Index: 7,
    id: 'hypersenses',
    label: 'Hypersenses',
    type: 'Metabolic',
    description: 'Enhanced sensory perception (hearing, sight, and other senses).',
  },
  {
    d20Index: 8,
    id: 'levitation',
    label: 'Levitation',
    type: 'Psionic',
    description:
      'Rise approximately 1 metre and move at walking pace; more power provides greater height and speed.',
  },
  {
    d20Index: 9,
    id: 'machine-empathy',
    label: 'Machine Empathy',
    type: 'Psionic',
    description: 'Communicate with and understand machines and computers.',
  },
  {
    d20Index: 10,
    id: 'matter-eater',
    label: 'Matter Eater',
    type: 'Metabolic',
    description: 'Consume and digest any material safely.',
  },
  {
    d20Index: 11,
    id: 'mechanical-intuition',
    label: 'Mechanical Intuition',
    type: 'Metabolic',
    description: 'Instinctive understanding of mechanical systems.',
  },
  {
    d20Index: 12,
    id: 'mental-blast',
    label: 'Mental Blast',
    type: 'Psionic',
    description:
      'Point-blank area-of-effect: nosebleeds and headaches at base power; amplified to blackouts, injury, seizures, and death.',
  },
  {
    d20Index: 13,
    id: 'polymorphism',
    label: 'Polymorphism',
    type: 'Metabolic',
    description: 'Alter physical form and appearance.',
  },
  {
    d20Index: 14,
    id: 'precognition',
    label: 'Precognition',
    type: 'Psionic',
    description: 'Glimpse possible near-future events.',
  },
  {
    d20Index: 15,
    id: 'pyrokinesis',
    label: 'Pyrokinesis',
    type: 'Psionic',
    description:
      'Ignite nearby flames at base power; amplified to distant targets and larger fires.',
  },
  {
    d20Index: 16,
    id: 'regeneration',
    label: 'Regeneration',
    type: 'Metabolic',
    description: 'Accelerated healing of wounds.',
  },
  {
    d20Index: 17,
    id: 'telekinesis',
    label: 'Telekinesis',
    type: 'Psionic',
    description:
      'Move a small object mentally at base power; amplified for larger items and precise manipulation.',
  },
  {
    d20Index: 18,
    id: 'telepathy',
    label: 'Telepathy',
    type: 'Psionic',
    description: 'Read the dominant thought or implant a suggestion in one target.',
  },
  {
    d20Index: 19,
    id: 'teleport',
    label: 'Teleport',
    type: 'Psionic',
    description:
      'Personal teleportation at base power; amplified to transport companions or cover greater distance.',
  },
  {
    d20Index: 20,
    id: 'x-ray-vision',
    label: 'X-Ray Vision',
    type: 'Metabolic',
    description: 'See through solid objects.',
  },
] as const;

/** Convenience lookup: mutation id → definition */
export const MUTATION_BY_ID: Readonly<Record<string, MutationDefinition>> =
  Object.fromEntries(PARANOIA_MUTATIONS.map(m => [m.id, m]));

/** Convenience lookup: d20Index → mutation definition */
export const MUTATION_BY_D20: Readonly<Record<number, MutationDefinition>> =
  Object.fromEntries(PARANOIA_MUTATIONS.map(m => [m.d20Index, m]));
