import { Component, input, output } from '@angular/core';
import { DndWeaponSnapshot } from '../../../services/dnd-draft.service';

interface CurrencyField {
  key: 'gold' | 'silver' | 'copper' | 'electrum' | 'platinum';
  label: string;
  abbr: string;
  dotColor: string;
}

const CURRENCY_FIELDS: CurrencyField[] = [
  { key: 'copper',   label: 'Copper',   abbr: 'CP', dotColor: '#b87333' },
  { key: 'silver',   label: 'Silver',   abbr: 'SP', dotColor: '#c0c0c0' },
  { key: 'electrum', label: 'Electrum', abbr: 'EP', dotColor: '#5a9fd4' },
  { key: 'gold',     label: 'Gold',     abbr: 'GP', dotColor: '#e6c364' },
  { key: 'platinum', label: 'Platinum', abbr: 'PP', dotColor: '#d8d8d8' },
];

const ARMOR_TYPES = ['None', 'Light', 'Medium', 'Heavy', 'Shield'];

@Component({
  selector: 'app-dnd-equipment-step',
  template: `
    <!-- Section header -->
    <div class="mb-6">
      <h2 class="font-headline text-xl font-bold uppercase tracking-widest dnd-gold-bar mb-2"
          style="color: #e6c364;">Gather Your Gear</h2>
      <p class="font-body text-sm italic" style="color: #99907e;">
        "A well-equipped adventurer is a living adventurer."
      </p>
    </div>

    <div class="dnd-divider mb-6"></div>

    <!-- Currency -->
    <div class="mb-8">
      <h3 class="font-headline text-xs font-bold uppercase tracking-widest dnd-gold-bar mb-4"
          style="color: #e6c364;">Currency</h3>
      <div class="grid grid-cols-5 gap-2">
        @for (curr of currencyFields; track curr.key) {
          <div class="dnd-stat-box p-3 text-center" style="border-radius: 0;">
            <div class="flex items-center justify-center gap-1 mb-1">
              <span class="w-2.5 h-2.5 rounded-full inline-block"
                    [style.background]="curr.dotColor"></span>
              <span class="font-headline text-[9px] uppercase tracking-widest" style="color: #99907e;">
                {{ curr.abbr }}
              </span>
            </div>
            <input
              type="text"
              class="w-full text-center font-headline text-base bg-transparent outline-none"
              style="color: #dde2f2; border-bottom: 1px solid #4d4637; border-radius: 0;"
              placeholder="0"
              [value]="getCurrencyValue(curr.key)"
              (input)="onCurrencyInput(curr.key, $event)"
            />
          </div>
        }
      </div>
    </div>

    <!-- Armour -->
    <div class="mb-8">
      <h3 class="font-headline text-xs font-bold uppercase tracking-widest dnd-gold-bar mb-4"
          style="color: #e6c364;">Armour</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block font-headline text-[9px] uppercase tracking-[0.2em] mb-2"
                 style="color: #99907e;">Armour Name</label>
          <input
            type="text"
            class="w-full font-body text-base outline-none px-4 py-3"
            style="background: #161c27; color: #dde2f2; border-bottom: 1px solid #4d4637; border-radius: 0;"
            placeholder="e.g. Chain Mail, Leather Armor…"
            [value]="armorName()"
            (input)="armorNameChanged.emit($any($event.target).value)"
          />
        </div>
        <div>
          <label class="block font-headline text-[9px] uppercase tracking-[0.2em] mb-2"
                 style="color: #99907e;">Armour Type</label>
          <select
            class="w-full font-headline text-base outline-none px-4 py-3 appearance-none"
            style="background: #161c27; color: #dde2f2; border-bottom: 1px solid #4d4637; border-radius: 0;"
            [value]="armorType()"
            (change)="armorTypeChanged.emit($any($event.target).value)"
          >
            @for (type of armorTypes; track type) {
              <option [value]="type" style="background: #161c27;">{{ type }}</option>
            }
          </select>
        </div>
      </div>
    </div>

    <!-- Weapons -->
    <div class="mb-8">
      <h3 class="font-headline text-xs font-bold uppercase tracking-widest dnd-gold-bar mb-4"
          style="color: #e6c364;">Weapons</h3>

      <!-- Column headers -->
      <div class="grid gap-2 mb-2 px-2"
           style="grid-template-columns: 1fr 100px 120px;">
        <span class="font-headline text-[8px] uppercase tracking-widest" style="color: #4d4637;">Weapon Name</span>
        <span class="font-headline text-[8px] uppercase tracking-widest" style="color: #4d4637;">Damage</span>
        <span class="font-headline text-[8px] uppercase tracking-widest" style="color: #4d4637;">Damage Type</span>
      </div>

      <div class="space-y-2">
        @for (weapon of weapons(); track $index) {
          <div class="grid gap-2 p-3"
               style="grid-template-columns: 1fr 100px 120px; background: #161c27; border: 1px solid #4d4637;">
            <input
              type="text"
              class="font-body text-sm bg-transparent outline-none"
              style="color: #dde2f2; border-bottom: 1px solid #4d4637; border-radius: 0;"
              placeholder="Longsword"
              [value]="weapon.name"
              (input)="onWeaponInput($index, 'name', $event)"
            />
            <input
              type="text"
              class="font-body text-sm bg-transparent outline-none"
              style="color: #dde2f2; border-bottom: 1px solid #4d4637; border-radius: 0;"
              placeholder="1d8+3"
              [value]="weapon.damage"
              (input)="onWeaponInput($index, 'damage', $event)"
            />
            <input
              type="text"
              class="font-body text-sm bg-transparent outline-none"
              style="color: #dde2f2; border-bottom: 1px solid #4d4637; border-radius: 0;"
              placeholder="Slashing"
              [value]="weapon.damageType"
              (input)="onWeaponInput($index, 'damageType', $event)"
            />
          </div>
        }
      </div>
    </div>

    <!-- Equipment notes -->
    <div>
      <h3 class="font-headline text-xs font-bold uppercase tracking-widest dnd-gold-bar mb-4"
          style="color: #e6c364;">Equipment & Inventory Notes</h3>
      <textarea
        class="w-full font-body text-sm outline-none p-4 resize-none"
        style="background: #161c27; color: #dde2f2; border: 1px solid #4d4637; border-radius: 0; min-height: 120px;"
        placeholder="List your equipment, supplies, and other carried items…"
        [value]="equipment()"
        (input)="equipmentChanged.emit($any($event.target).value)"
      ></textarea>
    </div>
  `,
})
export class DndEquipmentStepComponent {
  readonly gold     = input<string>('');
  readonly silver   = input<string>('');
  readonly copper   = input<string>('');
  readonly electrum = input<string>('');
  readonly platinum = input<string>('');
  readonly armorName  = input<string>('');
  readonly armorType  = input<string>('None');
  readonly weapons    = input<DndWeaponSnapshot[]>([]);
  readonly equipment  = input<string>('');

