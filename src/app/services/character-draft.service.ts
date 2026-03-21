import { Injectable, signal } from '@angular/core';

export interface SnapshotAttribute {
  id: string;
  label: string;
  value: number;
}

export interface SnapshotSkill {
  id: string;
  label: string;
  group: string;
  value: number;
  base: number;
  max: number;
  treasonous: boolean;
}

export interface SnapshotWeapon {
  name: string;
  wsn: string;
  type: string;
  damage: string;
  range: string;
  experimental: boolean;
}

export interface SnapshotEquipmentItem {
  id: string;
  name: string;
  cost: number;
  quantity: number;
}

export interface CharacterSnapshot {
  // Identity
  firstName: string;
  sectorCode: string;
  cloneNumber: number;
  clearance: string;
  playerName: string;
  fullName: string;
  // Service group
  serviceGroupId: string | null;
  serviceGroupLabel: string;
  serviceGroupDescription: string;
  // Attributes
  attributes: SnapshotAttribute[];
  // Skills
  skills: SnapshotSkill[];
  // Weapons, armour & equipment
  weapons: SnapshotWeapon[];
  armourWorn: string;
  armourType: string;
  armourRating: string;
  equipment: SnapshotEquipmentItem[];
  // Mutation
  mutationId: string | null;
  mutationLabel: string;
  mutationType: string;
  mutationDescription: string;
  // Society
  societyId: string | null;
  societyLabel: string;
  societyIdeology: string;
  coverSocietyId: string | null;
  coverSocietyLabel: string;
  coverSocietyIdeology: string;
  // Notes
  publicNotes: string;
  secretNotes: string;
}

/**
 * Singleton service that bridges the character creation wizard with
 * the shell nav (live clearance/sector sync) and the finalised sheet view.
 */
@Injectable({ providedIn: 'root' })
export class CharacterDraftService {
  // Live identity signals — written by the creation wizard, read by the shell nav
  readonly clearance  = signal('R');
  readonly sectorCode = signal('');
  readonly firstName  = signal('');

  // Finalised snapshot — written on FINALISE, read by the sheet view
  readonly snapshot = signal<CharacterSnapshot | null>(null);
}
