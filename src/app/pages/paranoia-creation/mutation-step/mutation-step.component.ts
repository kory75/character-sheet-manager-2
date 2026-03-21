import { Component, computed, input, output, signal } from '@angular/core';
import {
  PARANOIA_MUTATIONS,
  MUTATION_BY_D20,
  MUTATION_BY_ID,
  MutationDefinition,
} from '../../../games/paranoia-2e/data/mutations.data';

@Component({
  selector: 'app-mutation-step',
  template: `

    <!-- ══════════════════════════ SECRET PAGE HEADER ══ -->
    <div class="mb-8 p-5 relative overflow-hidden"
         style="background: rgba(196,30,30,0.06); border: 1px solid rgba(196,30,30,0.25);">

      <!-- Faint watermark -->
      <div class="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
           aria-hidden="true">
        <span class="font-headline font-black text-[8rem] leading-none uppercase tracking-tighter opacity-[0.03] text-primary-container">
          SECRET
        </span>
      </div>

      <div class="relative">
        <div class="flex items-center gap-3 mb-2">
          <span class="material-symbols-outlined text-primary-container text-lg">lock</span>
          <span class="font-headline text-[10px] font-black uppercase tracking-[0.25em] text-primary-container">
            Secret Page — Mutation Assignment
          </span>
        </div>
        <p class="font-headline text-[10px] font-bold uppercase tracking-widest text-gray-500">
          Disclose this page to no one. Possessing an unregistered mutation is
          <span class="text-primary-container">TREASONOUS</span>.
          Registered mutants must wear a coloured stripe on their uniform.
        </p>
      </div>
    </div>

    <!-- ══════════════════════════ POWER INDEX ══ -->
    <div class="flex items-center gap-6 mb-8">
      <div class="bg-surface-container px-6 py-4" style="border-left: 3px solid #c41e1e;">
        <p class="font-headline text-[9px] font-black uppercase tracking-widest text-gray-600 mb-1">
          Power Index
        </p>
        <p class="font-headline text-4xl font-black leading-none"
           [class.text-primary-container]="powerIndex() > 0"
           [class.text-gray-700]="powerIndex() === 0"
        >
          {{ powerIndex() > 0 ? pad(powerIndex()) : '—' }}
        </p>
        <p class="font-headline text-[9px] text-gray-600 uppercase mt-1">
          Mutant Power attribute
        </p>
      </div>

      <p class="font-body text-xs text-gray-600 leading-relaxed max-w-xs">
        Higher Power Index scores unlock more powerful applications of your mutation.
        The Computer does not know about this value. Keep it that way.
      </p>
    </div>

    <!-- ══════════════════════════ ROLL / REVEAL ══ -->

    @if (!mutation() && !isRolling()) {

      <!-- Unrolled — redacted state -->
      <div class="mb-6 p-8 flex flex-col items-center justify-center gap-4"
           style="background: rgba(19,19,24,0.8); border: 1px dashed rgba(196,30,30,0.3); min-height: 14rem;">
        <div class="text-center">
          <p class="font-headline text-[10px] font-black uppercase tracking-[0.3em] text-gray-700 mb-3">
            Mutation Classification
          </p>
          <p class="font-headline text-4xl font-black uppercase tracking-tighter text-gray-800 select-none mb-1">
            ██████████████
          </p>
          <p class="font-headline text-[10px] text-gray-800 uppercase tracking-widest select-none">
            Type: ████████
          </p>
        </div>
        <p class="font-headline text-[9px] text-gray-700 uppercase tracking-widest mt-2">
          — Roll d20 to reveal your mutation —
        </p>
      </div>

    } @else if (isRolling()) {

      <!-- Rolling state -->
      <div class="mb-6 p-8 flex flex-col items-center justify-center gap-4"
           style="background: rgba(19,19,24,0.8); border: 1px dashed rgba(196,30,30,0.3); min-height: 14rem;">
        <span class="material-symbols-outlined text-primary-container text-5xl dice-spin-slow">casino</span>
        <p class="font-headline text-[10px] font-black uppercase tracking-widest text-primary-container">
          Accessing Classified Records...
        </p>
      </div>

    } @else {

      <!-- Revealed -->
      <div class="mb-6 p-6 reveal-flash"
           style="background: rgba(196,30,30,0.05); border: 1px solid rgba(196,30,30,0.3); border-left: 4px solid #c41e1e;">

        <div class="flex items-start justify-between gap-4 mb-4">
          <div>
            <p class="font-headline text-[9px] font-black uppercase tracking-[0.25em] text-gray-600 mb-2">
              Mutation Assigned
            </p>
            <h2 class="font-headline text-4xl font-black uppercase tracking-tighter leading-none text-primary-container mb-1">
              {{ mutation()!.label }}
            </h2>
          </div>

          <div class="flex flex-col items-end gap-2 shrink-0">
            @if (lastRoll()) {
              <span class="font-headline text-[10px] font-black text-gray-600">
                Roll: {{ lastRoll() }} / 20
              </span>
            }
            <span
              class="font-headline text-[9px] font-black uppercase px-2.5 py-1 tracking-widest"
              [style]="mutation()!.type === 'Psionic'
                ? 'background: rgba(139,92,246,0.15); border: 1px solid rgba(139,92,246,0.4); color: #a78bfa;'
                : 'background: rgba(234,179,8,0.12); border: 1px solid rgba(234,179,8,0.3); color: #ca8a04;'"
            >{{ mutation()!.type }}</span>
          </div>
        </div>

        <p class="font-body text-sm text-gray-400 leading-relaxed">
          {{ mutation()!.description }}
        </p>

      </div>

    }

    <!-- ══════════════════════════ CONTROLS ══ -->
    <div class="flex items-center gap-4 flex-wrap">

      <!-- Roll button -->
      <button
        class="font-headline font-black uppercase px-8 py-4 text-sm flex items-center gap-3
               transition-all active:scale-95 bg-primary-container text-white"
        [class.opacity-70]="isRolling()"
        [class.cursor-not-allowed]="isRolling()"
        (click)="!isRolling() && rollRequested.emit()"
      >
        <span>{{ mutation() ? 'Re-roll Mutation' : 'Roll d20' }}</span>
        <span class="material-symbols-outlined" [class.dice-spin]="isRolling()">casino</span>
      </button>

      <!-- Manual select dropdown -->
      <div class="relative">
        <button
          class="font-headline font-bold uppercase px-6 py-4 text-sm flex items-center gap-2
                 transition-all active:scale-95 text-gray-400 hover:text-on-surface"
          style="border: 1px solid rgba(92,64,61,0.3);"
          (click)="dropdownOpen.update(v => !v)"
          [attr.aria-expanded]="dropdownOpen()"
        >
          <span>Select Manually</span>
          <span class="material-symbols-outlined text-sm transition-transform duration-200"
                [class.rotate-180]="dropdownOpen()">expand_more</span>
        </button>

        @if (dropdownOpen()) {
          <div
            class="absolute bottom-full left-0 mb-1 z-50 bg-surface-container-high w-64 max-h-72 overflow-y-auto shadow-lg"
            style="border: 1px solid rgba(92,64,61,0.2);"
            role="listbox"
          >
            @for (m of allMutations; track m.id) {
              <button
                class="w-full px-4 py-2.5 text-left flex items-center justify-between gap-3
                       hover:bg-surface-container-highest transition-colors"
                [class.bg-surface-container-highest]="mutation()?.id === m.id"
                [style.border-left]="mutation()?.id === m.id ? '3px solid #c41e1e' : '3px solid transparent'"
                role="option"
                [attr.aria-selected]="mutation()?.id === m.id"
                (click)="selectManually(m)"
              >
                <span class="font-headline text-xs font-bold uppercase text-on-surface">{{ m.label }}</span>
                <span class="font-headline text-[8px] uppercase shrink-0"
                      [style.color]="m.type === 'Psionic' ? '#a78bfa' : '#ca8a04'"
                >{{ m.type }}</span>
              </button>
            }
          </div>
        }
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
    .dice-spin { animation: dice-spin 400ms ease-in-out 1; }

    @keyframes dice-spin-slow-anim {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }
    .dice-spin-slow { animation: dice-spin-slow-anim 900ms linear infinite; }

    @keyframes reveal-flash-anim {
      0%   { opacity: 0; transform: translateY(4px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    .reveal-flash { animation: reveal-flash-anim 400ms ease-out forwards; }
  `],
})
export class MutationStepComponent {
  readonly mutationId  = input<string | null>(null);
  readonly isRolling   = input<boolean>(false);
  readonly lastRoll    = input<number | null>(null);
  readonly powerIndex  = input<number>(0);

  readonly rollRequested    = output<void>();
  readonly mutationSelected = output<string>();

  readonly dropdownOpen = signal(false);

  readonly allMutations = PARANOIA_MUTATIONS;

  readonly mutation = computed<MutationDefinition | null>(() => {
    const id = this.mutationId();
    return id ? (MUTATION_BY_ID[id] ?? null) : null;
  });

  pad(n: number): string {
    return n < 10 ? '0' + n : String(n);
  }

  selectManually(m: MutationDefinition): void {
    this.dropdownOpen.set(false);
    this.mutationSelected.emit(m.id);
  }
}
