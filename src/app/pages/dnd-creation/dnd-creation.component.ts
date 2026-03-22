import { Component, computed, inject, signal, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { DndDraftService } from '../../services/dnd-draft.service';
import { DndIdentityStepComponent } from './identity-step/identity-step.component';
import { DndSpeciesStepComponent } from './species-step/species-step.component';
import { DndClassStepComponent } from './class-step/class-step.component';
import { DndAbilityScoresStepComponent } from './ability-scores-step/ability-scores-step.component';
import { DndSkillsStepComponent } from './skills-step/skills-step.component';
import { DndCombatStepComponent } from './combat-step/combat-step.component';
import { DndEquipmentStepComponent } from './equipment-step/equipment-step.component';
import { DndSpellcastingStepComponent } from './spellcasting-step/spellcasting-step.component';
import { DndBackgroundStepComponent } from './background-step/background-step.component';
import { DndNotesStepComponent } from './notes-step/notes-step.component';
import { getHitDieSizeFromClass } from '../../games/dnd-5e-2024/creation-rules';
import { CharacterStorageService } from '../../services/character-storage.service';

interface WizardStep { label: string; subtitle: string; }

const WIZARD_STEPS: WizardStep[] = [
  { label: 'IDENTITY',       subtitle: 'FORGING YOUR LEGEND'     },
  { label: 'SPECIES',        subtitle: 'CHOOSING YOUR HERITAGE'  },
  { label: 'CLASS',          subtitle: 'EMBRACING YOUR CALLING'  },
  { label: 'ABILITY SCORES', subtitle: 'ESTABLISHING THE ESSENCE'},
  { label: 'SKILLS',         subtitle: 'HONING YOUR TALENTS'     },
  { label: 'COMBAT',         subtitle: 'PREPARING FOR BATTLE'    },
  { label: 'EQUIPMENT',      subtitle: 'GATHERING YOUR GEAR'     },
  { label: 'SPELLCASTING',   subtitle: 'WEAVING THE ARCANE'      },
  { label: 'BACKGROUND',     subtitle: 'SHAPING YOUR HISTORY'    },
  { label: 'NOTES',          subtitle: 'CHRONICLING YOUR TALE'   },
];

const ROMAN_NUMERALS = ['I','II','III','IV','V','VI','VII','VIII','IX','X'];

// Quick auto-roll helper
function roll4d6DropLowest(): number {
  const rolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1);
  rolls.sort((a, b) => a - b);
  return rolls[1] + rolls[2] + rolls[3];
}

const DND_FIRST_NAMES = [
  'Aelindra', 'Alaric', 'Brynn', 'Caelum', 'Dara', 'Eris', 'Faela',
  'Gareth', 'Haelith', 'Idris', 'Joran', 'Kyra', 'Lira', 'Marek',
  'Nerys', 'Oryn', 'Petra', 'Quinn', 'Riven', 'Sorin', 'Tara',
  'Urien', 'Vale', 'Wren', 'Xael', 'Yrsa', 'Zephyr',
];
const DND_BACKGROUNDS = [
  'Acolyte','Artisan','Charlatan','Criminal','Entertainer',
  'Farmer','Guard','Guide','Hermit','Merchant',
  'Noble','Sailor','Scribe','Soldier','Wayfarer',
];
const DND_SPECIES = [
  'aasimar','dragonborn','dwarf','elf','gnome',
  'goliath','halfling','human','orc','tiefling',
];
const DND_CLASSES = [
  'artificer','barbarian','bard','cleric','druid','fighter',
  'monk','paladin','ranger','rogue','sorcerer','warlock','wizard',
];

