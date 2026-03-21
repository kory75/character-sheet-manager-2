import { Component, input, output } from '@angular/core';

const SPELLCASTING_ABILITIES = ['INT', 'WIS', 'CHA'];
const SPELL_LEVELS = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th'];

// Classes that are not default spellcasters
const NON_SPELLCASTERS = new Set(['barbarian', 'fighter', 'rogue', 'monk']);

@Component({
  selector: 'app-dnd-spellcasting-step',
  template: `
    <!-- Section header -->
    <div class="mb-6">
      <h2 class="font-headline text-xl font-bold uppercase tracking-widest dnd-gold-bar mb-2"
          style="color: #e6c364;">Weave the Arcane</h2>
      <p class="font-body text-sm italic" style="color: #99907e;">
        "Magic flows through you — or perhaps you command it through study and devotion."
      </p>
    </div>

    <div class="dnd-divider mb-6"></div>

    <!-- Non-spellcaster note -->
    @if (isNonSpellcaster()) {
      <div class="p-4 mb-6" style="background: #1a202b; border: 1px solid #4d4637; border-left: 2px solid #99907e;">
        <p class="font-headline text-xs uppercase tracking-wider" style="color: #99907e;">
          This class does not typically cast spells
        </p>
        <p class="font-body text-xs mt-1" style="color: #4d4637;">
          Fields are available for multiclassing or subclass features (e.g. Eldritch Knight, Arcane Trickster).
        </p>
      </div>
    }

    <!-- Header stats row -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

      <!-- Spellcasting Class -->
      <div class="dnd-stat-box p-4" style="border-radius: 0;">
        <p class="font-headline text-[9px] uppercase tracking-widest mb-2" style="color: #99907e;">
          Spellcasting Class
        </p>
        <input
          type="text"
          class="w-full font-headline text-sm bg-transparent outline-none"
          style="color: #dde2f2; border-bottom: 1px solid #4d4637; border-radius: 0;"
          placeholder="e.g. Wizard"
          [value]="spellcastingClass()"
          (input)="spellcastingClassChanged.emit($any($event.target).value)"
        />
      </div>

      <!-- Spellcasting Ability -->
      <div class="dnd-stat-box p-4" style="border-radius: 0;">
        <p class="font-headline text-[9px] uppercase tracking-widest mb-2" style="color: #99907e;">
          Spellcasting Ability
        </p>
        <select
          class="w-full font-headline text-sm bg-transparent outline-none appearance-none"
          style="color: #e6c364; border-bottom: 1px solid #4d4637; border-radius: 0;"
          [value]="spellcastingAbility()"
          (change)="spellcastingAbilityChanged.emit($any($event.target).value)"
        >
          @for (ab of spellcastingAbilities; track ab) {
            <option [value]="ab" style="background: #1a202b; color: #dde2f2;">{{ ab }}</option>
          }
        </select>
      </div>

      <!-- Spell Save DC -->
      <div class="dnd-stat-box p-4 text-center" style="border-radius: 0;">
        <p class="font-headline text-[9px] uppercase tracking-widest mb-1" style="color: #99907e;">
          Spell Save DC
        </p>
        <span class="font-headline text-2xl font-bold" style="color: #e6c364;">
          {{ spellSaveDC() }}
        </span>
      </div>

      <!-- Spell Attack Bonus -->
      <div class="dnd-stat-box p-4 text-center" style="border-radius: 0;">
        <p class="font-headline text-[9px] uppercase tracking-widest mb-1" style="color: #99907e;">
          Spell Attack Bonus
        </p>
        <span class="font-headline text-2xl font-bold" style="color: #e6c364;">
          {{ formatMod(spellAttackBonus()) }}
        </span>
      </div>

    </div>

    <!-- Spell Slots grid -->
    <div class="mb-8">
      <h3 class="font-headline text-xs font-bold uppercase tracking-widest dnd-gold-bar mb-3"
          style="color: #e6c364;">Spell Slots</h3>
      <div class="grid grid-cols-9 gap-1 p-3"
           style="border: 1px solid rgba(230,195,100,0.3);">
        @for (level of spellLevels; track level; let i = $index) {
          <div class="text-center">
            <p class="font-headline text-[8px] uppercase mb-1" style="color: #99907e;">{{ level }}</p>
            <input
              type="text"
              class="w-full text-center font-headline text-xs bg-transparent outline-none"
              style="color: #e6c364; border-bottom: 1px solid #4d4637; border-radius: 0;"
              placeholder="—"
              [value]="getSpellSlot(i + 1)"
              (input)="onSpellSlotInput(i + 1, $event)"
            />
          </div>
        }
      </div>
    </div>

    <!-- Cantrips + Spell levels -->
    <div>
      <h3 class="font-headline text-xs font-bold uppercase tracking-widest dnd-gold-bar mb-4"
          style="color: #e6c364;">Spells Known / Prepared</h3>

      <!-- Cantrips full-width -->
      <div class="mb-4">
        <label class="block font-headline text-[9px] uppercase tracking-[0.2em] mb-2"
               style="color: #99907e;">
          <span class="material-symbols-outlined text-xs align-middle mr-1">star_shine</span>
          Cantrips
        </label>
        <textarea
          class="w-full font-body text-sm outline-none p-3 resize-none"
          style="background: #161c27; color: #dde2f2; border-bottom: 1px solid #4d4637; border-radius: 0; min-height: 64px;"
          placeholder="List cantrips here…"
          [value]="cantrips()"
          (input)="cantripsChanged.emit($any($event.target).value)"
        ></textarea>
      </div>

      <!-- Spell levels 1-5 in 2 columns -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        @for (lvlDef of spellTextareaLevels; track lvlDef.key) {
          <div>
            <label class="block font-headline text-[9px] uppercase tracking-[0.2em] mb-2"
                   style="color: #99907e;">{{ lvlDef.label }}</label>
            <textarea
              class="w-full font-body text-sm outline-none p-3 resize-none"
              style="background: #161c27; color: #dde2f2; border-bottom: 1px solid #4d4637; border-radius: 0; min-height: 80px;"
              [placeholder]="'List ' + lvlDef.label.toLowerCase() + ' spells…'"
              [value]="getSpellLevel(lvlDef.key)"
              (input)="onSpellLevelInput(lvlDef.key, $event)"
            ></textarea>
          </div>
        }
      </div>
    </div>
  `,
})
export class DndSpellcastingStepComponent {
  readonly characterClass      = input<string>('');
  readonly spellcastingClass   = input<string>('');
  readonly spellcastingAbility = input<string>('INT');
  readonly spellSaveDC         = input<number>(13);
  readonly spellAttackBonus    = input<number>(5);
  readonly spellSlots          = input<Record<string, string>>({});
  readonly cantrips = input<string>('');
  readonly spells1  = input<string>('');
  readonly spells2  = input<string>('');
  readonly spells3  = input<string>('');
  readonly spells4  = input<string>('');
  readonly spells5  = input<string>('');

