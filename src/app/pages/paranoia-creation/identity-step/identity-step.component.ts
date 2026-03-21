import { Component, computed, input, output } from '@angular/core';

export interface ClearanceLevel {
  code: string;
  label: string;
  color: string;
  textColor: string;
}

export const CLEARANCE_LEVELS: ClearanceLevel[] = [
  { code: 'IR', label: 'Infrared',    color: '#1a1a1f', textColor: '#6b7280' },
  { code: 'R',  label: 'Red',         color: '#c41e1e', textColor: '#ffffff' },
  { code: 'O',  label: 'Orange',      color: '#c2410c', textColor: '#ffffff' },
  { code: 'Y',  label: 'Yellow',      color: '#a16207', textColor: '#ffffff' },
  { code: 'G',  label: 'Green',       color: '#15803d', textColor: '#ffffff' },
  { code: 'B',  label: 'Blue',        color: '#1d4ed8', textColor: '#ffffff' },
  { code: 'I',  label: 'Indigo',      color: '#4338ca', textColor: '#ffffff' },
  { code: 'V',  label: 'Violet',      color: '#7e22ce', textColor: '#ffffff' },
  { code: 'UV', label: 'Ultraviolet', color: '#e4e1e8', textColor: '#131318' },
];

@Component({
  selector: 'app-identity-step',
  template: `

    <!-- ══════════════════════════ ID BADGE PREVIEW ══ -->
    <div class="mb-10 p-6 relative overflow-hidden"
         style="background: rgba(19,19,24,0.6); border: 1px solid rgba(92,64,61,0.2); transition: border-left-color 0.3s;"
         [style.border-left]="'8px solid ' + clearanceColor()">

      <!-- Faint watermark -->
      <div class="absolute inset-0 flex items-center justify-end pr-8 pointer-events-none select-none" aria-hidden="true">
        <span class="font-headline font-black text-[6rem] leading-none uppercase tracking-tighter opacity-[0.04] text-on-surface">
          ID
        </span>
      </div>

      <div class="relative">
        <p class="font-headline text-[9px] font-black uppercase tracking-[0.3em] text-gray-600 mb-3">
          Alpha Complex // Citizen Identity File // Form 1-A
        </p>

        <!-- Full name — hero display -->
        <div class="mb-4">
          <p
            class="font-headline font-black uppercase tracking-tighter leading-none transition-all duration-200"
            [class.text-on-surface]="isComplete()"
            [class.text-gray-700]="!isComplete()"
            style="font-size: clamp(2rem, 5vw, 3.5rem);"
          >{{ fullName() }}</p>
        </div>

        <!-- Metadata row -->
        <div class="flex flex-wrap items-center gap-6">
          <div>
            <p class="font-headline text-[8px] text-gray-700 uppercase tracking-widest mb-0.5">Clearance</p>
            <span
              class="font-headline text-[10px] font-black uppercase px-2 py-0.5"
              [style.background]="clearanceColor()"
              [style.color]="clearanceTextColor()"
            >{{ clearance() }} — {{ clearanceLabel() }}</span>
          </div>
          <div>
            <p class="font-headline text-[8px] text-gray-700 uppercase tracking-widest mb-0.5">Sector</p>
            <span class="font-headline text-sm font-black text-on-surface uppercase">
              {{ sectorCode().trim() || '???' }}
            </span>
          </div>
          <div>
            <p class="font-headline text-[8px] text-gray-700 uppercase tracking-widest mb-0.5">Clone</p>
            <span class="font-headline text-sm font-black text-on-surface">{{ cloneNumber() }}</span>
          </div>
          @if (playerName().trim()) {
            <div>
              <p class="font-headline text-[8px] text-gray-700 uppercase tracking-widest mb-0.5">Player</p>
              <span class="font-body text-sm text-gray-400">{{ playerName() }}</span>
            </div>
          }
        </div>
      </div>
    </div>

    <!-- ══════════════════════════ FORM FIELDS ══ -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">

      <!-- Left column -->
      <div class="space-y-6">

        <!-- First name -->
        <div>
          <label class="block font-headline text-[9px] font-black uppercase tracking-widest text-gray-600 mb-2">
            First Name
          </label>
          <input
            type="text"
            class="w-full bg-surface-container font-body text-base text-on-surface placeholder-gray-700
                   outline-none px-4 py-3 transition-colors"
            style="border-bottom: 2px solid rgba(196,30,30,0.4);"
            placeholder="e.g. Joe, Evap, Rex…"
            [value]="firstName()"
            (input)="onFirstNameInput($event)"
          />
          <p class="font-headline text-[8px] text-gray-700 uppercase mt-1">
            Letters only — puns encouraged
          </p>
        </div>

        <!-- Sector code -->
        <div>
          <label class="block font-headline text-[9px] font-black uppercase tracking-widest text-gray-600 mb-2">
            Sector Code
          </label>
          <div class="flex items-center gap-2">
            <input
              type="text"
              maxlength="3"
              class="w-24 bg-surface-container font-headline text-base font-black text-on-surface uppercase
                     placeholder-gray-700 outline-none px-4 py-3 tracking-widest transition-colors"
              style="border-bottom: 2px solid rgba(196,30,30,0.4);"
              placeholder="PET"
              [value]="sectorCode()"
              (input)="onSectorCodeInput($event)"
            />
            <button
              class="w-10 h-10 flex items-center justify-center bg-surface-container
                     hover:bg-primary-container hover:text-white transition-colors text-gray-500"
              style="border: 1px solid rgba(92,64,61,0.25);"
              title="Roll random sector"
              (click)="sectorRollRequested.emit()"
            >
              <span class="material-symbols-outlined text-base">casino</span>
            </button>
          </div>
          <p class="font-headline text-[8px] text-gray-700 uppercase mt-1">
            3-letter sector identifier
          </p>
        </div>

        <!-- Clone number -->
        <div>
          <label class="block font-headline text-[9px] font-black uppercase tracking-widest text-gray-600 mb-2">
            Clone Number
          </label>
          <div class="flex items-center gap-3">
            <button
              class="w-9 h-9 flex items-center justify-center font-black text-lg bg-surface-container
                     hover:bg-primary-container hover:text-white transition-colors text-gray-500"
              style="border: 1px solid rgba(92,64,61,0.2);"
              [class.opacity-30]="cloneNumber() <= 1"
              [class.cursor-not-allowed]="cloneNumber() <= 1"
              (click)="cloneNumber() > 1 && cloneNumberChanged.emit(cloneNumber() - 1)"
            >−</button>
            <span class="font-headline text-2xl font-black text-on-surface w-8 text-center">
              {{ cloneNumber() }}
            </span>
            <button
              class="w-9 h-9 flex items-center justify-center font-black text-lg bg-surface-container
                     hover:bg-primary-container hover:text-white transition-colors text-gray-500"
              style="border: 1px solid rgba(92,64,61,0.2);"
              [class.opacity-30]="cloneNumber() >= 6"
              [class.cursor-not-allowed]="cloneNumber() >= 6"
              (click)="cloneNumber() < 6 && cloneNumberChanged.emit(cloneNumber() + 1)"
            >+</button>
            <span class="font-headline text-[9px] text-gray-700 uppercase">of 6 clones</span>
          </div>
        </div>

      </div>

      <!-- Right column: Player name + Clearance vertical list -->
      <div class="space-y-6">

        <!-- Player name -->
        <div>
          <label class="block font-headline text-[9px] font-black uppercase tracking-widest text-gray-600 mb-2">
            Player Name
          </label>
          <input
            type="text"
            class="w-full bg-surface-container font-body text-base text-on-surface placeholder-gray-700
                   outline-none px-4 py-3 transition-colors"
            style="border-bottom: 2px solid rgba(92,64,61,0.3);"
            placeholder="Your name"
            [value]="playerName()"
            (input)="playerNameChanged.emit($any($event.target).value)"
          />
        </div>

        <!-- Clearance level — vertical list -->
        <div>
          <label class="block font-headline text-[9px] font-black uppercase tracking-widest text-gray-600 mb-2">
            Clearance Level
          </label>
          <div class="flex flex-col" style="border: 1px solid rgba(92,64,61,0.2);">
            @for (lvl of clearanceLevels; track lvl.code) {
              <button
                class="flex items-center gap-3 px-3 py-2 transition-all text-left"
                [style.background]="clearance() === lvl.code
                  ? (lvl.color + '22')
                  : 'transparent'"
                [style.border-left]="clearance() === lvl.code
                  ? '4px solid ' + lvl.color
                  : '4px solid transparent'"
                (click)="clearanceChanged.emit(lvl.code)"
              >
                <!-- Color swatch -->
                <span
                  class="shrink-0 w-4 h-4 inline-block"
                  [style.background]="lvl.color"
                  [style.border]="lvl.code === 'IR' ? '1px solid rgba(255,255,255,0.12)' : 'none'"
                ></span>
                <!-- Code -->
                <span
                  class="font-headline text-xs font-black uppercase w-6 shrink-0"
                  [style.color]="clearance() === lvl.code ? lvl.color : '#6b7280'"
                >{{ lvl.code }}</span>
                <!-- Label -->
                <span
                  class="font-headline text-[10px] uppercase tracking-widest"
                  [style.color]="clearance() === lvl.code ? '#d1cfd4' : '#4b5563'"
                >{{ lvl.label }}</span>
                <!-- Active indicator -->
                @if (clearance() === lvl.code) {
                  <span class="ml-auto font-headline text-[8px] uppercase tracking-widest"
                        [style.color]="lvl.color">Selected</span>
                }
              </button>
              @if (!$last) {
                <div style="height: 1px; background: rgba(92,64,61,0.1);"></div>
              }
            }
          </div>
          <p class="font-headline text-[8px] text-gray-700 uppercase mt-2">
            New Troubleshooters begin at Red (R)
          </p>
        </div>

      </div>

    </div>

    <!-- ══════════════════════════ GENERATE BUTTON ══ -->
    <div class="flex items-center gap-4">
      <button
        class="font-headline font-black uppercase px-8 py-4 text-sm flex items-center gap-3
               transition-all active:scale-95 bg-primary-container text-white"
        (click)="generateRequested.emit()"
      >
        <span>Generate Random Identity</span>
        <span class="material-symbols-outlined text-base">shuffle</span>
      </button>

      @if (firstName().trim() || sectorCode().trim()) {
        <button
          class="font-headline font-bold uppercase px-6 py-4 text-sm flex items-center gap-2
                 transition-all active:scale-95 text-gray-500 hover:text-on-surface"
          style="border: 1px solid rgba(92,64,61,0.25);"
          (click)="clearIdentity()"
        >
          <span>Clear</span>
          <span class="material-symbols-outlined text-sm">close</span>
        </button>
      }
    </div>

  `,
})
export class IdentityStepComponent {
  readonly firstName   = input<string>('');
  readonly sectorCode  = input<string>('');
  readonly cloneNumber = input<number>(1);
  readonly clearance   = input<string>('R');
  readonly playerName  = input<string>('');
  readonly fullName    = input<string>('???-R-???-1');

