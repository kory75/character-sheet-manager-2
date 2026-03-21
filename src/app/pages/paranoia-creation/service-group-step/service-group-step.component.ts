import { Component, computed, input, output, signal } from '@angular/core';
import {
  PARANOIA_SERVICE_GROUPS,
  SERVICE_GROUP_BY_ID,
  ServiceGroupDefinition,
} from '../../../games/paranoia-2e/data/service-groups.data';

function formatSkillId(id: string): string {
  return id.replace(/^skill_/, '').replace(/_/g, ' ').toUpperCase();
}

@Component({
  selector: 'app-service-group-step',
  template: `
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

      <!-- ══════════════════════════════ LEFT: Selector ══ -->
      <div class="lg:col-span-1">

        <!-- Label row -->
        <div class="flex items-center justify-between mb-3">
          <span class="font-headline text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            Service Group
          </span>
          <button
            class="p-1.5 bg-surface-container-highest hover:bg-primary-container
                   text-primary-container hover:text-white transition-colors"
            [class.opacity-50]="isRolling()"
            [class.cursor-not-allowed]="isRolling()"
            [attr.aria-label]="'Roll random service group'"
            (click)="!isRolling() && rollRequested.emit()"
          >
            <span
              class="material-symbols-outlined text-base"
              [class.dice-spin]="isRolling()"
            >casino</span>
          </button>
        </div>

        <!-- Dropdown trigger -->
        <div class="relative">
          <button
            class="w-full bg-surface-container px-4 py-3 flex items-center justify-between
                   text-left transition-colors hover:bg-surface-container-high"
            style="border: 1px solid rgba(92,64,61,0.15);"
            [class.border-primary-container]="dropdownOpen()"
            [attr.aria-haspopup]="'listbox'"
            [attr.aria-expanded]="dropdownOpen()"
            (click)="dropdownOpen.update(v => !v)"
          >
            <div class="flex-1 min-w-0 pr-3">
              @if (selected()) {
                <span class="font-headline text-sm font-bold text-on-surface block truncate">
                  {{ selected()!.label }}
                </span>
                <span class="font-body text-xs text-gray-500 block truncate mt-0.5">
                  {{ selected()!.provides }}
                </span>
              } @else {
                <span class="font-body text-sm text-gray-600">
                  Select service group…
                </span>
              }
            </div>
            <span
              class="material-symbols-outlined text-gray-500 flex-shrink-0 transition-transform duration-200"
              [class.rotate-180]="dropdownOpen()"
            >expand_more</span>
          </button>

          <!-- Dropdown panel -->
          @if (dropdownOpen()) {
            <div
              class="absolute top-full left-0 right-0 z-50 bg-surface-container-high
                     max-h-72 overflow-y-auto shadow-lg"
              style="border: 1px solid rgba(92,64,61,0.2); border-top: none;"
              role="listbox"
            >
              @for (group of groups; track group.id) {
                <button
                  class="w-full px-4 py-3 text-left transition-colors
                         hover:bg-surface-container-highest flex flex-col gap-1"
                  [class.bg-surface-container-highest]="selected()?.id === group.id"
                  [style.border-left]="selected()?.id === group.id ? '3px solid #c41e1e' : '3px solid transparent'"
                  role="option"
                  [attr.aria-selected]="selected()?.id === group.id"
                  (click)="select(group)"
                >
                  <span class="font-headline text-xs font-bold text-on-surface uppercase">
                    {{ group.label }}
                  </span>
                  <span class="font-body text-[10px] text-gray-500 line-clamp-2">
                    {{ group.description }}
                  </span>
                </button>
              }
            </div>
          }
        </div>

        <!-- Roll result badge -->
        @if (lastRoll()) {
          <div class="mt-3 flex items-center gap-2">
            <span class="font-headline text-[10px] text-gray-500 uppercase">Roll result:</span>
            <span class="font-headline text-xs font-bold text-primary-container">
              {{ lastRoll() }} / 20
            </span>
          </div>
        }

      </div>

      <!-- ══════════════════════════════ RIGHT: Detail panel ══ -->
      <div class="lg:col-span-2">
        @if (selected(); as sg) {
          <div class="bg-surface-container p-6 h-full"
               style="border-bottom: 4px solid #c41e1e;">

            <div class="mb-5">
              <h3 class="font-headline text-2xl font-black uppercase tracking-tighter text-on-surface">
                {{ sg.label }}
              </h3>
              <span class="font-headline text-[10px] text-primary-container uppercase tracking-widest font-bold">
                d20: {{ sg.d20Min }}–{{ sg.d20Max }}
              </span>
            </div>

            <p class="font-body text-sm text-gray-400 leading-relaxed mb-6">
              {{ sg.description }}
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p class="font-headline text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                  Provides
                </p>
                <p class="font-body text-sm text-on-surface">{{ sg.provides }}</p>
              </div>
              <div>
                <p class="font-headline text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                  Skills boosted to max 20
                </p>
                <div class="flex flex-wrap gap-1.5">
                  @for (skillId of sg.skillIds; track skillId) {
                    <span
                      class="font-headline text-[10px] font-bold uppercase px-2 py-0.5
                             bg-primary-container/20 text-primary-container"
                      style="border: 1px solid rgba(196,30,30,0.3);"
                    >{{ formatSkill(skillId) }}</span>
                  }
                </div>
              </div>
            </div>

          </div>
        } @else {
          <div class="bg-surface-container-lowest h-full flex items-center justify-center p-12"
               style="border: 1px solid rgba(92,64,61,0.1);">
            <div class="text-center">
              <span class="material-symbols-outlined text-4xl text-gray-700 block mb-3">corporate_fare</span>
              <p class="font-headline text-xs uppercase tracking-widest text-gray-600">
                Select or roll a service group
              </p>
            </div>
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
  `],
})
export class ServiceGroupStepComponent {
  // ── Inputs from parent (parent owns all roll state) ───────────────────────
  readonly serviceGroupId = input<string | null>(null);
  readonly isRolling      = input<boolean>(false);
  readonly lastRoll       = input<number | null>(null);

  // ── Outputs ───────────────────────────────────────────────────────────────
  readonly groupSelected  = output<string>();
  readonly rollRequested  = output<void>();  // manual dice button click

  // ── Local UI state (dropdown only) ───────────────────────────────────────
  readonly dropdownOpen = signal(false);

  readonly groups = PARANOIA_SERVICE_GROUPS;

  readonly selected = computed<ServiceGroupDefinition | null>(() => {
    const id = this.serviceGroupId();
    return id ? (SERVICE_GROUP_BY_ID[id] ?? null) : null;
  });

  formatSkill = formatSkillId;

  select(group: ServiceGroupDefinition): void {
    this.dropdownOpen.set(false);
    this.groupSelected.emit(group.id);
  }
}
