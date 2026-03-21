import { Component, computed, input, output, signal } from '@angular/core';
import {
  PARANOIA_SECRET_SOCIETIES,
  COVER_SOCIETY_OPTIONS,
  SECRET_SOCIETY_BY_ID,
  SecretSocietyDefinition,
} from '../../../games/paranoia-2e/data/secret-societies.data';

@Component({
  selector: 'app-society-step',
  template: `

    <!-- ══════════════════════════ SECRET PAGE HEADER ══ -->
    <div class="mb-8 p-5 relative overflow-hidden"
         style="background: rgba(196,30,30,0.06); border: 1px solid rgba(196,30,30,0.25);">

      <div class="absolute inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden="true">
        <span class="font-headline font-black text-[8rem] leading-none uppercase tracking-tighter opacity-[0.03] text-primary-container">
          SECRET
        </span>
      </div>

      <div class="relative">
        <div class="flex items-center gap-3 mb-2">
          <span class="material-symbols-outlined text-primary-container text-lg">groups</span>
          <span class="font-headline text-[10px] font-black uppercase tracking-[0.25em] text-primary-container">
            Secret Page — Society Assignment
          </span>
        </div>
        <p class="font-headline text-[10px] font-bold uppercase tracking-widest text-gray-500">
          Secret society membership is
          <span class="text-primary-container">TREASONOUS</span>.
          Disclose this page to no one. Lie if asked.
        </p>
      </div>
    </div>

    <!-- ══════════════════════════ PRIMARY SOCIETY ══ -->

    @if (!primarySociety() && !isRolling()) {

      <!-- Unrolled -->
      <div class="mb-6 p-8 flex flex-col items-center justify-center gap-4"
           style="background: rgba(19,19,24,0.8); border: 1px dashed rgba(196,30,30,0.3); min-height: 12rem;">
        <div class="text-center">
          <p class="font-headline text-[10px] font-black uppercase tracking-[0.3em] text-gray-700 mb-3">
            Society Affiliation
          </p>
          <p class="font-headline text-4xl font-black uppercase tracking-tighter text-gray-800 select-none">
            ██████████████
          </p>
        </div>
        <p class="font-headline text-[9px] text-gray-700 uppercase tracking-widest mt-2">
          — Roll d20 to assign society —
        </p>
      </div>

    } @else if (isRolling()) {

      <!-- Rolling -->
      <div class="mb-6 p-8 flex flex-col items-center justify-center gap-4"
           style="background: rgba(19,19,24,0.8); border: 1px dashed rgba(196,30,30,0.3); min-height: 12rem;">
        <span class="material-symbols-outlined text-primary-container text-5xl dice-spin-slow">groups</span>
        <p class="font-headline text-[10px] font-black uppercase tracking-widest text-primary-container">
          Accessing Classified Records...
        </p>
      </div>

    } @else {

      <!-- ── IntSec mole ── -->
      @if (isIntSecMole()) {

        <div class="mb-6 reveal-flash"
             style="background: rgba(196,30,30,0.1); border: 1px solid rgba(196,30,30,0.5); border-left: 4px solid #c41e1e;">

          <div class="px-6 pt-6 pb-4" style="border-bottom: 1px solid rgba(196,30,30,0.2);">
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="font-headline text-[9px] font-black uppercase tracking-[0.25em] text-gray-600 mb-2">
                  True Allegiance
                </p>
                <h2 class="font-headline text-4xl font-black uppercase tracking-tighter leading-none text-primary-container mb-1">
                  IntSec Operative
                </h2>
                <p class="font-headline text-[10px] font-bold uppercase tracking-widest text-primary-container mt-2">
                  ⚠ Internal Security Mole — You work for the secret police.
                </p>
              </div>
              @if (lastRoll()) {
                <span class="font-headline text-[10px] font-black text-gray-600 shrink-0">
                  Roll: {{ lastRoll() }} / 20
                </span>
              }
            </div>
            <p class="font-body text-sm text-gray-400 leading-relaxed mt-3">
              {{ intSecDef()!.ideology }}
            </p>
          </div>

          <!-- Cover society section -->
          <div class="px-6 py-4">
            <p class="font-headline text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3">
              Cover Society (False Front)
            </p>

            @if (!coverSociety()) {
              <div class="flex items-center gap-3">
                <span class="font-body text-sm text-gray-700 italic">
                  No cover assigned — roll or select below.
                </span>
              </div>
            } @else {
              <div class="flex items-start justify-between gap-4">
                <div>
                  <h3 class="font-headline text-2xl font-black uppercase tracking-tighter leading-none text-on-surface">
                    {{ coverSociety()!.label }}
                  </h3>
                  @if (coverLastRoll()) {
                    <span class="font-headline text-[10px] text-gray-600">Roll: {{ coverLastRoll() }} / 20</span>
                  }
                  <p class="font-body text-xs text-gray-500 leading-relaxed mt-2 max-w-lg">
                    {{ coverSociety()!.ideology }}
                  </p>
                </div>
              </div>
            }

            <!-- Cover controls -->
            <div class="flex items-center gap-3 mt-4 flex-wrap">
              <button
                class="font-headline font-black uppercase px-6 py-3 text-xs flex items-center gap-2
                       transition-all active:scale-95 bg-primary-container text-white"
                (click)="rollCoverRequested.emit()"
              >
                <span>{{ coverSociety() ? 'Re-roll Cover' : 'Roll Cover Society' }}</span>
                <span class="material-symbols-outlined text-sm">casino</span>
              </button>

              <div class="relative">
                <button
                  class="font-headline font-bold uppercase px-5 py-3 text-xs flex items-center gap-2
                         transition-all active:scale-95 text-gray-400 hover:text-on-surface"
                  style="border: 1px solid rgba(92,64,61,0.3);"
                  (click)="coverDropdownOpen.update(v => !v)"
                >
                  <span>Select Cover</span>
                  <span class="material-symbols-outlined text-sm transition-transform duration-200"
                        [class.rotate-180]="coverDropdownOpen()">expand_more</span>
                </button>

                @if (coverDropdownOpen()) {
                  <div class="absolute bottom-full left-0 mb-1 z-50 bg-surface-container-high w-56 max-h-64 overflow-y-auto shadow-lg"
                       style="border: 1px solid rgba(92,64,61,0.2);" role="listbox">
                    @for (s of coverOptions; track s.id) {
                      <button
                        class="w-full px-4 py-2.5 text-left hover:bg-surface-container-highest transition-colors"
                        [class.bg-surface-container-highest]="coverSociety()?.id === s.id"
                        [style.border-left]="coverSociety()?.id === s.id ? '3px solid #c41e1e' : '3px solid transparent'"
                        role="option"
                        (click)="selectCover(s)"
                      >
                        <span class="font-headline text-xs font-bold uppercase text-on-surface">{{ s.label }}</span>
                      </button>
                    }
                  </div>
                }
              </div>
            </div>
          </div>

        </div>

      } @else {

        <!-- ── Normal society ── -->
        <div class="mb-6 p-6 reveal-flash"
             style="background: rgba(196,30,30,0.05); border: 1px solid rgba(196,30,30,0.3); border-left: 4px solid #c41e1e;">

          <div class="flex items-start justify-between gap-4 mb-3">
            <div>
              <p class="font-headline text-[9px] font-black uppercase tracking-[0.25em] text-gray-600 mb-2">
                Society Assigned
              </p>
              <h2 class="font-headline text-4xl font-black uppercase tracking-tighter leading-none text-on-surface">
                {{ primarySociety()!.label }}
              </h2>
            </div>
            @if (lastRoll()) {
              <span class="font-headline text-[10px] font-black text-gray-600 shrink-0">
                Roll: {{ lastRoll() }} / 20
              </span>
            }
          </div>

          <p class="font-body text-sm text-gray-400 leading-relaxed">
            {{ primarySociety()!.ideology }}
          </p>

        </div>

      }

    }

    <!-- ══════════════════════════ CONTROLS ══ -->
    @if (!isIntSecMole()) {
      <div class="flex items-center gap-4 flex-wrap">

        <button
          class="font-headline font-black uppercase px-8 py-4 text-sm flex items-center gap-3
                 transition-all active:scale-95 bg-primary-container text-white"
          [class.opacity-70]="isRolling()"
          [class.cursor-not-allowed]="isRolling()"
          (click)="!isRolling() && rollRequested.emit()"
        >
          <span>{{ primarySociety() ? 'Re-roll Society' : 'Roll d20' }}</span>
          <span class="material-symbols-outlined" [class.dice-spin]="isRolling()">casino</span>
        </button>

        <div class="relative">
          <button
            class="font-headline font-bold uppercase px-6 py-4 text-sm flex items-center gap-2
                   transition-all active:scale-95 text-gray-400 hover:text-on-surface"
            style="border: 1px solid rgba(92,64,61,0.3);"
            (click)="primaryDropdownOpen.update(v => !v)"
            [attr.aria-expanded]="primaryDropdownOpen()"
          >
            <span>Select Manually</span>
            <span class="material-symbols-outlined text-sm transition-transform duration-200"
                  [class.rotate-180]="primaryDropdownOpen()">expand_more</span>
          </button>

          @if (primaryDropdownOpen()) {
            <div class="absolute bottom-full left-0 mb-1 z-50 bg-surface-container-high w-64 max-h-72 overflow-y-auto shadow-lg"
                 style="border: 1px solid rgba(92,64,61,0.2);" role="listbox">
              @for (s of allSocieties; track s.id) {
                <button
                  class="w-full px-4 py-2.5 text-left hover:bg-surface-container-highest transition-colors"
                  [class.bg-surface-container-highest]="primarySociety()?.id === s.id"
                  [style.border-left]="primarySociety()?.id === s.id ? '3px solid #c41e1e' : '3px solid transparent'"
                  role="option"
                  (click)="selectPrimary(s)"
                >
                  <span class="font-headline text-xs font-bold uppercase text-on-surface block">{{ s.label }}</span>
                  @if (s.isIntSecMole) {
                    <span class="font-headline text-[8px] text-primary-container uppercase">Mole — cover roll required</span>
                  }
                </button>
              }
            </div>
          }
        </div>

      </div>
    }

  `,
  styles: [`
    @keyframes dice-spin {
      0%   { transform: rotate(0deg)   scale(1);   }
      25%  { transform: rotate(90deg)  scale(1.1); }
      50%  { transform: rotate(180deg) scale(1);   }
      75%  { transform: rotate(270deg) scale(1.1); }
      100% { transform: rotate(360deg) scale(1);   }
    }
    .dice-spin { animation: dice-spin 400ms ease-in-out 1; }

    @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    .dice-spin-slow { animation: spin-slow 900ms linear infinite; }

    @keyframes reveal-flash-anim {
      0%   { opacity: 0; transform: translateY(4px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    .reveal-flash { animation: reveal-flash-anim 400ms ease-out forwards; }
  `],
})
export class SocietyStepComponent {
  readonly societyId      = input<string | null>(null);
  readonly coverSocietyId = input<string | null>(null);
  readonly isRolling      = input<boolean>(false);
  readonly lastRoll       = input<number | null>(null);
  readonly coverLastRoll  = input<number | null>(null);

