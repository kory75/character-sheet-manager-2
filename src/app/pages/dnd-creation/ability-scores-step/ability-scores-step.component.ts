import { Component, computed, input, output, signal, effect } from '@angular/core';
import {
  calcAbilityModifier,
  STANDARD_ARRAY,
  POINT_BUY_POOL,
  getPointBuyCost,
  calcPointBuyTotal,
} from '../../../games/dnd-5e-2024/creation-rules';

interface AbilityDef {
  id: string;
  key: 'strength' | 'dexterity' | 'constitution' | 'intelligence' | 'wisdom' | 'charisma';
  abbr: string;
  label: string;
}

const ABILITY_DEFS: AbilityDef[] = [
  { id: 'strength',     key: 'strength',     abbr: 'STR', label: 'Strength'     },
  { id: 'dexterity',    key: 'dexterity',    abbr: 'DEX', label: 'Dexterity'    },
  { id: 'constitution', key: 'constitution', abbr: 'CON', label: 'Constitution' },
  { id: 'intelligence', key: 'intelligence', abbr: 'INT', label: 'Intelligence' },
  { id: 'wisdom',       key: 'wisdom',       abbr: 'WIS', label: 'Wisdom'       },
  { id: 'charisma',     key: 'charisma',     abbr: 'CHA', label: 'Charisma'     },
];

type AbilityScoreMethod = 'roll' | 'standard-array' | 'point-buy';