  readonly goldChanged     = output<string>();
  readonly silverChanged   = output<string>();
  readonly copperChanged   = output<string>();
  readonly electrumChanged = output<string>();
  readonly platinumChanged = output<string>();
  readonly armorNameChanged  = output<string>();
  readonly armorTypeChanged  = output<string>();
  readonly weaponsChanged    = output<DndWeaponSnapshot[]>();
  readonly equipmentChanged  = output<string>();

  readonly currencyFields = CURRENCY_FIELDS;
  readonly armorTypes = ARMOR_TYPES;

  getCurrencyValue(key: CurrencyField['key']): string {
    switch (key) {
      case 'gold':     return this.gold();
      case 'silver':   return this.silver();
      case 'copper':   return this.copper();
      case 'electrum': return this.electrum();
      case 'platinum': return this.platinum();
    }
  }

  onCurrencyInput(key: CurrencyField['key'], event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    switch (key) {
      case 'gold':     this.goldChanged.emit(val);     break;
      case 'silver':   this.silverChanged.emit(val);   break;
      case 'copper':   this.copperChanged.emit(val);   break;
      case 'electrum': this.electrumChanged.emit(val); break;
      case 'platinum': this.platinumChanged.emit(val); break;
    }
  }

  onWeaponInput(index: number, field: keyof DndWeaponSnapshot, event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    const updated = this.weapons().map((w, i) =>
      i === index ? { ...w, [field]: val } : w
    );
    this.weaponsChanged.emit(updated);
  }
}