  readonly firstNameChanged       = output<string>();
  readonly sectorCodeChanged      = output<string>();
  readonly cloneNumberChanged     = output<number>();
  readonly clearanceChanged       = output<string>();
  readonly playerNameChanged      = output<string>();
  readonly generateRequested      = output<void>();
  readonly sectorRollRequested    = output<void>();
  readonly clearIdentityRequested = output<void>();

  readonly clearanceLevels = CLEARANCE_LEVELS;

  readonly isComplete = computed(() =>
    !!this.firstName().trim() && this.sectorCode().trim().length === 3
  );

  readonly clearanceColor = computed(() =>
    CLEARANCE_LEVELS.find(l => l.code === this.clearance())?.color ?? '#c41e1e'
  );

  readonly clearanceTextColor = computed(() =>
    CLEARANCE_LEVELS.find(l => l.code === this.clearance())?.textColor ?? '#ffffff'
  );

  readonly clearanceLabel = computed(() =>
    CLEARANCE_LEVELS.find(l => l.code === this.clearance())?.label ?? 'Red'
  );

  onFirstNameInput(event: Event): void {
    const el = event.target as HTMLInputElement;
    const filtered = el.value.replace(/[^a-zA-Z]/g, '');
    if (filtered !== el.value) el.value = filtered;
    this.firstNameChanged.emit(filtered);
  }

  onSectorCodeInput(event: Event): void {
    const el = event.target as HTMLInputElement;
    const filtered = el.value.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 3);
    if (filtered !== el.value) el.value = filtered;
    this.sectorCodeChanged.emit(filtered);
  }

  clearIdentity(): void {
    this.clearIdentityRequested.emit();
  }
}
