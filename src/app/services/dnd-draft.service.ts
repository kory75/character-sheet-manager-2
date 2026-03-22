import { Injectable, computed, signal } from '@angular/core';
import {
  calcAbilityModifier,
  calcProficiencyBonus,
  calcMaxHitPoints,
  calcSpellSaveDC,
  calcSpellAttackBonus,
  getHitDieSizeFromClass,
} from '../games/dnd-5e-2024/creation-rules';

// ---------------------------------------------------------------------------
// Snapshot interfaces — written on finalise, read by sheet view
// ---------------------------------------------------------------------------

export interface DndWeaponSnapshot {
  name: string;
  damage: string;
  damageType: string;
}

export interface DndSnapshot {
  // Identity
  characterName: string;
  playerName: string;
  characterLevel: number;
  experiencePoints: string;
  background: string;
  // Species & Class
  species: string;
  characterClass: string;
  subclass: string;
  // Ability scores
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  strengthMod: number;
  dexMod: number;
  conMod: number;
  intMod: number;
  wisMod: number;
  chaMod: number;
  proficiencyBonus: number;
  abilityScoreMethod: string;
  // Skills & saves
  skillProficiencies: Record<string, boolean>;
  skillExpertise: Record<string, boolean>;
  savingThrowProficiencies: Record<string, boolean>;
  // Combat
  armorClass: string;
  initiative: number;
  speed: string;
  maxHitPoints: number;
  hitDice: string;
  deathSaveSuccesses: number;
  deathSaveFailures: number;
  // Currency
  gold: string;
  silver: string;
  copper: string;
  electrum: string;
  platinum: string;
  // Armour & weapons
  armorName: string;
  armorType: string;
  weapons: DndWeaponSnapshot[];
  equipment: string;
  // Spellcasting
  spellcastingClass: string;
  spellcastingAbility: string;
  spellSaveDC: number;
  spellAttackBonus: number;
  spellSlots: Record<string, string>;
  cantrips: string;
  spells1: string;
  spells2: string;
  spells3: string;
  spells4: string;
  spells5: string;
  // Background features
  personalityTraits: string;
  ideals: string;
  bonds: string;
  flaws: string;
  featName: string;
  featDescription: string;
  languagesKnown: string;
  toolProficiencies: string;
  otherProficiencies: string;
  // Notes
  backstory: string;
  alliesOrganizations: string;
  additionalFeatures: string;
  treasure: string;
  notes: string;
}

/**
 * Singleton service that holds all D&D 5e 2024 character creation wizard state
 * and the finalised snapshot for the sheet view.
 */
@Injectable({ providedIn: 'root' })
export class DndDraftService {

  // ── Identity ──────────────────────────────────────────────────────────────
  readonly characterName    = signal('');
  readonly playerName       = signal('');
  readonly characterLevel   = signal<number>(1);
  readonly experiencePoints = signal('');
  readonly background       = signal('');

  // ── Species & Class ───────────────────────────────────────────────────────
  readonly species         = signal('');
  readonly characterClass  = signal('');
  readonly subclass        = signal('');

  // ── Ability Scores ────────────────────────────────────────────────────────
  readonly abilityScoreMethod = signal<'roll' | 'standard-array' | 'point-buy'>('roll');
  readonly strength    = signal<number>(10);
  readonly dexterity   = signal<number>(10);
  readonly constitution = signal<number>(10);
  readonly intelligence = signal<number>(10);
  readonly wisdom       = signal<number>(10);
  readonly charisma     = signal<number>(10);

  // ── Computed ability modifiers ────────────────────────────────────────────
  readonly strengthMod = computed(() => calcAbilityModifier(this.strength()));
  readonly dexMod      = computed(() => calcAbilityModifier(this.dexterity()));
  readonly conMod      = computed(() => calcAbilityModifier(this.constitution()));
  readonly intMod      = computed(() => calcAbilityModifier(this.intelligence()));
  readonly wisMod      = computed(() => calcAbilityModifier(this.wisdom()));
  readonly chaMod      = computed(() => calcAbilityModifier(this.charisma()));

  // ── Computed derived stats ────────────────────────────────────────────────
  readonly proficiencyBonus = computed(() => calcProficiencyBonus(this.characterLevel()));
  readonly initiative       = computed(() => this.dexMod());

  readonly maxHitPoints = computed(() => {
    const hitDieSize = getHitDieSizeFromClass(this.characterClass());
    return calcMaxHitPoints(hitDieSize, this.conMod(), this.characterLevel());
  });