  readonly rollRequested      = output<void>();
  readonly rollCoverRequested = output<void>();
  readonly societySelected    = output<string>();
  readonly coverSelected      = output<string>();

  readonly primaryDropdownOpen = signal(false);
  readonly coverDropdownOpen   = signal(false);

  readonly allSocieties = PARANOIA_SECRET_SOCIETIES;
  readonly coverOptions = COVER_SOCIETY_OPTIONS;

  readonly intSecDef = computed(() => SECRET_SOCIETY_BY_ID['intsec'] ?? null);

  readonly primarySociety = computed<SecretSocietyDefinition | null>(() => {
    const id = this.societyId();
    return id ? (SECRET_SOCIETY_BY_ID[id] ?? null) : null;
  });

  readonly coverSociety = computed<SecretSocietyDefinition | null>(() => {
    const id = this.coverSocietyId();
    return id ? (SECRET_SOCIETY_BY_ID[id] ?? null) : null;
  });

  readonly isIntSecMole = computed(() => this.primarySociety()?.isIntSecMole ?? false);

  selectPrimary(s: SecretSocietyDefinition): void {
    this.primaryDropdownOpen.set(false);
    this.societySelected.emit(s.id);
  }

  selectCover(s: SecretSocietyDefinition): void {
    this.coverDropdownOpen.set(false);
    this.coverSelected.emit(s.id);
  }
}