@Component({
  selector: 'app-dnd-creation',
  imports: [
    DndIdentityStepComponent,
    DndSpeciesStepComponent,
    DndClassStepComponent,
    DndAbilityScoresStepComponent,
    DndSkillsStepComponent,
    DndCombatStepComponent,
    DndEquipmentStepComponent,
    DndSpellcastingStepComponent,
    DndBackgroundStepComponent,
    DndNotesStepComponent,
  ],
  template: `
  <div class="theme-dnd5e min-h-screen" style="background: #0d131e;">

    <!-- ══ DRAGON WATERMARK ══ -->
    <div class="fixed bottom-[5%] right-[-5%] w-[500px] h-[500px] pointer-events-none z-0"
         style="opacity: 0.025;" aria-hidden="true">
      <svg viewBox="0 0 100 100" fill="#e6c364" xmlns="http://www.w3.org/2000/svg">
        <text x="10" y="80" style="font-size: 80px;">🐉</text>
      </svg>
    </div>

    <div class="relative z-10 max-w-4xl mx-auto px-6 py-10 pb-40">

      <!-- ══ HERO HEADER ══ -->
      <div class="mb-10 text-center">
        <div class="flex items-center justify-center gap-3 mb-4">
          <span class="h-px w-16 block" style="background: linear-gradient(to right, transparent, #e6c364);"></span>
          <span class="material-symbols-outlined text-2xl" style="color: #e6c364;">swords</span>
          <span class="h-px w-16 block" style="background: linear-gradient(to left, transparent, #e6c364);"></span>
        </div>
        <h1 class="font-headline text-4xl font-bold uppercase tracking-widest mb-1"
            style="color: #e6c364;">The Relic Ledger</h1>
        <p class="font-headline text-[10px] uppercase tracking-[0.4em]"
           style="color: #99907e;">Character Creator // D&amp;D 5th Edition 2024</p>
      </div>

      <!-- ══ DIAMOND STEP INDICATOR ══ -->
      <div class="mb-8">
        <div class="flex items-center justify-center py-4">
          @for (step of steps; track step.label; let i = $index) {
            <!-- Connector line before each step except the first -->
            @if (i > 0) {
              <div class="h-px w-6"
                   [style.background]="i <= currentStep() ? '#e6c364' : '#4d4637'"></div>
            }
            <!-- Diamond node -->
            <button
              class="relative flex items-center justify-center transition-all"
              style="width: 18px; height: 18px;"
              [title]="step.label"
              (click)="goToStep(i)"
            >
              <div
                class="rotate-45 transition-all"
                [style.width]="i === currentStep() ? '14px' : '10px'"
                [style.height]="i === currentStep() ? '14px' : '10px'"
                [style.background]="i < currentStep() ? '#e6c364' : (i === currentStep() ? '#e6c364' : '#4d4637')"
                [style.box-shadow]="i === currentStep() ? '0 0 10px rgba(230,195,100,0.6)' : 'none'"
              ></div>
            </button>
          }
        </div>
        <p class="text-center font-headline text-[10px] tracking-[0.3em] uppercase"
           style="color: #99907e;">
          Step {{ romanNumeral(currentStep() + 1) }}: {{ currentStepSubtitle() }}
        </p>
      </div>

      <!-- ══ AUTO-ROLL BUTTON ══ -->
      <div class="flex gap-3 mb-10">
        <button
          class="flex-1 h-16 flex items-center justify-center gap-3 font-headline font-bold uppercase tracking-[0.1em] text-xl transition-all hover:brightness-110 active:scale-[0.99]"
          style="background: linear-gradient(45deg, #e6c364, #c9a84c); color: #3d2e00; border-radius: 0;"
          [disabled]="isAutoRolling()"
          (click)="startAutoRoll()"
        >
          <span class="material-symbols-outlined text-2xl"
                [class.dice-spin]="isAutoRolling()">casino</span>
          <span>{{ isAutoRolling() ? 'ROLLING...' : 'Auto-Roll Character' }}</span>
        </button>
        @if (isAutoRolling()) {
          <button
            class="h-16 px-6 font-headline font-bold text-xs uppercase tracking-widest transition-all hover:brightness-110"
            style="border: 1px solid #e6c364; color: #e6c364; border-radius: 0; background: transparent;"
            (click)="skipAutoRoll()"
          >SKIP</button>
        }
      </div>

      <!-- ══ STEP CONTENT ══ -->
      <div class="mb-8" style="background: #161c27; border-left: 2px solid #e6c364; position: relative;">
        <!-- Corner flourishes -->
        <div class="dnd-flourish-tl"></div>
        <div class="dnd-flourish-tr"></div>
        <div class="dnd-flourish-bl"></div>
        <div class="dnd-flourish-br"></div>

        <div class="p-10">
          @switch (currentStep()) {
            @case (0) {
              <app-dnd-identity-step
                [characterName]="draft.characterName()"
                [playerName]="draft.playerName()"
                [characterLevel]="draft.characterLevel()"
                [experiencePoints]="draft.experiencePoints()"
                [background]="draft.background()"
                (characterNameChanged)="draft.characterName.set($event)"
                (playerNameChanged)="draft.playerName.set($event)"
                (characterLevelChanged)="draft.characterLevel.set($event)"
                (experiencePointsChanged)="draft.experiencePoints.set($event)"
                (backgroundChanged)="draft.background.set($event)"
              />
            }
            @case (1) {
              <app-dnd-species-step
                [species]="draft.species()"
                (speciesChanged)="draft.species.set($event)"
              />
            }
            @case (2) {
              <app-dnd-class-step
                [characterClass]="draft.characterClass()"
                [subclass]="draft.subclass()"
                [characterLevel]="draft.characterLevel()"
                (classChanged)="draft.characterClass.set($event)"
                (subclassChanged)="draft.subclass.set($event)"
              />
            }
            @case (3) {
              <app-dnd-ability-scores-step
                [strength]="draft.strength()"
                [dexterity]="draft.dexterity()"
                [constitution]="draft.constitution()"
                [intelligence]="draft.intelligence()"
                [wisdom]="draft.wisdom()"
                [charisma]="draft.charisma()"
                [abilityScoreMethod]="draft.abilityScoreMethod()"
                [proficiencyBonus]="draft.proficiencyBonus()"
                [rollingAbilityKey]="rollingAbilityKey()"
                (strengthChanged)="draft.strength.set($event)"
                (dexterityChanged)="draft.dexterity.set($event)"
                (constitutionChanged)="draft.constitution.set($event)"
                (intelligenceChanged)="draft.intelligence.set($event)"
                (wisdomChanged)="draft.wisdom.set($event)"
                (charismaChanged)="draft.charisma.set($event)"
                (methodChanged)="draft.abilityScoreMethod.set($event)"
              />
            }
            @case (4) {
              <app-dnd-skills-step
                [strength]="draft.strength()"
                [dexterity]="draft.dexterity()"
                [constitution]="draft.constitution()"
                [intelligence]="draft.intelligence()"
                [wisdom]="draft.wisdom()"
                [charisma]="draft.charisma()"
                [proficiencyBonus]="draft.proficiencyBonus()"
                [skillProficiencies]="draft.skillProficiencies()"
                [skillExpertise]="draft.skillExpertise()"
                [savingThrowProficiencies]="draft.savingThrowProficiencies()"
                (skillProficienciesChanged)="draft.skillProficiencies.set($event)"
                (skillExpertiseChanged)="draft.skillExpertise.set($event)"
                (savingThrowProficienciesChanged)="draft.savingThrowProficiencies.set($event)"
              />
            }
            @case (5) {
              <app-dnd-combat-step
                [armorClass]="draft.armorClass()"
                [initiative]="draft.initiative()"
                [speed]="draft.speed()"
                [maxHitPoints]="draft.maxHitPoints()"
                [hitDice]="computedHitDice()"
                [hitDiceOverride]="draft.hitDiceOverride()"
                [deathSaveSuccesses]="draft.deathSaveSuccesses()"
                [deathSaveFailures]="draft.deathSaveFailures()"
                (armorClassChanged)="draft.armorClass.set($event)"
                (speedChanged)="draft.speed.set($event)"
                (hitDiceOverrideChanged)="draft.hitDiceOverride.set($event)"
                (deathSaveSuccessesChanged)="draft.deathSaveSuccesses.set($event)"
                (deathSaveFailuresChanged)="draft.deathSaveFailures.set($event)"
              />
            }
            @case (6) {
              <app-dnd-equipment-step
                [gold]="draft.gold()"
                [silver]="draft.silver()"
                [copper]="draft.copper()"
                [electrum]="draft.electrum()"
                [platinum]="draft.platinum()"
                [armorName]="draft.armorName()"
                [armorType]="draft.armorType()"
                [weapons]="draft.weapons()"
                [equipment]="draft.equipment()"
                (goldChanged)="draft.gold.set($event)"
                (silverChanged)="draft.silver.set($event)"
                (copperChanged)="draft.copper.set($event)"
                (electrumChanged)="draft.electrum.set($event)"
                (platinumChanged)="draft.platinum.set($event)"
                (armorNameChanged)="draft.armorName.set($event)"
                (armorTypeChanged)="draft.armorType.set($event)"
                (weaponsChanged)="draft.weapons.set($event)"
                (equipmentChanged)="draft.equipment.set($event)"
              />
            }
            @case (7) {
              <app-dnd-spellcasting-step
                [characterClass]="draft.characterClass()"
                [spellcastingClass]="draft.spellcastingClass()"
                [spellcastingAbility]="draft.spellcastingAbility()"
                [spellSaveDC]="draft.spellSaveDC()"
                [spellAttackBonus]="draft.spellAttackBonus()"
                [spellSlots]="draft.spellSlots()"
                [cantrips]="draft.cantrips()"
                [spells1]="draft.spells1()"
                [spells2]="draft.spells2()"
                [spells3]="draft.spells3()"
                [spells4]="draft.spells4()"
                [spells5]="draft.spells5()"
                (spellcastingClassChanged)="draft.spellcastingClass.set($event)"
                (spellcastingAbilityChanged)="draft.spellcastingAbility.set($event)"
                (spellSlotsChanged)="draft.spellSlots.set($event)"
                (cantripsChanged)="draft.cantrips.set($event)"
                (spells1Changed)="draft.spells1.set($event)"
                (spells2Changed)="draft.spells2.set($event)"
                (spells3Changed)="draft.spells3.set($event)"
                (spells4Changed)="draft.spells4.set($event)"
                (spells5Changed)="draft.spells5.set($event)"
              />
            }
            @case (8) {
              <app-dnd-background-step
                [personalityTraits]="draft.personalityTraits()"
                [ideals]="draft.ideals()"
                [bonds]="draft.bonds()"
                [flaws]="draft.flaws()"
                [featName]="draft.featName()"
                [featDescription]="draft.featDescription()"
                [languagesKnown]="draft.languagesKnown()"
                [toolProficiencies]="draft.toolProficiencies()"
                [otherProficiencies]="draft.otherProficiencies()"
                (personalityTraitsChanged)="draft.personalityTraits.set($event)"
                (idealsChanged)="draft.ideals.set($event)"
                (bondsChanged)="draft.bonds.set($event)"
                (flawsChanged)="draft.flaws.set($event)"
                (featNameChanged)="draft.featName.set($event)"
                (featDescriptionChanged)="draft.featDescription.set($event)"
                (languagesKnownChanged)="draft.languagesKnown.set($event)"
                (toolProficienciesChanged)="draft.toolProficiencies.set($event)"
                (otherProficienciesChanged)="draft.otherProficiencies.set($event)"
              />
            }
            @case (9) {
              <app-dnd-notes-step
                [backstory]="draft.backstory()"
                [alliesOrganizations]="draft.alliesOrganizations()"
                [additionalFeatures]="draft.additionalFeatures()"
                [treasure]="draft.treasure()"
                [notes]="draft.notes()"
                (backstoryChanged)="draft.backstory.set($event)"
                (alliesOrganizationsChanged)="draft.alliesOrganizations.set($event)"
                (additionalFeaturesChanged)="draft.additionalFeatures.set($event)"
                (treasureChanged)="draft.treasure.set($event)"
                (notesChanged)="draft.notes.set($event)"
              />
            }
          }
        </div>
      </div>

    </div>

    <!-- ══ BOTTOM NAV BAR ══ -->
    <div class="fixed bottom-0 left-0 md:left-64 right-0 z-40">
      <div class="flex items-center justify-between px-8 h-16"
           style="background: #161c27; border-top: 2px solid #e6c364;">

        <!-- Progress info -->
        <div class="flex items-center gap-4 flex-1 max-w-md">
          <span class="font-headline text-[10px] font-bold uppercase tracking-widest whitespace-nowrap"
                style="color: #e6c364;">
            STEP {{ currentStep() + 1 }}: {{ currentStepLabel() }}
          </span>
          <div class="flex-1 h-1" style="background: #1a202b;">
            <div class="h-full transition-all duration-300"
                 style="background: #e6c364;"
                 [style.width]="progressPercent() + '%'"></div>
          </div>
          <span class="font-headline text-[10px] uppercase whitespace-nowrap"
                style="color: #4d4637;">{{ progressPercent() }}%</span>
        </div>

        <!-- Navigation buttons -->
        <div class="flex items-center gap-3 ml-8">
          @if (currentStep() > 0) {
            <button
              class="font-headline font-bold text-[10px] px-5 py-2 uppercase tracking-widest transition-all hover:brightness-110"
              style="border: 1px solid #4d4637; color: #99907e; border-radius: 0;"
              (click)="prevStep()"
            >← PREV</button>
          }
          <button
            class="font-headline font-bold text-[10px] px-6 py-2 uppercase tracking-widest transition-all hover:brightness-110 active:scale-95"
            style="background: linear-gradient(45deg, #e6c364, #c9a84c); color: #3d2e00; border-radius: 0;"
            (click)="isLastStep() ? finalise() : nextStep()"
          >{{ isLastStep() ? 'FINALISE CHARACTER' : 'CONTINUE →' }}</button>
        </div>

      </div>
    </div>

  </div>
  `,
  styles: [`
    @keyframes dice-spin {
      0%   { transform: rotate(0deg)   scale(1);   }
      25%  { transform: rotate(90deg)  scale(1.1); }
      50%  { transform: rotate(180deg) scale(1);   }
      75%  { transform: rotate(270deg) scale(1.1); }
      100% { transform: rotate(360deg) scale(1);   }
    }
    .dice-spin { animation: dice-spin 350ms ease-in-out infinite; }
  `],
})
export class DndCreationComponent {
  readonly draft    = inject(DndDraftService);
  private _router   = inject(Router);
  private _zone     = inject(NgZone);
  private _storage  = inject(CharacterStorageService);