  readonly spellSaveDC = computed(() => {
    const abilityMod = this._spellcastingAbilityMod();
    return calcSpellSaveDC(this.proficiencyBonus(), abilityMod);
  });

  readonly spellAttackBonus = computed(() => {
    const abilityMod = this._spellcastingAbilityMod();
    return calcSpellAttackBonus(this.proficiencyBonus(), abilityMod);
  });

  readonly fullName = computed(() => this.characterName() || 'Unnamed Adventurer');

  // ── Skills & Saving Throws ────────────────────────────────────────────────
  readonly skillProficiencies        = signal<Record<string, boolean>>({});
  readonly skillExpertise            = signal<Record<string, boolean>>({});
  readonly savingThrowProficiencies  = signal<Record<string, boolean>>({});

  // ── Combat ────────────────────────────────────────────────────────────────
  readonly armorClass          = signal('10');
  readonly speed               = signal('30 ft.');
  readonly hitDiceOverride     = signal('');
  readonly deathSaveSuccesses  = signal<number>(0);
  readonly deathSaveFailures   = signal<number>(0);

  // ── Currency ──────────────────────────────────────────────────────────────
  readonly gold     = signal('');
  readonly silver   = signal('');
  readonly copper   = signal('');
  readonly electrum = signal('');
  readonly platinum = signal('');

  // ── Armour & Weapons ──────────────────────────────────────────────────────
  readonly armorName = signal('');
  readonly armorType = signal('None');
  readonly weapons   = signal<DndWeaponSnapshot[]>([
    { name: '', damage: '', damageType: '' },
    { name: '', damage: '', damageType: '' },
    { name: '', damage: '', damageType: '' },
  ]);
  readonly equipment = signal('');

  // ── Spellcasting ──────────────────────────────────────────────────────────
  readonly spellcastingClass   = signal('');
  readonly spellcastingAbility = signal('INT');
  readonly spellSlots          = signal<Record<string, string>>({});
  readonly cantrips = signal('');
  readonly spells1  = signal('');
  readonly spells2  = signal('');
  readonly spells3  = signal('');
  readonly spells4  = signal('');
  readonly spells5  = signal('');

  // ── Background Features ───────────────────────────────────────────────────
  readonly personalityTraits  = signal('');
  readonly ideals             = signal('');
  readonly bonds              = signal('');
  readonly flaws              = signal('');
  readonly featName           = signal('');
  readonly featDescription    = signal('');
  readonly languagesKnown     = signal('');
  readonly toolProficiencies  = signal('');
  readonly otherProficiencies = signal('');

  // ── Notes ─────────────────────────────────────────────────────────────────
  readonly backstory           = signal('');
  readonly alliesOrganizations = signal('');
  readonly additionalFeatures  = signal('');
  readonly treasure            = signal('');
  readonly notes               = signal('');

  // ── Snapshot (written on finalise, read by sheet) ─────────────────────────
  readonly snapshot = signal<DndSnapshot | null>(null);

  // ── Private helpers ───────────────────────────────────────────────────────

  private _spellcastingAbilityMod(): number {
    const ability = this.spellcastingAbility();
    switch (ability) {
      case 'INT': return this.intMod();
      case 'WIS': return this.wisMod();
      case 'CHA': return this.chaMod();
      default:    return this.intMod();
    }
  }

  // ── Load from saved snapshot ──────────────────────────────────────────────

