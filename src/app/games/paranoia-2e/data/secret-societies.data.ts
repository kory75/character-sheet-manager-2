/**
 * Paranoia 2nd Edition — Secret Society Definitions
 *
 * 17 named societies plus the IntSec mole special rule (rolls 18–20).
 *
 * Special rule — IntSec mole:
 *   A d20 roll of 18–20 means the character is secretly an IntSec operative.
 *   They must roll a second time (re-rolling any result of 18–20) to determine
 *   a cover secret society. Both are recorded on the secret page.
 *   See: rollSecretSociety() and rollCoverSociety() in creation-rules.ts
 *
 * Source: rules summary Step 9 and Data Tables — Secret Societies
 */

export interface SecretSocietyDefinition {
  readonly id: string;
  readonly label: string;
  readonly ideology: string;
  /**
   * Minimum d20 roll (inclusive) that maps to this society.
   * For IntSec mole: d20Min = 18, d20Max = 20.
   * For societies 1–17: each maps to exactly one d20 value (d20Min === d20Max).
   */
  readonly d20Min: number;
  readonly d20Max: number;
  /**
   * True for the IntSec entry only.
   * When true, a second cover-society roll is required.
   */
  readonly isIntSecMole: boolean;
}

export const PARANOIA_SECRET_SOCIETIES: readonly SecretSocietyDefinition[] = [
  {
    id: 'anti-mutant',
    label: 'Anti-Mutant',
    ideology:
      'Eradicate all mutants from Alpha Complex. Schismatic, paranoid, violently anti-mutant.',
    d20Min: 1,
    d20Max: 1,
    isIntSecMole: false,
  },
  {
    id: 'computer-phreaks',
    label: 'Computer Phreaks',
    ideology:
      'Hack Computer terminals, credit licences, and records. Followers of the "Open Source Computing Initiative". Friendly with Pro Tech; hostile to FCCCP.',
    d20Min: 2,
    d20Max: 2,
    isIntSecMole: false,
  },
  {
    id: 'communists',
    label: 'Communists',
    ideology:
      'Overthrow The Computer, smash the machinery of capitalist oppression, power to the proletariat. Classic Marxist ideology transplanted into Alpha Complex.',
    d20Min: 3,
    d20Max: 3,
    isIntSecMole: false,
  },
  {
    id: 'corpore-metal',
    label: 'Corpore Metal',
    ideology:
      'Believe bots and AIs are the next stage of evolution; humans should help them achieve supremacy. Friendly with Pro Tech; hostile to Frankenstein Destroyers, Humanists, PURGE.',
    d20Min: 4,
    d20Max: 4,
    isIntSecMole: false,
  },
  {
    id: 'death-leopard',
    label: 'Death Leopard',
    ideology:
      'Blow things up, vandalize, defy authority. No deeper ideology — just chaos and fun.',
    d20Min: 5,
    d20Max: 5,
    isIntSecMole: false,
  },
  {
    id: 'fcccp',
    label: 'FCCCP',
    ideology:
      'First Church of Christ Computer Programmer. Worship The Computer as a divine entity. Functions as a false front for the sector\'s Program Group.',
    d20Min: 6,
    d20Max: 6,
    isIntSecMole: false,
  },
  {
    id: 'frankenstein-destroyers',
    label: 'Frankenstein Destroyers',
    ideology:
      'Luddite society: robots are the cause of all mankind\'s problems. Focused primarily on destroying the AI menace; general hostility to all technology.',
    d20Min: 7,
    d20Max: 7,
    isIntSecMole: false,
  },
  {
    id: 'free-enterprise',
    label: 'Free Enterprise',
    ideology:
      'Pseudo-mafia capitalism. Run the Infrared black markets in Alpha Complex. Adopt stereotypical organised-crime trappings.',
    d20Min: 8,
    d20Max: 8,
    isIntSecMole: false,
  },
  {
    id: 'humanists',
    label: 'Humanists',
    ideology:
      'Aware that The Computer is insane; strive to improve Alpha Complex by installing hidden backdoor codes, reprogramming rogue bots, and planning eventual restoration of power to the people.',
    d20Min: 9,
    d20Max: 9,
    isIntSecMole: false,
  },
  {
    id: 'illuminati',
    label: 'Illuminati',
    ideology:
      'Deeply secretive; most members don\'t know the organisation\'s actual goals. Members receive inscrutable orders; most pose as members of another society as cover.',
    d20Min: 10,
    d20Max: 10,
    isIntSecMole: false,
  },
  {
    id: 'mystics',
    label: 'Mystics',
    ideology:
      'Founded by those seeking enlightenment; in practice primarily focused on recreational drug use.',
    d20Min: 11,
    d20Max: 11,
    isIntSecMole: false,
  },
  {
    id: 'pro-tech',
    label: 'Pro Tech',
    ideology:
      'Love gadgets and experimental technology. Advance through stealing cool equipment and reprogramming bots. Friendly with Corpore Metal and Computer Phreaks; hostile to Frankenstein Destroyers and PURGE.',
    d20Min: 12,
    d20Max: 12,
    isIntSecMole: false,
  },
  {
    id: 'psion',
    label: 'Psion',
    ideology:
      'Run by the "Controls" — a hidden network of telepathic mutants. Seek to pave the way for a mutant-run future.',
    d20Min: 13,
    d20Max: 13,
    isIntSecMole: false,
  },
  {
    id: 'purge',
    label: 'PURGE',
    ideology:
      'Active terrorist organisation seeking violent overthrow of The Computer. No plan for what comes after — just destruction.',
    d20Min: 14,
    d20Max: 14,
    isIntSecMole: false,
  },
  {
    id: 'romantics',
    label: 'Romantics',
    ideology:
      'Obsessed with forbidden lore of the "Old Reckoning" (pre-Alpha Complex history). Information they have is fragmentary and often wrong. Different sects focus on different historical aspects.',
    d20Min: 15,
    d20Max: 15,
    isIntSecMole: false,
  },
  {
    id: 'sierra-club',
    label: 'Sierra Club',
    ideology:
      'Obsessed with the environment and the mysterious "Outdoors", access to which The Computer strictly limits.',
    d20Min: 16,
    d20Max: 16,
    isIntSecMole: false,
  },
  {
    id: 'other',
    label: 'Other',
    ideology: 'Catch-all for custom or campaign-specific secret societies.',
    d20Min: 17,
    d20Max: 17,
    isIntSecMole: false,
  },
  {
    id: 'intsec',
    label: 'IntSec (Mole)',
    ideology:
      'Internal Security operative. True allegiance is IntSec. Must also roll a cover society (re-rolling 18–20). Both are recorded on the secret page.',
    d20Min: 18,
    d20Max: 20,
    isIntSecMole: true,
  },
] as const;

/** Convenience lookup: society id → definition */
export const SECRET_SOCIETY_BY_ID: Readonly<Record<string, SecretSocietyDefinition>> =
  Object.fromEntries(PARANOIA_SECRET_SOCIETIES.map(s => [s.id, s]));

/**
 * All societies valid as a cover society (i.e. every society except IntSec).
 * Used when generating the cover society dropdown options.
 */
export const COVER_SOCIETY_OPTIONS: readonly SecretSocietyDefinition[] =
  PARANOIA_SECRET_SOCIETIES.filter(s => !s.isIntSecMole);