  readonly steps           = WIZARD_STEPS;
  readonly currentStep     = signal(0);
  readonly isLastStep      = computed(() => this.currentStep() === this.steps.length - 1);
  readonly progressPercent = computed(() =>
    Math.round((this.currentStep() / (this.steps.length - 1)) * 100)
  );
  readonly currentStepLabel    = computed(() => this.steps[this.currentStep()].label);
  readonly currentStepSubtitle = computed(() => this.steps[this.currentStep()].subtitle);

  readonly isAutoRolling    = signal(false);
  readonly rollingAbilityKey = signal<string | null>(null);

  private _skipRequested = false;

  readonly computedHitDice = computed(() => {
    const cls   = this.draft.characterClass();
    const level = this.draft.characterLevel();
    if (!cls) return `${level}d8`;
    const die = getHitDieSizeFromClass(cls);
    return `${level}d${die}`;
  });

  romanNumeral(n: number): string {
    return ROMAN_NUMERALS[n - 1] ?? String(n);
  }

  goToStep(i: number): void {
    if (!this.isAutoRolling()) this.currentStep.set(i);
  }

  nextStep(): void {
    if (!this.isLastStep()) this.currentStep.update(i => i + 1);
  }

  prevStep(): void {
    if (this.currentStep() > 0) this.currentStep.update(i => i - 1);
  }

