import { Component, computed, input, output } from '@angular/core';

const BACKGROUNDS = [
  'Acolyte', 'Artisan', 'Charlatan', 'Criminal', 'Entertainer',
  'Farmer', 'Guard', 'Guide', 'Hermit', 'Merchant',
  'Noble', 'Sailor', 'Scribe', 'Soldier', 'Wayfarer',
];

@Component({
  selector: 'app-dnd-identity-step',
  template: `
    <!-- ══ IDENTITY PREVIEW BANNER ══ -->
    <div class="mb-8 p-6 relative overflow-hidden"
         style="background: #080e19; border: 1px solid rgba(230,195,100,0.15); border-left: 4px solid #e6c364;">

      <!-- Watermark -->
      <div class="absolute inset-0 flex items-center justify-end pr-8 pointer-events-none select-none" aria-hidden="true">
        <span class="font-headline font-black uppercase tracking-tighter leading-none opacity-[0.04]"
              style="font-size: 6rem; color: #e6c364;">HERO</span>
      </div>

      <div class="relative">
        <p class="font-headline text-[9px] uppercase tracking-[0.3em] mb-3"
           style="color: #4d4637;">The Relic Ledger // Hero Identity // Form 1-A</p>

        <!-- Character name hero -->
        <p class="font-headline font-black uppercase tracking-tight leading-none mb-3 transition-all duration-200"
           style="font-size: clamp(1.8rem, 4vw, 3rem); color: #e6c364;">
          {{ characterName().trim() || 'UNNAMED ADVENTURER' }}
        </p>

        <!-- Sub-line -->
        <div class="flex flex-wrap items-center gap-6">
          @if (background().trim()) {
            <div>
              <p class="font-headline text-[8px] uppercase tracking-widest mb-0.5" style="color: #4d4637;">Background</p>
              <span class="font-headline text-xs font-bold uppercase" style="color: #d0c5b2;">{{ background() }}</span>
            </div>
          }
          <div>
            <p class="font-headline text-[8px] uppercase tracking-widest mb-0.5" style="color: #4d4637;">Level</p>
            <span class="font-headline text-xs font-bold" style="color: #dde2f2;">{{ characterLevel() }}</span>
          </div>
          @if (playerName().trim()) {
            <div>
              <p class="font-headline text-[8px] uppercase tracking-widest mb-0.5" style="color: #4d4637;">Player</p>
              <span class="font-body text-xs" style="color: #99907e;">{{ playerName() }}</span>
            </div>
          }
        </div>
      </div>
    </div>

    <!-- ══ FORM FIELDS ══ -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">

      <!-- Left column -->
      <div class="space-y-6">

        <!-- Character Name -->
        <div>
          <label class="block font-headline text-[9px] font-bold uppercase tracking-[0.2em] mb-2"
                 style="color: #99907e;">Character Name</label>
          <input
            type="text"
            class="w-full font-headline text-base outline-none px-4 py-3 transition-colors"
            style="background: #161c27; color: #dde2f2; border-bottom: 1px solid #4d4637; border-radius: 0;"
            placeholder="e.g. Eryndra Steelwhisper…"
            [value]="characterName()"
            (input)="characterNameChanged.emit($any($event.target).value)"
          />
        </div>

        <!-- Player Name -->
        <div>
          <label class="block font-headline text-[9px] font-bold uppercase tracking-[0.2em] mb-2"
                 style="color: #99907e;">Player Name</label>
          <input
            type="text"
            class="w-full font-body text-base outline-none px-4 py-3 transition-colors"
            style="background: #161c27; color: #dde2f2; border-bottom: 1px solid #4d4637; border-radius: 0;"
            placeholder="Your name"
            [value]="playerName()"
            (input)="playerNameChanged.emit($any($event.target).value)"
          />
        </div>

        <!-- Level stepper -->
        <div>
          <label class="block font-headline text-[9px] font-bold uppercase tracking-[0.2em] mb-2"
                 style="color: #99907e;">Character Level</label>
          <div class="flex items-center gap-3">
            <button
              class="w-9 h-9 flex items-center justify-center font-black text-lg transition-colors"
              style="background: #1a202b; color: #99907e; border: 1px solid #4d4637; border-radius: 0;"
              [style.opacity]="characterLevel() <= 1 ? '0.3' : '1'"
              (click)="characterLevel() > 1 && characterLevelChanged.emit(characterLevel() - 1)"
            >−</button>
            <span class="font-headline text-2xl font-black w-8 text-center" style="color: #e6c364;">
              {{ characterLevel() }}
            </span>
            <button
              class="w-9 h-9 flex items-center justify-center font-black text-lg transition-colors"
              style="background: #1a202b; color: #99907e; border: 1px solid #4d4637; border-radius: 0;"
              [style.opacity]="characterLevel() >= 20 ? '0.3' : '1'"
              (click)="characterLevel() < 20 && characterLevelChanged.emit(characterLevel() + 1)"
            >+</button>
            <span class="font-headline text-[9px] uppercase" style="color: #4d4637;">of 20</span>
          </div>
        </div>

        <!-- Experience Points -->
        <div>
          <label class="block font-headline text-[9px] font-bold uppercase tracking-[0.2em] mb-2"
                 style="color: #99907e;">Experience Points</label>
          <input
            type="text"
            class="w-full font-body text-base outline-none px-4 py-3 transition-colors"
            style="background: #161c27; color: #dde2f2; border-bottom: 1px solid #4d4637; border-radius: 0;"
            placeholder="0"
            [value]="experiencePoints()"
            (input)="experiencePointsChanged.emit($any($event.target).value)"
          />
        </div>

      </div>

      <!-- Right column: Background picker -->
      <div>
        <label class="block font-headline text-[9px] font-bold uppercase tracking-[0.2em] mb-2"
               style="color: #99907e;">Background</label>
        <p class="font-body text-xs italic mb-3" style="color: #99907e;">
          "Your background shapes who you are beyond your class and species."
        </p>
        <div class="flex flex-col" style="border: 1px solid #4d4637;">
          @for (bg of backgrounds; track bg) {
            <button
              class="flex items-center gap-3 px-3 py-2 transition-all text-left"
              [style.background]="background() === bg ? 'rgba(230,195,100,0.08)' : 'transparent'"
              [style.border-left]="background() === bg ? '3px solid #e6c364' : '3px solid transparent'"
              (click)="backgroundChanged.emit(bg)"
            >
              <span
                class="font-headline text-[10px] uppercase tracking-widest flex-1"
                [style.color]="background() === bg ? '#e6c364' : '#d0c5b2'"
              >{{ bg }}</span>
              @if (background() === bg) {
                <span class="font-headline text-[8px] uppercase tracking-widest" style="color: #e6c364;">Selected</span>
              }
            </button>
            @if (!$last) {
              <div style="height:1px; background: rgba(77,70,55,0.4);"></div>
            }
          }
        </div>
      </div>

    </div>
  `,
})
export class DndIdentityStepComponent {
  readonly characterName    = input<string>('');
  readonly playerName       = input<string>('');
  readonly characterLevel   = input<number>(1);
  readonly experiencePoints = input<string>('');
  readonly background       = input<string>('');

  readonly characterNameChanged    = output<string>();
  readonly playerNameChanged       = output<string>();
  readonly characterLevelChanged   = output<number>();
  readonly experiencePointsChanged = output<string>();
  readonly backgroundChanged       = output<string>();

  readonly backgrounds = BACKGROUNDS;
}