@Component({
  selector: 'app-dnd-ability-scores-step',
  template: `
    <!-- Section header -->
    <div class="mb-6">
      <h2 class="font-headline text-xl font-bold uppercase tracking-widest dnd-gold-bar mb-2"
          style="color: #e6c364;">Establish the Essence</h2>
      <p class="font-body text-sm italic" style="color: #99907e;">
        "The gods have allotted you your gifts."
      </p>
    </div>

    <div class="dnd-divider mb-6"></div>

    <!-- Mode toggle -->
    <div class="flex justify-center mb-8">
      <div class="flex p-1" style="background: #2f3541; border: 1px solid #4d4637;">
        @for (mode of modes; track mode.id) {
          <button
            class="px-6 py-2 font-headline text-xs uppercase tracking-widest transition-colors"
            style="border-radius: 0;"
            [style.background]="abilityScoreMethod() === mode.id ? '#e6c364' : 'transparent'"
            [style.color]="abilityScoreMethod() === mode.id ? '#3d2e00' : '#d1c5b2'"
            [style.font-weight]="abilityScoreMethod() === mode.id ? '700' : '400'"
            (click)="methodChanged.emit(mode.id)"
          >{{ mode.label }}</button>
        }
      </div>
    </div>

    <!-- ══ ROLL MODE ══ -->
    @if (abilityScoreMethod() === 'roll') {
      <div class="grid grid-cols-2 md:grid-cols-3 gap-6 mb-6">
        @for (def of abilityDefs; track def.id) {
          <div class="dnd-stat-box p-6 relative"
               [class.stat-glow]="getScore(def.key) > 0 && rollingAbilityKey() !== def.id"
               [class.stat-rolling]="rollingAbilityKey() === def.id"
               style="border-radius: 0;">
            <div class="flex justify-between items-start mb-4">
              <span class="font-headline text-[10px] uppercase tracking-[0.2em]" style="color: #d0c5b2;">
                {{ def.label }}
              </span>
              <button
                class="transition-colors hover:text-primary"
                style="color: rgba(230,195,100,0.5); border-radius: 0;"
                title="Roll 4d6 drop lowest"
                (click)="rollOne(def.key)"
              >
                <span class="material-symbols-outlined text-lg"
                      [class.dice-spin]="rollingAbilityKey() === def.id">casino</span>
              </button>
            </div>
            <div class="flex items-baseline gap-3">
              <span class="font-headline font-bold" style="font-size: 3rem; color: #dde2f2;">
                {{ getScore(def.key) > 0 ? getScore(def.key) : '—' }}
              </span>
              @if (getScore(def.key) > 0) {
                <span class="font-headline text-xl font-bold"
                      [style.color]="getMod(def.key) >= 0 ? '#e6c364' : '#ffb4ab'">
                  ({{ formatMod(getMod(def.key)) }})
                </span>
              }
            </div>
          </div>
        }
      </div>

      <!-- Auto-roll all -->
      <div class="flex justify-center mb-6">
        <button
          class="font-headline font-bold uppercase px-8 py-3 text-sm flex items-center gap-2 transition-all hover:brightness-110"
          style="background: #1a202b; color: #e6c364; border: 1px solid #e6c364; border-radius: 0;"
          (click)="rollAll()"
        >
          <span class="material-symbols-outlined text-base">casino</span>
          <span>Roll All Scores</span>
        </button>
      </div>
    }

    <!-- ══ STANDARD ARRAY MODE ══ -->
    @if (abilityScoreMethod() === 'standard-array') {
      <div class="mb-4 p-3" style="background: #1a202b; border: 1px solid #4d4637;">
        <p class="font-headline text-xs uppercase tracking-widest" style="color: #d0c5b2;">
          Standard Array: assign each value to one ability.
        </p>
        <div class="flex gap-2 mt-2">
          @for (val of standardArray; track val) {
            <span class="font-headline text-sm font-bold px-2 py-1"
                  style="background: #2f3541; color: #e6c364; border: 1px solid #4d4637;">{{ val }}</span>
          }
        </div>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        @for (def of abilityDefs; track def.id) {
          <div class="dnd-stat-box p-4" style="border-radius: 0;">
            <p class="font-headline text-[10px] uppercase tracking-[0.2em] mb-3" style="color: #d0c5b2;">
              {{ def.label }}
            </p>
            <select
              class="w-full font-headline text-base outline-none px-3 py-2 appearance-none"
              style="background: #1a202b; color: #dde2f2; border: 1px solid #4d4637; border-radius: 0;"
              [value]="getScore(def.key) > 0 ? getScore(def.key) : ''"
              (change)="onStandardArraySelect(def.key, $event)"
            >
              <option value="" style="background: #1a202b;">— Pick —</option>
              @for (val of availableStandardValues(def.key); track val) {
                <option [value]="val" style="background: #1a202b;">{{ val }}</option>
              }
            </select>
            @if (getScore(def.key) > 0) {
              <div class="mt-2">
                <span class="font-headline text-[10px] uppercase" style="color: #99907e;">
                  Mod: {{ formatMod(getMod(def.key)) }}
                </span>
              </div>
            }
          </div>
        }
      </div>
    }

    <!-- ══ POINT BUY MODE ══ -->
    @if (abilityScoreMethod() === 'point-buy') {
      <!-- Points remaining banner -->
      <div class="p-4 mb-6 flex items-center justify-between"
           style="background: #1a202b; border: 1px solid #e6c364;">
        <span class="font-headline text-sm uppercase tracking-widest" style="color: #d0c5b2;">
          Points Remaining
        </span>
        <span class="font-headline text-2xl font-bold"
              [style.color]="pointsRemaining() < 0 ? '#ffb4ab' : '#e6c364'">
          {{ pointsRemaining() }}
        </span>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        @for (def of abilityDefs; track def.id) {
          <div class="dnd-stat-box p-4" style="border-radius: 0;">
            <p class="font-headline text-[10px] uppercase tracking-[0.2em] mb-3" style="color: #d0c5b2;">
              {{ def.label }}
            </p>
            <div class="flex items-center gap-2">
              <button
                class="w-7 h-7 flex items-center justify-center font-black transition-colors"
                style="background: #1a202b; color: #99907e; border: 1px solid #4d4637; border-radius: 0;"
                [style.opacity]="getScore(def.key) <= 8 ? '0.3' : '1'"
                (click)="onPointBuyDecrement(def.key)"
              >−</button>
              <span class="font-headline text-2xl font-bold flex-1 text-center"
                    style="color: #dde2f2;">{{ getScore(def.key) }}</span>
              <button
                class="w-7 h-7 flex items-center justify-center font-black transition-colors"
                style="background: #1a202b; color: #99907e; border: 1px solid #4d4637; border-radius: 0;"
                [style.opacity]="getScore(def.key) >= 15 || pointsRemaining() <= 0 ? '0.3' : '1'"
                (click)="onPointBuyIncrement(def.key)"
              >+</button>
            </div>
            <div class="flex justify-between mt-2">
              <span class="font-headline text-[10px] uppercase" style="color: #99907e;">
                Cost: {{ getPointBuyCostForScore(def.key) }}
              </span>
              <span class="font-headline text-[10px] uppercase"
                    [style.color]="getMod(def.key) >= 0 ? '#e6c364' : '#ffb4ab'">
                {{ formatMod(getMod(def.key)) }}
              </span>
            </div>
          </div>
        }
      </div>
    }

    <!-- Proficiency bonus display -->
    <div class="flex justify-end">
      <div class="flex items-center gap-4 px-6 py-4"
           style="background: #242a36; border: 1px solid #4d4637;">
        <span class="font-headline text-xs uppercase tracking-widest" style="color: #d1c5b2;">
          Proficiency Bonus
        </span>
        <div style="width: 1px; height: 40px; background: #4d4637;"></div>
        <span class="font-headline text-2xl font-bold" style="color: #e6c364;">
          {{ formatMod(proficiencyBonus()) }}
        </span>
      </div>
    </div>
  `,
  styles: [`
    .stat-glow    { box-shadow: 0 0 20px rgba(230,195,100,0.15); }
    .stat-rolling { box-shadow: 0 0 30px rgba(230,195,100,0.5); border-left-color: #e6c364 !important; }
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
export class DndAbilityScoresStepComponent {
  readonly rollingAbilityKey = input<string | null>(null);

  readonly strength     = input<number>(10);
  readonly dexterity    = input<number>(10);
  readonly constitution = input<number>(10);
  readonly intelligence = input<number>(10);
  readonly wisdom       = input<number>(10);
  readonly charisma     = input<number>(10);
  readonly abilityScoreMethod  = input<'roll' | 'standard-array' | 'point-buy'>('roll');
  readonly proficiencyBonus    = input<number>(2);

  readonly strengthChanged     = output<number>();
  readonly dexterityChanged    = output<number>();
  readonly constitutionChanged = output<number>();
  readonly intelligenceChanged = output<number>();
  readonly wisdomChanged       = output<number>();
  readonly charismaChanged     = output<number>();
  readonly methodChanged       = output<'roll' | 'standard-array' | 'point-buy'>();

  readonly abilityDefs = ABILITY_DEFS;
  readonly standardArray = [...STANDARD_ARRAY];

  readonly modes = [
    { id: 'standard-array' as const, label: 'Standard Array' },
    { id: 'point-buy'      as const, label: 'Point Buy'      },
    { id: 'roll'           as const, label: 'Roll'           },
  ];

  getScore(key: AbilityDef['key']): number {
    switch (key) {
      case 'strength':     return this.strength();
      case 'dexterity':    return this.dexterity();
      case 'constitution': return this.constitution();
      case 'intelligence': return this.intelligence();
      case 'wisdom':       return this.wisdom();
      case 'charisma':     return this.charisma();
    }
  }

  getMod(key: AbilityDef['key']): number {
    return calcAbilityModifier(this.getScore(key));
  }

  formatMod(mod: number): string {
    return mod >= 0 ? `+${mod}` : `${mod}`;
  }

  getPointBuyCostForScore(key: AbilityDef['key']): number {
    return getPointBuyCost(this.getScore(key));
  }

  readonly pointsRemaining = computed(() => {
    const scores = [
      this.strength(), this.dexterity(), this.constitution(),
      this.intelligence(), this.wisdom(), this.charisma(),
    ];
    return POINT_BUY_POOL - calcPointBuyTotal(scores);
  });

  private emit(key: AbilityDef['key'], value: number): void {
    switch (key) {
      case 'strength':     this.strengthChanged.emit(value);     break;
      case 'dexterity':    this.dexterityChanged.emit(value);    break;
      case 'constitution': this.constitutionChanged.emit(value); break;
      case 'intelligence': this.intelligenceChanged.emit(value); break;
      case 'wisdom':       this.wisdomChanged.emit(value);       break;
      case 'charisma':     this.charismaChanged.emit(value);     break;
    }
  }

  // 4d6 drop lowest
  private roll4d6DropLowest(): number {
    const rolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1);
    rolls.sort((a, b) => a - b);
    return rolls[1] + rolls[2] + rolls[3];
  }

  rollOne(key: AbilityDef['key']): void {
    this.emit(key, this.roll4d6DropLowest());
  }

  rollAll(): void {
    for (const def of this.abilityDefs) {
      this.emit(def.key, this.roll4d6DropLowest());
    }
  }

  // Standard array helpers
  availableStandardValues(forKey: AbilityDef['key']): number[] {
    const current = this.getScore(forKey);
    const usedByOthers = this.abilityDefs
      .filter(d => d.key !== forKey)
      .map(d => this.getScore(d.key))
      .filter(s => s > 0);

    const remaining = [...this.standardArray];
    for (const used of usedByOthers) {
      const idx = remaining.indexOf(used);
      if (idx !== -1) remaining.splice(idx, 1);
    }

    // Always include the currently-selected value so the dropdown doesn't break
    if (current > 0 && !remaining.includes(current)) {
      remaining.push(current);
    }

    return remaining.sort((a, b) => b - a);
  }

  onStandardArraySelect(key: AbilityDef['key'], event: Event): void {
    const val = parseInt((event.target as HTMLSelectElement).value, 10);
    if (!isNaN(val)) this.emit(key, val);
  }

  // Point buy helpers
  onPointBuyIncrement(key: AbilityDef['key']): void {
    const current = this.getScore(key);
    if (current >= 15) return;
    const nextCost = getPointBuyCost(current + 1) - getPointBuyCost(current);
    if (this.pointsRemaining() < nextCost) return;
    this.emit(key, current + 1);
  }

  onPointBuyDecrement(key: AbilityDef['key']): void {
    const current = this.getScore(key);
    if (current <= 8) return;
    this.emit(key, current - 1);
  }
}