  loadFromSnapshot(s: DndSnapshot): void {
    this.characterName.set(s.characterName);
    this.playerName.set(s.playerName);
    this.characterLevel.set(s.characterLevel);
    this.experiencePoints.set(s.experiencePoints);
    this.background.set(s.background);
    this.species.set(s.species);
    this.characterClass.set(s.characterClass);
    this.subclass.set(s.subclass);
    this.abilityScoreMethod.set(s.abilityScoreMethod as 'roll' | 'standard-array' | 'point-buy');
    this.strength.set(s.strength);
    this.dexterity.set(s.dexterity);
    this.constitution.set(s.constitution);
    this.intelligence.set(s.intelligence);
    this.wisdom.set(s.wisdom);
    this.charisma.set(s.charisma);
    this.skillProficiencies.set({ ...s.skillProficiencies });
    this.skillExpertise.set({ ...s.skillExpertise });
    this.savingThrowProficiencies.set({ ...s.savingThrowProficiencies });
    this.armorClass.set(s.armorClass);
    this.speed.set(s.speed);
    this.hitDiceOverride.set('');
    this.deathSaveSuccesses.set(s.deathSaveSuccesses);
    this.deathSaveFailures.set(s.deathSaveFailures);
    this.gold.set(s.gold);
    this.silver.set(s.silver);
    this.copper.set(s.copper);
    this.electrum.set(s.electrum);
    this.platinum.set(s.platinum);
    this.armorName.set(s.armorName);
    this.armorType.set(s.armorType);
    this.weapons.set(s.weapons.map(w => ({ ...w })));
    this.equipment.set(s.equipment);
    this.spellcastingClass.set(s.spellcastingClass);
    this.spellcastingAbility.set(s.spellcastingAbility);
    this.spellSlots.set({ ...s.spellSlots });
    this.cantrips.set(s.cantrips);
    this.spells1.set(s.spells1);
    this.spells2.set(s.spells2);
    this.spells3.set(s.spells3);
    this.spells4.set(s.spells4);
    this.spells5.set(s.spells5);
    this.personalityTraits.set(s.personalityTraits);
    this.ideals.set(s.ideals);
    this.bonds.set(s.bonds);
    this.flaws.set(s.flaws);
    this.featName.set(s.featName);
    this.featDescription.set(s.featDescription);
    this.languagesKnown.set(s.languagesKnown);
    this.toolProficiencies.set(s.toolProficiencies);
    this.otherProficiencies.set(s.otherProficiencies);
    this.backstory.set(s.backstory);
    this.alliesOrganizations.set(s.alliesOrganizations);
    this.additionalFeatures.set(s.additionalFeatures);
    this.treasure.set(s.treasure);
    this.notes.set(s.notes);
    this.snapshot.set(s);
  }

  // ── Finalise ──────────────────────────────────────────────────────────────

  finalise(): void {
    const hitDieSize = getHitDieSizeFromClass(this.characterClass());
    const hitDiceStr = this.hitDiceOverride() ||
      `${this.characterLevel()}d${hitDieSize}`;

    this.snapshot.set({
      characterName:   this.characterName(),
      playerName:      this.playerName(),
      characterLevel:  this.characterLevel(),
      experiencePoints: this.experiencePoints(),
      background:      this.background(),
      species:         this.species(),
      characterClass:  this.characterClass(),
      subclass:        this.subclass(),
      strength:        this.strength(),
      dexterity:       this.dexterity(),
      constitution:    this.constitution(),
      intelligence:    this.intelligence(),
      wisdom:          this.wisdom(),
      charisma:        this.charisma(),
      strengthMod:     this.strengthMod(),
      dexMod:          this.dexMod(),
      conMod:          this.conMod(),
      intMod:          this.intMod(),
      wisMod:          this.wisMod(),
      chaMod:          this.chaMod(),
      proficiencyBonus: this.proficiencyBonus(),
      abilityScoreMethod: this.abilityScoreMethod(),
      skillProficiencies:       { ...this.skillProficiencies() },
      skillExpertise:           { ...this.skillExpertise() },
      savingThrowProficiencies: { ...this.savingThrowProficiencies() },
      armorClass:       this.armorClass(),
      initiative:       this.initiative(),
      speed:            this.speed(),
      maxHitPoints:     this.maxHitPoints(),
      hitDice:          hitDiceStr,
      deathSaveSuccesses: this.deathSaveSuccesses(),
      deathSaveFailures:  this.deathSaveFailures(),
      gold:     this.gold(),
      silver:   this.silver(),
      copper:   this.copper(),
      electrum: this.electrum(),
      platinum: this.platinum(),
      armorName: this.armorName(),
      armorType: this.armorType(),
      weapons:   this.weapons().map(w => ({ ...w })),
      equipment: this.equipment(),
      spellcastingClass:   this.spellcastingClass(),
      spellcastingAbility: this.spellcastingAbility(),
      spellSaveDC:         this.spellSaveDC(),
      spellAttackBonus:    this.spellAttackBonus(),
      spellSlots:          { ...this.spellSlots() },
      cantrips: this.cantrips(),
      spells1:  this.spells1(),
      spells2:  this.spells2(),
      spells3:  this.spells3(),
      spells4:  this.spells4(),
      spells5:  this.spells5(),
      personalityTraits:  this.personalityTraits(),
      ideals:             this.ideals(),
      bonds:              this.bonds(),
      flaws:              this.flaws(),
      featName:           this.featName(),
      featDescription:    this.featDescription(),
      languagesKnown:     this.languagesKnown(),
      toolProficiencies:  this.toolProficiencies(),
      otherProficiencies: this.otherProficiencies(),
      backstory:           this.backstory(),
      alliesOrganizations: this.alliesOrganizations(),
      additionalFeatures:  this.additionalFeatures(),
      treasure:            this.treasure(),
      notes:               this.notes(),
    });
  }
}
