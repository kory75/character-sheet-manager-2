import { Component, computed, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CharacterDraftService } from '../../services/character-draft.service';

interface NavClearanceLevel {
  code: string;       // matches CharacterDraftService.clearance() values
  label: string;
  icon: string;
  color: string;      // hex — used for active highlight
  textColor: string;
}

const NAV_CLEARANCE_LEVELS: NavClearanceLevel[] = [
  { code: 'IR', label: 'INFRARED',    icon: 'lock',          color: '#1a1a1f', textColor: '#6b7280' },
  { code: 'R',  label: 'RED',         icon: 'shield',         color: '#c41e1e', textColor: '#ffffff' },
  { code: 'O',  label: 'ORANGE',      icon: 'key',            color: '#c2410c', textColor: '#ffffff' },
  { code: 'Y',  label: 'YELLOW',      icon: 'folder_shared',  color: '#a16207', textColor: '#ffffff' },
  { code: 'G',  label: 'GREEN',       icon: 'policy',         color: '#15803d', textColor: '#ffffff' },
  { code: 'B',  label: 'BLUE',        icon: 'visibility',     color: '#1d4ed8', textColor: '#ffffff' },
  { code: 'I',  label: 'INDIGO',      icon: 'gavel',          color: '#4338ca', textColor: '#ffffff' },
  { code: 'V',  label: 'VIOLET',      icon: 'auto_awesome',   color: '#7e22ce', textColor: '#ffffff' },
  { code: 'UV', label: 'ULTRAVIOLET', icon: 'star',           color: '#e4e1e8', textColor: '#131318' },
];

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <!-- ═══════════════════════════════════════════ TOP BAR ══ -->
    <header class="fixed top-0 w-full z-50 flex justify-between items-center px-6 bg-background h-[3.5rem]"
            style="border-bottom: 1px solid rgba(92,64,61,0.2);">
      <div class="flex items-center gap-4">
        <!-- Brand -->
        <span class="font-headline text-xl font-black uppercase tracking-tighter text-primary-container">
          ALPHA COMPLEX TERMINAL
        </span>
        <div class="h-4 w-px" style="background: rgba(92,64,61,0.3)"></div>
        <span class="font-headline text-[10px] font-bold uppercase text-primary-container/60 hidden md:block">
          SESSION: ID-9921-X
        </span>
      </div>
      <div class="flex items-center gap-4">
        <span class="material-symbols-outlined text-surface-container-highest hover:text-primary-container cursor-pointer transition-colors">
          security
        </span>
        <span class="material-symbols-outlined text-surface-container-highest hover:text-primary-container cursor-pointer transition-colors">
          terminal
        </span>
      </div>
    </header>

    <!-- ═══════════════════════════════════════════ SIDE NAV ══ -->
    <nav class="hidden md:flex fixed left-0 top-0 h-full w-64 z-40 flex-col pt-[3.5rem] bg-background"
         style="transition: border-right-color 0.3s;"
         [style.border-right]="'2px solid ' + activeClearanceColor()"
         aria-label="Clearance levels">

      <!-- Sector / clearance info -->
      <div class="px-6 py-6 mb-2">
        <h2 class="font-headline text-xs font-bold uppercase"
            [style.color]="activeClearanceColor()">
          SECTOR {{ sectorDisplay() }}
        </h2>
        <p class="font-headline text-[10px] uppercase text-gray-500">
          CLEARANCE: {{ activeClearanceLabel() }}
        </p>
      </div>

      <!-- Clearance level list -->
      <div class="flex flex-col w-full flex-1">
        @for (level of clearanceLevels; track level.code) {
          <a
            [routerLink]="['/']"
            class="px-4 py-3 w-full flex items-center gap-3 transition-all cursor-pointer"
            [style.background]="draft.clearance() === level.code ? level.color + '22' : 'transparent'"
            [style.border-left]="draft.clearance() === level.code
              ? '4px solid ' + level.color
              : '4px solid transparent'"
            [style.opacity]="draft.clearance() === level.code ? '1' : '0.45'"
            [style.color]="draft.clearance() === level.code ? level.color : ''"
            [attr.aria-label]="'Clearance level: ' + level.label"
          >
            <span class="material-symbols-outlined text-[18px] transition-colors"
                  [style.color]="draft.clearance() === level.code ? level.color : ''">
              {{ level.icon }}
            </span>
            <span class="font-headline text-[11px] font-bold uppercase tracking-widest">
              {{ level.label }}
            </span>
            @if (draft.clearance() === level.code) {
              <span class="ml-auto material-symbols-outlined text-[14px]"
                    [style.color]="level.color">chevron_right</span>
            }
          </a>
        }
      </div>

      <!-- User profile block -->
      <div class="p-6 flex items-center gap-3 bg-surface-container/30">
        <div class="w-10 h-10 bg-surface-container-highest flex items-center justify-center flex-shrink-0">
          <span class="material-symbols-outlined text-primary-container text-[20px]">person</span>
        </div>
        <div>
          <p class="font-headline text-[10px] font-black uppercase"
             [style.color]="activeClearanceColor()">
            {{ characterName() }}
          </p>
          <p class="text-[9px] text-gray-500 uppercase">UNIT-774-B</p>
        </div>
      </div>
    </nav>

    <!-- ═══════════════════════════════════════════ MAIN CONTENT ══ -->
    <main class="md:ml-64 pt-[3.5rem] pb-16 md:pb-0 min-h-screen bg-surface-container-lowest bureaucracy-grid">
      <router-outlet />
    </main>

    <!-- ═══════════════════════════════════════════ BOTTOM NAV (mobile) ══ -->
    <nav class="md:hidden fixed bottom-0 w-full z-50 flex justify-around bg-background"
         style="border-top: 1px solid rgba(196,30,30,0.2);"
         aria-label="Main navigation">
      @for (item of bottomNavItems; track item.id) {
        <a
          [routerLink]="item.route"
          class="flex flex-col items-center justify-center p-2 min-w-[80px] text-gray-600
                 hover:bg-surface-container transition-colors"
          routerLinkActive="bottom-nav-active"
          [attr.aria-label]="item.label"
        >
          <span class="material-symbols-outlined">{{ item.icon }}</span>
          <span class="font-headline text-[10px] uppercase font-black">{{ item.label }}</span>
        </a>
      }
    </nav>
  `,
  styles: [`
    /* Active bottom nav tab */
    .bottom-nav-active {
      background-color: #c41e1e;
      color: white;
    }
    .bottom-nav-active .material-symbols-outlined {
      color: white;
    }
  `],
})
export class ShellComponent {
  readonly draft = inject(CharacterDraftService);

  readonly clearanceLevels = NAV_CLEARANCE_LEVELS;

  readonly bottomNavItems = [
    { id: 'dossier',   label: 'Dossier',   icon: 'assignment',  route: '/'           },
    { id: 'inventory', label: 'Inventory', icon: 'inventory_2', route: '/inventory'  },
    { id: 'mutations', label: 'Mutations', icon: 'biotech',      route: '/mutations'  },
    { id: 'service',   label: 'Service',   icon: 'psychology',  route: '/service'    },
  ];

  readonly activeClearanceColor = computed(() =>
    NAV_CLEARANCE_LEVELS.find(l => l.code === this.draft.clearance())?.color ?? '#c41e1e'
  );

  readonly activeClearanceLabel = computed(() =>
    NAV_CLEARANCE_LEVELS.find(l => l.code === this.draft.clearance())?.label ?? 'RED'
  );

  readonly sectorDisplay = computed(() =>
    this.draft.sectorCode().trim() || '???'
  );

  readonly characterName = computed(() =>
    this.draft.firstName().trim() || 'TROUBLESHOOTER'
  );
}