  finalise(): void {
    this.draft.finalise();
    const snap = this.draft.snapshot()!;
    const saveData = {
      system: 'dnd-5e-2024' as const,
      name: snap.characterName || 'Unnamed Adventurer',
      statLine: snap.characterClass
        ? `LEVEL ${snap.characterLevel} ${snap.species.toUpperCase()} ${snap.characterClass.toUpperCase()}`
        : `LEVEL ${snap.characterLevel}`,
      snapshot: snap,
    };
    const editingId = this._storage.editingId();
    if (editingId) {
      this._storage.update(editingId, saveData);
      this._storage.editingId.set(null);
    } else {
      this._storage.save(saveData);
    }
    this._router.navigate(['/dnd-sheet']);
  }

  startAutoRoll(): void {
    if (this.isAutoRolling()) return;
    this._skipRequested = false;
    this._zone.runOutsideAngular(() => this._runAutoRoll());
  }

  skipAutoRoll(): void {
    this._skipRequested = true;
  }

  private async _runAutoRoll(): Promise<void> {
    const run = <T>(fn: () => T) => this._zone.run(fn);
    const wait = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

    run(() => this.isAutoRolling.set(true));

    const randomName = DND_FIRST_NAMES[Math.floor(Math.random() * DND_FIRST_NAMES.length)];
    const randomBg   = DND_BACKGROUNDS[Math.floor(Math.random() * DND_BACKGROUNDS.length)];
    const randomSpec = DND_SPECIES[Math.floor(Math.random() * DND_SPECIES.length)];
    const randomCls  = DND_CLASSES[Math.floor(Math.random() * DND_CLASSES.length)];

    // ── Step 0: Identity ──────────────────────────────────────────────────
    run(() => {
      this.currentStep.set(0);
      this.draft.characterName.set(randomName);
      this.draft.background.set(randomBg);
    });
    if (!this._skipRequested) await wait(900);

    // ── Step 1: Species ───────────────────────────────────────────────────
    run(() => {
      this.currentStep.set(1);
      this.draft.species.set(randomSpec);
    });
    if (!this._skipRequested) await wait(700);

    // ── Step 2: Class ─────────────────────────────────────────────────────
    run(() => {
      this.currentStep.set(2);
      this.draft.characterClass.set(randomCls);
    });
    if (!this._skipRequested) await wait(700);

    // ── Step 3: Ability Scores (animated one-by-one) ──────────────────────
    run(() => {
      this.currentStep.set(3);
      this.draft.abilityScoreMethod.set('roll');
    });
    if (!this._skipRequested) await wait(400);

    const ABILITIES: Array<{ key: string; set: (v: number) => void }> = [
      { key: 'strength',     set: v => this.draft.strength.set(v)     },
      { key: 'dexterity',    set: v => this.draft.dexterity.set(v)    },
      { key: 'constitution', set: v => this.draft.constitution.set(v) },
      { key: 'intelligence', set: v => this.draft.intelligence.set(v) },
      { key: 'wisdom',       set: v => this.draft.wisdom.set(v)       },
      { key: 'charisma',     set: v => this.draft.charisma.set(v)     },
    ];

    for (const ability of ABILITIES) {
      if (this._skipRequested) break;
      run(() => this.rollingAbilityKey.set(ability.key));
      await wait(350);
      run(() => {
        ability.set(roll4d6DropLowest());
        this.rollingAbilityKey.set(null);
      });
      if (!this._skipRequested) await wait(200);
    }

    // If skipped mid-abilities, fill remaining instantly
    run(() => {
      this.rollingAbilityKey.set(null);
      if (!this.draft.strength())     this.draft.strength.set(roll4d6DropLowest());
      if (!this.draft.dexterity())    this.draft.dexterity.set(roll4d6DropLowest());
      if (!this.draft.constitution()) this.draft.constitution.set(roll4d6DropLowest());
      if (!this.draft.intelligence()) this.draft.intelligence.set(roll4d6DropLowest());
      if (!this.draft.wisdom())       this.draft.wisdom.set(roll4d6DropLowest());
      if (!this.draft.charisma())     this.draft.charisma.set(roll4d6DropLowest());
    });

    // ── Step 4: Skills — pick 4 random skills + 2 saves ──────────────────
    run(() => this.currentStep.set(4));
    if (!this._skipRequested) await wait(600);

    const allSkillIds = [
      'athletics','acrobatics','sleightOfHand','stealth',
      'arcana','history','investigation','nature','religion',
      'animalHandling','insight','medicine','perception','survival',
      'deception','intimidation','performance','persuasion',
    ];
    const allSaveIds = ['strength','dexterity','constitution','intelligence','wisdom','charisma'];
    const shuffleAndPick = (arr: string[], n: number) =>
      [...arr].sort(() => Math.random() - 0.5).slice(0, n);

    run(() => {
      const pickedSkills: Record<string, boolean> = {};
      for (const id of shuffleAndPick(allSkillIds, 4)) pickedSkills[id] = true;
      this.draft.skillProficiencies.set(pickedSkills);

      const pickedSaves: Record<string, boolean> = {};
      for (const id of shuffleAndPick(allSaveIds, 2)) pickedSaves[id] = true;
      this.draft.savingThrowProficiencies.set(pickedSaves);
    });
    if (!this._skipRequested) await wait(700);

    // ── Steps 5–9: navigate through each ─────────────────────────────────
    for (let step = 5; step <= 9; step++) {
      if (this._skipRequested) break;
      run(() => this.currentStep.set(step));
      await wait(500);
    }

    run(() => this.isAutoRolling.set(false));
  }
}
