/**
 * Paranoia 2nd Edition — Attribute Definitions
 *
 * All eight core attributes. Each is rolled with 1d20 (range 1–20).
 * Source: rules summary Data Tables — Attributes
 */

export interface AttributeDefinition {
  readonly id: string;
  readonly label: string;
  readonly abbreviation: string;
  readonly rollFormula: string;
  readonly minValue: number;
  readonly maxValue: number;
  readonly description: string;
}

export const PARANOIA_ATTRIBUTES: readonly AttributeDefinition[] = [
  {
    id: 'strength',
    label: 'Strength',
    abbreviation: 'STR',
    rollFormula: '1d20',
    minValue: 1,
    maxValue: 20,
    description: 'Physical power. Governs melee damage bonus and carrying capacity.',
  },
  {
    id: 'endurance',
    label: 'Endurance',
    abbreviation: 'END',
    rollFormula: '1d20',
    minValue: 1,
    maxValue: 20,
    description: 'Damage tolerance. Governs Macho Bonus.',
  },
  {
    id: 'agility',
    label: 'Agility',
    abbreviation: 'AGI',
    rollFormula: '1d20',
    minValue: 1,
    maxValue: 20,
    description: 'Coordination, dodging, balance. Governs Agility skill group base.',
  },
  {
    id: 'dexterity',
    label: 'Dexterity',
    abbreviation: 'DEX',
    rollFormula: '1d20',
    minValue: 1,
    maxValue: 20,
    description: 'Hand-eye coordination and ranged accuracy. Governs Dexterity skill group base.',
  },
  {
    id: 'moxie',
    label: 'Moxie',
    abbreviation: 'MOX',
    rollFormula: '1d20',
    minValue: 1,
    maxValue: 20,
    description: 'Intelligence, comprehension, perception. Governs Moxie skill group base.',
  },
  {
    id: 'chutzpah',
    label: 'Chutzpah',
    abbreviation: 'CHU',
    rollFormula: '1d20',
    minValue: 1,
    maxValue: 20,
    description: 'Social audacity, nerve, persuasion. Governs Chutzpah skill group base.',
  },
  {
    id: 'mech',
    label: 'Mech. Aptitude',
    abbreviation: 'MechA',
    rollFormula: '1d20',
    minValue: 1,
    maxValue: 20,
    description: 'Understanding and operating machinery. Governs Mechanical skill group base.',
  },
  {
    id: 'mutant_power',
    label: 'Mutant Power',
    abbreviation: 'POW',
    rollFormula: '1d20',
    minValue: 1,
    maxValue: 20,
    description:
      'Strength of the character\'s secret mutant ability. Higher values enable more powerful mutation applications.',
  },
] as const;