  readonly spellcastingClassChanged   = output<string>();
  readonly spellcastingAbilityChanged = output<string>();
  readonly spellSlotsChanged          = output<Record<string, string>>();
  readonly cantripsChanged = output<string>();
  readonly spells1Changed  = output<string>();
  readonly spells2Changed  = output<string>();
  readonly spells3Changed  = output<string>();
  readonly spells4Changed  = output<string>();
  readonly spells5Changed  = output<string>();

  readonly spellcastingAbilities = SPELLCASTING_ABILITIES;
  readonly spellLevels = SPELL_LEVELS;

  readonly spellTextareaLevels = [
    { key: '1', label: '1st-Level Spells' },
    { key: '2', label: '2nd-Level Spells' },
    { key: '3', label: '3rd-Level Spells' },
    { key: '4', label: '4th-Level Spells' },
    { key: '5', label: '5th-Level Spells' },
  ];

  isNonSpellcaster(): boolean {
    return NON_SPELLCASTERS.has(this.characterClass().toLowerCase());
  }

  formatMod(n: number): string {
    return n >= 0 ? `+${n}` : `${n}`;
  }

  getSpellSlot(level: number): string {
    return this.spellSlots()[String(level)] ?? '';
  }

  onSpellSlotInput(level: number, event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    const updated = { ...this.spellSlots(), [String(level)]: val };
    this.spellSlotsChanged.emit(updated);
  }

  getSpellLevel(key: string): string {
    switch (key) {
      case '1': return this.spells1();
      case '2': return this.spells2();
      case '3': return this.spells3();
      case '4': return this.spells4();
      case '5': return this.spells5();
      default:  return '';
    }
  }

  onSpellLevelInput(key: string, event: Event): void {
    const val = (event.target as HTMLTextAreaElement).value;
    switch (key) {
      case '1': this.spells1Changed.emit(val); break;
      case '2': this.spells2Changed.emit(val); break;
      case '3': this.spells3Changed.emit(val); break;
      case '4': this.spells4Changed.emit(val); break;
      case '5': this.spells5Changed.emit(val); break;
    }
  }
}
