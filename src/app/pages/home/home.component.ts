import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface DossierCard {
  system: string;
  systemColor: string;
  name: string;
  statLine: string;
}

interface SynthesizerCard {
  system: string;
  edition: string;
  icon: string;
  flavour: string;
  accentColor: string;
  route: string | null;
}

const DOSSIER_CARDS: DossierCard[] = [
  { system: 'PARANOIA 2E',       systemColor: '#c41e1e', name: 'REX-R-GHQ-1',       statLine: 'CLEARANCE: RED' },
  { system: 'D&D 5E',            systemColor: '#fa8840', name: 'AELINDRA NIGHTVEIL', statLine: 'LEVEL 8 ELF ROGUE' },
  { system: 'PARANOIA 2E',       systemColor: '#c41e1e', name: 'ZIP-O-CRL-3',        statLine: 'CLEARANCE: RED' },
  { system: 'D&D 5E',            systemColor: '#fa8840', name: 'GORVIN ASHMANTLE',   statLine: 'LEVEL 4 DWARF CLERIC' },
  { system: 'WARHAMMER FANTASY', systemColor: '#99907b', name: 'BROTHER VAREK',      statLine: 'DWARF SLAYER · REGIMENT III' },
];

const SYNTHESIZER_CARDS: SynthesizerCard[] = [
  {
    system: 'PARANOIA',
    edition: '2ND EDITION',
    icon: 'psychology',
    flavour: 'Generate a citizen for Alpha Complex. Assign clearance, service group, and mandatory treason.',
    accentColor: '#c41e1e',
    route: '/paranoia',
  },
  {
    system: 'DUNGEONS & DRAGONS',
    edition: '5TH EDITION',
    icon: 'auto_awesome',
    flavour: 'Roll your hero. Race, class, background, ability scores, and starting equipment.',
    accentColor: '#fa8840',
    route: null,
  },
  {
    system: 'WARHAMMER FANTASY',
    edition: 'ROLEPLAY',
    icon: 'military_tech',
    flavour: 'Build a character for the grim Old World. Career, skills, and wounds await.',
    accentColor: '#99907b',
    route: null,
  },
];

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <!-- Fixed header -->
    <header
      class="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6"
      style="height:52px; background:#1b1b20; border-bottom:1px solid rgba(236,194,70,0.15);"
    >
      <span class="text-sm font-black tracking-[0.2em]" style="color:#ecc246;">
        ◆ CODEX
      </span>
      <div class="flex items-center gap-2">
        <button
          class="p-2 rounded transition-colors hover:bg-white/5"
          style="color:#99907b;"
          aria-label="Profile"
        >
          <span class="material-symbols-outlined text-xl">person_outline</span>
        </button>
        <button
          class="p-2 rounded transition-colors hover:bg-white/5"
          style="color:#99907b;"
          aria-label="Settings"
        >
          <span class="material-symbols-outlined text-xl">settings</span>
        </button>
      </div>
    </header>

    <main class="pt-[52px]">

      <!-- VAULT HERO -->
      <section class="relative flex flex-col items-center justify-center text-center px-6 py-20" style="min-height:420px;">

        <!-- Corner L-brackets -->
        <span
          class="absolute top-8 left-8 w-6 h-6 block"
          style="border-top:2px solid #ecc246; border-left:2px solid #ecc246;"
        ></span>
        <span
          class="absolute top-8 right-8 w-6 h-6 block"
          style="border-top:2px solid #ecc246; border-right:2px solid #ecc246;"
        ></span>
        <span
          class="absolute bottom-8 left-8 w-6 h-6 block"
          style="border-bottom:2px solid #ecc246; border-left:2px solid #ecc246;"
        ></span>
        <span
          class="absolute bottom-8 right-8 w-6 h-6 block"
          style="border-bottom:2px solid #ecc246; border-right:2px solid #ecc246;"
        ></span>

        <!-- Eyebrow -->
        <p class="text-xs font-bold tracking-[0.25em] mb-6" style="color:#99907b;">
          CHARACTER ARCHIVE // v0.1
        </p>

        <!-- Headline -->
        <h1 class="text-7xl font-black tracking-tight leading-none mb-4">
          <span class="text-white">THE </span>
          <span style="color:#ecc246;">CODEX</span>
        </h1>

        <!-- Subtitle -->
        <p class="text-base max-w-sm" style="color:#99907b;">
          Build, store, and print characters for tabletop RPGs.
        </p>

        <!-- Decorative rule -->
        <div class="flex items-center gap-3 mt-8">
          <span class="h-px w-16 block" style="background:linear-gradient(to right, transparent, #ecc246);"></span>
          <span style="color:#ecc246;" class="text-xs">◆</span>
          <span class="h-px w-16 block" style="background:linear-gradient(to left, transparent, #ecc246);"></span>
        </div>
      </section>

      <!-- ACTIVE DOSSIERS -->
      <section class="px-6 pb-12">
        <!-- Section header -->
        <div class="flex items-center gap-3 mb-6">
          <span class="material-symbols-outlined text-lg" style="color:#ecc246;">folder_open</span>
          <span class="text-xs font-bold tracking-[0.2em] text-on-surface">ACTIVE DOSSIERS</span>
          <span
            class="text-xs font-bold px-2 py-0.5 rounded"
            style="background:#2a292f; color:#99907b;"
          >{{ dossierCards.length }}</span>
          <div class="flex items-center gap-1 ml-auto">
            <button
              class="p-1.5 rounded transition-colors hover:bg-white/5"
              style="color:#99907b;"
              aria-label="Scroll left"
              (click)="scroll(dossierTrack, 'left')"
            >
              <span class="material-symbols-outlined text-base">chevron_left</span>
            </button>
            <button
              class="p-1.5 rounded transition-colors hover:bg-white/5"
              style="color:#99907b;"
              aria-label="Scroll right"
              (click)="scroll(dossierTrack, 'right')"
            >
              <span class="material-symbols-outlined text-base">chevron_right</span>
            </button>
          </div>
        </div>

        <!-- Scroll track -->
        <div
          #dossierTrack
          class="flex gap-6 overflow-x-auto no-scrollbar pb-2"
        >
          <!-- Dossier cards -->
          @for (card of dossierCards; track card.name) {
            <div
              class="flex-shrink-0 bg-surface-container rounded-lg p-5 flex flex-col justify-between"
              style="min-width:300px; height:180px;"
              [style.border-left]="'3px solid ' + card.systemColor"
            >
              <div>
                <p class="text-[10px] font-bold tracking-[0.2em] mb-2" [style.color]="card.systemColor">
                  {{ card.system }}
                </p>
                <p class="text-base font-bold text-on-surface tracking-wide">{{ card.name }}</p>
                <p class="text-xs mt-1" style="color:#99907b;">{{ card.statLine }}</p>
              </div>
              <div class="flex justify-end">
                <span class="material-symbols-outlined text-base" style="color:#99907b;">visibility</span>
              </div>
            </div>
          }

          <!-- Ghost "NEW DOSSIER" card -->
          <div
            class="flex-shrink-0 rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors hover:bg-white/5"
            style="min-width:300px; height:180px; border:1px dashed rgba(236,194,70,0.3);"
          >
            <span class="material-symbols-outlined text-2xl" style="color:rgba(236,194,70,0.5);">add</span>
            <p class="text-xs font-bold tracking-[0.2em]" style="color:rgba(236,194,70,0.5);">NEW DOSSIER</p>
          </div>
        </div>
      </section>

      <!-- CHARACTER SYNTHESIZERS -->
      <section class="px-6 pb-16">
        <!-- Section header -->
        <div class="flex items-center gap-3 mb-6">
          <span class="material-symbols-outlined text-lg" style="color:#ecc246;">casino</span>
          <span class="text-xs font-bold tracking-[0.2em] text-on-surface">CHARACTER SYNTHESIZERS</span>
          <span class="text-xs ml-auto" style="color:#99907b;">SELECT A SYSTEM</span>
        </div>

        <!-- Synth grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          @for (card of synthCards; track card.system) {
            <div
              class="bg-surface-container-low rounded-lg p-6 flex flex-col gap-4 relative"
              [style.border-top]="'3px solid ' + card.accentColor"
            >
              <!-- Corner L-bracket -->
              <span
                class="absolute bottom-4 right-4 w-4 h-4 block"
                [style]="'border-bottom:1px solid ' + card.accentColor + '; border-right:1px solid ' + card.accentColor + ';'"
              ></span>

              <!-- Icon -->
              <span class="material-symbols-outlined text-4xl" [style.color]="card.accentColor">
                {{ card.icon }}
              </span>

              <!-- System name + edition -->
              <div>
                <p class="text-lg font-black tracking-wide text-white">{{ card.system }}</p>
                <p class="text-xs font-bold tracking-[0.2em] mt-0.5" [style.color]="card.accentColor">
                  {{ card.edition }}
                </p>
              </div>

              <!-- Flavour -->
              <p class="text-sm leading-relaxed flex-1" style="color:#99907b;">{{ card.flavour }}</p>

              <!-- CTA -->
              @if (card.route) {
                <a
                  [routerLink]="card.route"
                  class="inline-flex items-center justify-center gap-2 px-4 py-2 rounded text-xs font-bold tracking-[0.15em] transition-opacity hover:opacity-80"
                  [style.background]="card.accentColor"
                  style="color:#fff;"
                >
                  CREATE CHARACTER
                  <span class="material-symbols-outlined text-sm">arrow_forward</span>
                </a>
              } @else {
                <button
                  disabled
                  class="inline-flex items-center justify-center gap-2 px-4 py-2 rounded text-xs font-bold tracking-[0.15em] cursor-not-allowed"
                  style="border:1px solid rgba(255,255,255,0.15); color:rgba(255,255,255,0.3);"
                >
                  COMING SOON
                </button>
              }
            </div>
          }
        </div>
      </section>

    </main>

    <!-- Footer -->
    <footer class="px-6 py-4 flex items-center justify-center">
      <p class="text-xs tracking-[0.15em]" style="color:#99907b;">
        CODEX · CHARACTER ARCHIVE · v0.1
      </p>
    </footer>
  `,
})
export class HomeComponent {
  readonly dossierCards = DOSSIER_CARDS;
  readonly synthCards = SYNTHESIZER_CARDS;

  scroll(track: HTMLElement, dir: 'left' | 'right'): void {
    track.scrollBy({ left: dir === 'left' ? -316 : 316, behavior: 'smooth' });
  }
}
