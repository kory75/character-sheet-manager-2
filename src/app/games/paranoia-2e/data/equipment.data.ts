/**
 * Paranoia 2nd Edition — Equipment Definitions
 *
 * Two categories:
 *   1. Default items — issued to every Troubleshooter at no cost (isDefault: true)
 *   2. Purchasable items — available for purchase with Plasticredits (isDefault: false)
 *
 * Starting Plasticredits: 100
 * All items are Red clearance.
 *
 * Source: rules summary Step 6 and Data Tables — Equipment
 */

export interface EquipmentItem {
  readonly id: string;
  readonly label: string;
  /** Cost in Plasticredits. 0 for default (free) items. */
  readonly cost: number;
  /** True if issued to all starting Troubleshooters at no charge. */
  readonly isDefault: boolean;
  /** Optional notes on the item's use or special properties. */
  readonly notes?: string;
}

// ---------------------------------------------------------------------------
// 7 default items — standard Troubleshooter issue loadout
// Source: init.json `default_equipments`
// ---------------------------------------------------------------------------
const DEFAULT_EQUIPMENT: readonly EquipmentItem[] = [
  {
    id: 'red-reflect-armor',
    label: 'Red Reflect Armor',
    cost: 0,
    isDefault: true,
    notes: 'Armour Type: L, Rating: 4',
  },
  {
    id: 'laser-pistol',
    label: 'Laser Pistol',
    cost: 0,
    isDefault: true,
    notes: 'Type: L, Damage: 8, Range: 20. Weapon Skill Number auto-populates from Laser Weapons skill.',
  },
  {
    id: 'red-laser-barrel',
    label: 'Red Laser Barrel',
    cost: 0,
    isDefault: true,
    notes: 'Ammunition barrel for the standard Laser Pistol.',
  },
  {
    id: 'jumpsuit',
    label: 'Jumpsuit',
    cost: 0,
    isDefault: true,
    notes: 'Standard Red clearance uniform.',
  },
  {
    id: 'utility-belt',
    label: 'Utility Belt with Pouches',
    cost: 0,
    isDefault: true,
    notes: 'Standard issue carry gear.',
  },
  {
    id: 'comm-unit',
    label: 'Comm Unit Type I',
    cost: 0,
    isDefault: true,
    notes: 'Standard communications device.',
  },
  {
    id: 'notebook-stylus',
    label: 'Notebook & Stylus',
    cost: 0,
    isDefault: true,
    notes: 'For recording mission notes.',
  },
] as const;

// ---------------------------------------------------------------------------
// 24 purchasable items — Red clearance equipment list
// Source: rules summary Data Tables — Equipment
// ---------------------------------------------------------------------------
const PURCHASABLE_EQUIPMENT: readonly EquipmentItem[] = [
  {
    id: 'algae-chips',
    label: 'Bag of Cruncheetym Algae Chips',
    cost: 1,
    isDefault: false,
  },
  {
    id: 'boot-polish',
    label: 'Boot Polish',
    cost: 3,
    isDefault: false,
  },
  {
    id: 'bouncy-bubble-beverage',
    label: 'Bottle of Bouncy Bubble Beverage',
    cost: 5,
    isDefault: false,
  },
  {
    id: 'super-shine-mouthwash',
    label: 'Bottle of Super Shine Mouthwash',
    cost: 5,
    isDefault: false,
  },
  {
    id: 'bucket',
    label: 'Bucket',
    cost: 1,
    isDefault: false,
  },
  {
    id: 'bullhorn',
    label: 'Bullhorn',
    cost: 50,
    isDefault: false,
  },
  {
    id: 'cold-fun',
    label: 'Cold Fun in a self-sealing puck',
    cost: 2,
    isDefault: false,
  },
  {
    id: 'first-aid-kit',
    label: 'First Aid Kit',
    cost: 25,
    isDefault: false,
  },
  {
    id: 'flashlight',
    label: 'Flashlight',
    cost: 10,
    isDefault: false,
  },
  {
    id: 'gas-mask',
    label: 'Gas Mask',
    cost: 50,
    isDefault: false,
  },
  {
    id: 'happiness-energy-bar',
    label: 'Happiness Energy Bar',
    cost: 2,
    isDefault: false,
  },
  {
    id: 'hottorch',
    label: 'Hottorch',
    cost: 100,
    isDefault: false,
  },
  {
    id: 'teela-o-mirror',
    label: 'Official Teela-O Picture Mirror',
    cost: 5,
    isDefault: false,
  },
  {
    id: 'personal-hygiene-kit',
    label: 'Personal Hygiene Kit',
    cost: 25,
    isDefault: false,
  },
  {
    id: 'personalized-jumpsuit',
    label: 'Personalized Jumpsuit',
    cost: 50,
    isDefault: false,
  },
  {
    id: 'pillow',
    label: 'Pillow',
    cost: 12,
    isDefault: false,
  },
  {
    id: 'plasticord',
    label: 'Plasticord (1 credit per metre)',
    cost: 1,
    isDefault: false,
    notes: 'Price is per metre.',
  },
  {
    id: 'poncho',
    label: 'Poncho',
    cost: 15,
    isDefault: false,
  },
  {
    id: 'smoke-alarm',
    label: 'Smoke Alarm',
    cost: 25,
    isDefault: false,
  },
  {
    id: 'supergum',
    label: 'SuperGum',
    cost: 25,
    isDefault: false,
  },
  {
    id: 'supergum-solvent',
    label: 'SuperGum Solvent',
    cost: 25,
    isDefault: false,
  },
  {
    id: 'thermos',
    label: 'Thermos',
    cost: 25,
    isDefault: false,
  },
  {
    id: 'troubleshooting-pamphlet',
    label: 'Troubleshooting and You! Pamphlet',
    cost: 8,
    isDefault: false,
  },
  {
    id: 'velcro-strip',
    label: 'Velcro Strip (5 credits per metre)',
    cost: 5,
    isDefault: false,
    notes: 'Price is per metre.',
  },
] as const;

// ---------------------------------------------------------------------------
// Combined export
// ---------------------------------------------------------------------------

/** All equipment items (default + purchasable). */
export const PARANOIA_EQUIPMENT: readonly EquipmentItem[] = [
  ...DEFAULT_EQUIPMENT,
  ...PURCHASABLE_EQUIPMENT,
] as const;

/** Only the 7 default items issued to every starting Troubleshooter. */
export const PARANOIA_DEFAULT_EQUIPMENT: readonly EquipmentItem[] = DEFAULT_EQUIPMENT;

/** Only the 24 purchasable items. */
export const PARANOIA_PURCHASABLE_EQUIPMENT: readonly EquipmentItem[] = PURCHASABLE_EQUIPMENT;

/** Convenience lookup: equipment id → item definition. */
export const EQUIPMENT_BY_ID: Readonly<Record<string, EquipmentItem>> =
  Object.fromEntries(PARANOIA_EQUIPMENT.map(e => [e.id, e]));
