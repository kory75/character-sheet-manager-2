import { Component, input, output } from '@angular/core';

export interface WeaponSlot {
  name: string;
  wsn: string;
  type: string;
  damage: string;
  range: string;
  experimental: boolean;
}

export function emptyWeaponSlot(): WeaponSlot {
  return { name: '', wsn: '', type: '', damage: '', range: '', experimental: false };
}

@Component({
  selector: 'app-weapons-step',
  template: `

    <!-- ══════════════════════════ WEAPONS TABLE ══ -->
    <div class="mb-10">

      <div class="flex items-baseline gap-3 mb-3">
        <h2 class="font-headline text-[11px] font-black uppercase tracking-widest text-on-surface">
          Weapon Registry
        </h2>
        <span class="font-headline text-[10px] text-gray-600 font-bold uppercase">
          — 5 Slots
        </span>
      </div>

      <!-- Column headers (desktop) -->
      <div
        class="hidden lg:grid px-4 pb-2"
        style="grid-template-columns: 1.5rem 1fr 3.5rem 3.5rem 4rem 4.5rem 4.5rem;"
      >
        <span></span>
        <span class="font-headline text-[9px] font-black uppercase tracking-widest text-gray-600">Weapon Name</span>
        <span class="font-headline text-[9px] font-black uppercase tracking-widest text-gray-600 text-center">WSN</span>
        <span class="font-headline text-[9px] font-black uppercase tracking-widest text-gray-600 text-center">Type</span>
        <span class="font-headline text-[9px] font-black uppercase tracking-widest text-gray-600 text-center">Damage</span>
        <span class="font-headline text-[9px] font-black uppercase tracking-widest text-gray-600 text-center">Range</span>
        <span class="font-headline text-[9px] font-black uppercase tracking-widest text-gray-600 text-center">Experimental</span>
      </div>

      <!-- Weapon slot rows -->
      <div class="space-y-1">
        @for (slot of weaponSlots(); let i = $index; track i) {

          <!-- Desktop row -->
          <div
            class="hidden lg:grid items-center gap-x-2 px-4 py-2 bg-surface-container"
            style="grid-template-columns: 1.5rem 1fr 3.5rem 3.5rem 4rem 4.5rem 4.5rem;
                   border-left: 3px solid {{ i === 0 ? '#c41e1e' : 'rgba(92,64,61,0.2)' }};"
          >
            <!-- Slot number -->
            <span class="font-headline text-[10px] font-black text-gray-600">{{ i + 1 }}</span>

            <!-- Name -->
            <input
              type="text"
              class="w-full bg-transparent font-body text-sm text-on-surface placeholder-gray-700
                     outline-none py-1 px-0"
              style="border-bottom: 1px solid rgba(92,64,61,0.25);"
              [placeholder]="i === 0 ? 'Laser Pistol' : '— unassigned —'"
              [value]="slot.name"
              (input)="onField(i, 'name', $any($event.target).value)"
            />

            <!-- WSN — slot 0 auto-derives from laser weapons skill -->
            @if (i === 0) {
              <div class="text-center py-1" style="border-bottom: 1px solid rgba(92,64,61,0.25);">
                <span class="font-headline text-sm font-black text-primary-container">{{ laserWsn() }}</span>
              </div>
            } @else {
              <input
                type="text"
                class="w-full bg-transparent font-headline text-sm text-on-surface text-center
                       placeholder-gray-700 outline-none py-1 px-0"
                style="border-bottom: 1px solid rgba(92,64,61,0.25);"
                placeholder="—"
                [value]="slot.wsn"
                (input)="onField(i, 'wsn', $any($event.target).value)"
              />
            }

            <!-- Type -->
            <input
              type="text"
              class="w-full bg-transparent font-headline text-sm text-on-surface text-center
                     placeholder-gray-700 outline-none py-1 px-0"
              style="border-bottom: 1px solid rgba(92,64,61,0.25);"
              [placeholder]="i === 0 ? 'L' : '—'"
              [value]="slot.type"
              (input)="onField(i, 'type', $any($event.target).value)"
            />

            <!-- Damage -->
            <input
              type="text"
              class="w-full bg-transparent font-headline text-sm text-on-surface text-center
                     placeholder-gray-700 outline-none py-1 px-0"
              style="border-bottom: 1px solid rgba(92,64,61,0.25);"
              [placeholder]="i === 0 ? '8' : '—'"
              [value]="slot.damage"
              (input)="onField(i, 'damage', $any($event.target).value)"
            />

            <!-- Range -->
            <input
              type="text"
              class="w-full bg-transparent font-headline text-sm text-on-surface text-center
                     placeholder-gray-700 outline-none py-1 px-0"
              style="border-bottom: 1px solid rgba(92,64,61,0.25);"
              [placeholder]="i === 0 ? '20' : '—'"
              [value]="slot.range"
              (input)="onField(i, 'range', $any($event.target).value)"
            />

            <!-- Experimental checkbox -->
            <div class="flex justify-center">
              <button
                class="w-5 h-5 flex items-center justify-center transition-colors"
                style="border: 1px solid rgba(92,64,61,0.3);"
                [class.bg-primary-container]="slot.experimental"
                [class.bg-surface-container-highest]="!slot.experimental"
                (click)="onField(i, 'experimental', !slot.experimental)"
                [attr.aria-checked]="slot.experimental"
                role="checkbox"
              >
                @if (slot.experimental) {
                  <span class="material-symbols-outlined text-white text-xs leading-none">check</span>
                }
              </button>
            </div>

          </div>

          <!-- Mobile card -->
          <div
            class="lg:hidden bg-surface-container p-4 space-y-3"
            style="border-left: 3px solid {{ i === 0 ? '#c41e1e' : 'rgba(92,64,61,0.2)' }};"
          >
            <div class="flex items-center gap-2 mb-1">
              <span class="font-headline text-[9px] font-black text-gray-600 uppercase">Slot {{ i + 1 }}</span>
              @if (i === 0) {
                <span class="font-headline text-[8px] font-black uppercase px-1.5 py-0.5 text-primary-container"
                      style="border: 1px solid rgba(196,30,30,0.3);">STANDARD ISSUE</span>
              }
            </div>

            <!-- Name -->
            <div>
              <label class="block font-headline text-[9px] font-bold uppercase tracking-widest text-gray-600 mb-1">
                Weapon Name
              </label>
              <input
                type="text"
                class="w-full bg-transparent font-body text-sm text-on-surface placeholder-gray-700
                       outline-none py-1"
                style="border-bottom: 1px solid rgba(92,64,61,0.25);"
                [placeholder]="i === 0 ? 'Laser Pistol' : '— unassigned —'"
                [value]="slot.name"
                (input)="onField(i, 'name', $any($event.target).value)"
              />
            </div>

            <div class="grid grid-cols-4 gap-3">
              <!-- WSN -->
              <div>
                <label class="block font-headline text-[9px] font-bold uppercase tracking-widest text-gray-600 mb-1">
                  WSN
                </label>
                @if (i === 0) {
                  <span class="font-headline text-sm font-black text-primary-container block py-1">{{ laserWsn() }}</span>
                } @else {
                  <input
                    type="text"
                    class="w-full bg-transparent font-headline text-sm text-on-surface placeholder-gray-700 outline-none py-1"
                    style="border-bottom: 1px solid rgba(92,64,61,0.25);"
                    placeholder="—"
                    [value]="slot.wsn"
                    (input)="onField(i, 'wsn', $any($event.target).value)"
                  />
                }
              </div>

              <!-- Type -->
              <div>
                <label class="block font-headline text-[9px] font-bold uppercase tracking-widest text-gray-600 mb-1">
                  Type
                </label>
                <input
                  type="text"
                  class="w-full bg-transparent font-headline text-sm text-on-surface placeholder-gray-700 outline-none py-1"
                  style="border-bottom: 1px solid rgba(92,64,61,0.25);"
                  [placeholder]="i === 0 ? 'L' : '—'"
                  [value]="slot.type"
                  (input)="onField(i, 'type', $any($event.target).value)"
                />
              </div>

              <!-- Damage -->
              <div>
                <label class="block font-headline text-[9px] font-bold uppercase tracking-widest text-gray-600 mb-1">
                  Dmg
                </label>
                <input
                  type="text"
                  class="w-full bg-transparent font-headline text-sm text-on-surface placeholder-gray-700 outline-none py-1"
                  style="border-bottom: 1px solid rgba(92,64,61,0.25);"
                  [placeholder]="i === 0 ? '8' : '—'"
                  [value]="slot.damage"
                  (input)="onField(i, 'damage', $any($event.target).value)"
                />
              </div>

              <!-- Range -->
              <div>
                <label class="block font-headline text-[9px] font-bold uppercase tracking-widest text-gray-600 mb-1">
                  Range
                </label>
                <input
                  type="text"
                  class="w-full bg-transparent font-headline text-sm text-on-surface placeholder-gray-700 outline-none py-1"
                  style="border-bottom: 1px solid rgba(92,64,61,0.25);"
                  [placeholder]="i === 0 ? '20' : '—'"
                  [value]="slot.range"
                  (input)="onField(i, 'range', $any($event.target).value)"
                />
              </div>
            </div>

            <!-- Experimental -->
            <div class="flex items-center gap-2">
              <button
                class="w-5 h-5 flex items-center justify-center transition-colors"
                style="border: 1px solid rgba(92,64,61,0.3);"
                [class.bg-primary-container]="slot.experimental"
                [class.bg-surface-container-highest]="!slot.experimental"
                (click)="onField(i, 'experimental', !slot.experimental)"
                [attr.aria-checked]="slot.experimental"
                role="checkbox"
              >
                @if (slot.experimental) {
                  <span class="material-symbols-outlined text-white text-xs leading-none">check</span>
                }
              </button>
              <span class="font-headline text-[9px] font-bold uppercase tracking-widest text-gray-600">
                Experimental (R&amp;D prototype)
              </span>
            </div>

          </div>

        }
      </div>

      <!-- WSN legend -->
      <p class="font-headline text-[9px] text-gray-700 mt-3 px-1 uppercase tracking-wide">
        WSN = Weapon Skill Number (Slot 1 auto-populates from Laser Weapons skill)
      </p>

    </div>

    <!-- ══════════════════════════ ARMOUR ══ -->
    <div>

      <div class="flex items-baseline gap-3 mb-3">
        <h2 class="font-headline text-[11px] font-black uppercase tracking-widest text-on-surface">
          Armour
        </h2>
      </div>

      <div class="bg-surface-container px-6 py-4 flex flex-wrap items-end gap-8"
           style="border-left: 3px solid #c41e1e;">

        <!-- Armour worn -->
        <div>
          <label class="block font-headline text-[9px] font-bold uppercase tracking-widest text-gray-600 mb-2">
            Armour Worn
          </label>
          <input
            type="text"
            class="bg-transparent font-body text-sm text-on-surface placeholder-gray-700
                   outline-none py-1 w-40"
            style="border-bottom: 1px solid rgba(92,64,61,0.25);"
            placeholder="Red Reflect Armor"
            [value]="armourWorn()"
            (input)="armourChanged.emit({ worn: $any($event.target).value, rating: armourRating() })"
          />
        </div>

        <!-- Type code -->
        <div>
          <label class="block font-headline text-[9px] font-bold uppercase tracking-widest text-gray-600 mb-2">
            Type
          </label>
          <input
            type="text"
            class="bg-transparent font-headline text-sm text-on-surface placeholder-gray-700
                   outline-none py-1 w-12 text-center"
            style="border-bottom: 1px solid rgba(92,64,61,0.25);"
            placeholder="L"
            [value]="armourType()"
            (input)="armourChanged.emit({ worn: armourWorn(), rating: armourRating(), type: $any($event.target).value })"
          />
        </div>

        <!-- Rating -->
        <div>
          <label class="block font-headline text-[9px] font-bold uppercase tracking-widest text-gray-600 mb-2">
            Rating
          </label>
          <input
            type="text"
            class="bg-transparent font-headline text-sm text-on-surface placeholder-gray-700
                   outline-none py-1 w-16 text-center"
            style="border-bottom: 1px solid rgba(92,64,61,0.25);"
            placeholder="4"
            [value]="armourRating()"
            (input)="armourChanged.emit({ worn: armourWorn(), rating: $any($event.target).value })"
          />
        </div>

      </div>

    </div>

  `,
})
export class WeaponsStepComponent {
  readonly weaponSlots  = input.required<WeaponSlot[]>();
  readonly laserWsn     = input.required<number>();
  readonly armourWorn   = input<string>('Red Reflect Armor');
  readonly armourType   = input<string>('L');
  readonly armourRating = input<string>('4');

  readonly slotChanged   = output<{ index: number; slot: WeaponSlot }>();
  readonly armourChanged = output<{ worn: string; rating: string; type?: string }>();

  onField(index: number, field: keyof WeaponSlot, value: string | boolean): void {
    const current = this.weaponSlots()[index];
    this.slotChanged.emit({ index, slot: { ...current, [field]: value } });
  }
}
