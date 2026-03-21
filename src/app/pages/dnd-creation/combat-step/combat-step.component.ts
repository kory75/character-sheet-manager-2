import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-dnd-combat-step',
  template: `
    <!-- Section header -->
    <div class="mb-6">
      <h2 class="font-headline text-xl font-bold uppercase tracking-widest dnd-gold-bar mb-2"
          style="color: #e6c364;">Prepare for Battle</h2>
      <p class="font-body text-sm italic" style="color: #99907e;">
        "Steel your resolve. Know your defences and the depths of your endurance."
      </p>
    </div>

    <div class="dnd-divider mb-6"></div>

    <!-- Combat stats grid -->
    <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">

      <!-- Armor Class -->
      <div class="dnd-stat-box p-5 text-center" style="border-radius: 0;">
        <p class="font-headline text-[9px] uppercase tracking-widest mb-2" style="color: #99907e;">Armor Class</p>
        <input
          type="text"
          class="w-20 text-center font-headline text-3xl font-bold bg-transparent outline-none"
          style="color: #e6c364; border-bottom: 1px solid #4d4637; border-radius: 0;"
          [value]="armorClass()"
          (input)="armorClassChanged.emit($any($event.target).value)"
        />
      </div>

      <!-- Initiative (calculated, read-only) -->
      <div class="dnd-stat-box p-5 text-center" style="border-radius: 0;">
        <p class="font-headline text-[9px] uppercase tracking-widest mb-2" style="color: #99907e;">Initiative</p>
        <span class="font-headline text-3xl font-bold" style="color: #dde2f2;">
          {{ formatMod(initiative()) }}
        </span>
        <p class="font-headline text-[8px] uppercase mt-1" style="color: #4d4637;">Dex Modifier</p>
      </div>

      <!-- Speed -->
      <div class="dnd-stat-box p-5 text-center" style="border-radius: 0;">
        <p class="font-headline text-[9px] uppercase tracking-widest mb-2" style="color: #99907e;">Speed</p>
        <input
          type="text"
          class="w-24 text-center font-headline text-xl font-bold bg-transparent outline-none"
          style="color: #dde2f2; border-bottom: 1px solid #4d4637; border-radius: 0;"
          [value]="speed()"
          (input)="speedChanged.emit($any($event.target).value)"
        />
      </div>

      <!-- Max HP (calculated) -->
      <div class="dnd-stat-box p-5 text-center col-span-2 md:col-span-1" style="border-radius: 0;">
        <p class="font-headline text-[9px] uppercase tracking-widest mb-2" style="color: #99907e;">Max Hit Points</p>
        <span class="font-headline font-bold" style="font-size: 2.5rem; color: #dde2f2;">
          {{ maxHitPoints() }}
        </span>
        <p class="font-headline text-[8px] uppercase mt-1" style="color: #4d4637;">Calculated</p>
      </div>

      <!-- Hit Dice -->
      <div class="dnd-stat-box p-5 text-center" style="border-radius: 0;">
        <p class="font-headline text-[9px] uppercase tracking-widest mb-2" style="color: #99907e;">Hit Dice</p>
        <span class="font-headline text-2xl font-bold" style="color: #dde2f2;">{{ hitDice() }}</span>
      </div>

      <!-- Hit Dice override -->
      <div class="dnd-stat-box p-5" style="border-radius: 0;">
        <p class="font-headline text-[9px] uppercase tracking-widest mb-2" style="color: #99907e;">Override Hit Dice</p>
        <input
          type="text"
          class="w-full font-body text-sm bg-transparent outline-none"
          style="color: #dde2f2; border-bottom: 1px solid #4d4637; border-radius: 0;"
          placeholder="e.g. 5d8+2d10"
          [value]="hitDiceOverride()"
          (input)="hitDiceOverrideChanged.emit($any($event.target).value)"
        />
        <p class="font-headline text-[8px] uppercase mt-1" style="color: #4d4637;">Optional — leave blank to auto-calculate</p>
      </div>

    </div>

    <!-- Death Saves -->
    <div>
      <h3 class="font-headline text-xs font-bold uppercase tracking-widest dnd-gold-bar mb-4"
          style="color: #e6c364;">Death Saving Throws</h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

        <!-- Successes -->
        <div class="p-4" style="background: #161c27; border: 1px solid #4d4637;">
          <p class="font-headline text-[9px] uppercase tracking-widest mb-3" style="color: #22c55e;">Successes</p>
          <div class="flex items-center gap-3">
            @for (i of [1,2,3]; track i) {
              <button
                class="w-7 h-7 flex items-center justify-center transition-colors"
                style="border-radius: 0;"
                [style.background]="deathSaveSuccesses() >= i ? '#22c55e' : 'transparent'"
                [style.border]="deathSaveSuccesses() >= i ? '1px solid #22c55e' : '1px solid #4d4637'"
                (click)="onSuccessToggle(i)"
              >
                @if (deathSaveSuccesses() >= i) {
                  <span class="material-symbols-outlined text-white" style="font-size: 14px;">check</span>
                }
              </button>
            }
          </div>
        </div>

        <!-- Failures -->
        <div class="p-4" style="background: #161c27; border: 1px solid #4d4637;">
          <p class="font-headline text-[9px] uppercase tracking-widest mb-3" style="color: #ffb4ab;">Failures</p>
          <div class="flex items-center gap-3">
            @for (i of [1,2,3]; track i) {
              <button
                class="w-7 h-7 flex items-center justify-center transition-colors"
                style="border-radius: 0;"
                [style.background]="deathSaveFailures() >= i ? '#c0392b' : 'transparent'"
                [style.border]="deathSaveFailures() >= i ? '1px solid #c0392b' : '1px solid #4d4637'"
                (click)="onFailureToggle(i)"
              >
                @if (deathSaveFailures() >= i) {
                  <span class="material-symbols-outlined text-white" style="font-size: 14px;">close</span>
                }
              </button>
            }
          </div>
        </div>

      </div>
    </div>
  `,
})
export class DndCombatStepComponent {
  readonly armorClass         = input<string>('10');
  readonly initiative         = input<number>(0);
  readonly speed              = input<string>('30 ft.');
  readonly maxHitPoints       = input<number>(8);
  readonly hitDice            = input<string>('1d8');
  readonly hitDiceOverride    = input<string>('');
  readonly deathSaveSuccesses = input<number>(0);
  readonly deathSaveFailures  = input<number>(0);

  readonly armorClassChanged         = output<string>();
  readonly speedChanged              = output<string>();
  readonly hitDiceOverrideChanged    = output<string>();
  readonly deathSaveSuccessesChanged = output<number>();
  readonly deathSaveFailuresChanged  = output<number>();

  formatMod(n: number): string {
    return n >= 0 ? `+${n}` : `${n}`;
  }

  onSuccessToggle(i: number): void {
    const current = this.deathSaveSuccesses();
    this.deathSaveSuccessesChanged.emit(current >= i ? i - 1 : i);
  }

  onFailureToggle(i: number): void {
    const current = this.deathSaveFailures();
    this.deathSaveFailuresChanged.emit(current >= i ? i - 1 : i);
  }
}
