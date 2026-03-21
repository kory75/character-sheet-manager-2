import { Component, computed, input, output } from '@angular/core';

export type SkillGroup = 'agility' | 'chutzpah' | 'dexterity' | 'mechanical' | 'moxie';

export interface SkillSlot {
  id: string;
  label: string;
  skillGroup: SkillGroup;
  treasonous: boolean;
  base: number;
  value: number;
  max: number;        // 12 normally, 20 for service-group-boosted skills
  isBoosted: boolean;
}

interface GroupSection {
  group: SkillGroup;
  label: string;
  base: number;
  slots: SkillSlot[];
}

const GROUP_ORDER: { group: SkillGroup; label: string }[] = [
  { group: 'agility',    label: 'Agility'    },
  { group: 'chutzpah',   label: 'Chutzpah'   },
  { group: 'dexterity',  label: 'Dexterity'  },
  { group: 'mechanical', label: 'Mechanical' },
  { group: 'moxie',      label: 'Moxie'      },
];

@Component({
  selector: 'app-skills-step',
  template: `
    <!-- ══════════════════════════ POOL TRACKER ══ -->
    <div class="sticky top-0 z-30 pb-4 mb-2 bg-background">
      <div class="bg-surface-container px-5 py-3 flex items-center gap-4"
           style="border-bottom: 2px solid rgba(196,30,30,0.4);">

        <span class="font-headline text-[10px] font-black uppercase tracking-widest text-gray-500 whitespace-nowrap">
          Points Remaining
        </span>

        <span
          class="font-headline text-3xl font-black leading-none transition-colors duration-200"
          [class.text-primary-container]="poolRemaining() > 0"
          [class.text-gray-600]="poolRemaining() === 0"
        >{{ poolRemaining() }}</span>

        <span class="font-headline text-[10px] font-bold text-gray-600">/ 30</span>

        <div class="flex-1 h-1 bg-surface-container-lowest">
          <div
            class="h-full transition-all duration-300"
            [class.bg-primary-container]="poolRemaining() > 5"
            [class.bg-yellow-600]="poolRemaining() > 0 && poolRemaining() <= 5"
            [class.bg-gray-700]="poolRemaining() === 0"
            [style.width]="(poolRemaining() / 30 * 100) + '%'"
          ></div>
        </div>

        @if (poolRemaining() === 0) {
          <span class="font-headline text-[10px] font-bold uppercase tracking-widest text-gray-600">
            FULLY ALLOCATED
          </span>
        }
      </div>
    </div>

    <!-- ══════════════════════════ SKILL GROUPS ══ -->
    <div class="space-y-6">
      @for (group of groupedSlots(); track group.group) {
        <div>

          <!-- Group header -->
          <div class="flex items-baseline gap-3 px-1 mb-1">
            <span class="font-headline text-[11px] font-black uppercase tracking-widest text-on-surface">
              {{ group.label }} Skills
            </span>
            <span class="font-headline text-[10px] text-gray-600 font-bold uppercase">
              — Skill Base {{ group.base }}
            </span>
          </div>

          <!-- Skill rows -->
          <div class="bg-surface-container" style="border: 1px solid rgba(92,64,61,0.12);">
            @for (slot of group.slots; track slot.id; let last = $last) {
              <div
                class="flex items-center gap-3 px-4 py-2.5 transition-colors"
                [class.bg-primary-container/[0.06]]="slot.isBoosted"
                [style.border-bottom]="last ? 'none' : '1px solid rgba(92,64,61,0.1)'"
              >

                <!-- Skill label -->
                <span class="flex-1 font-body text-[13px] leading-tight"
                      [class.text-on-surface]="slot.value > slot.base"
                      [class.text-gray-500]="slot.value === slot.base"
                >{{ slot.label }}</span>

                <!-- Treasonous badge -->
                @if (slot.treasonous) {
                  <span
                    class="font-headline text-[8px] font-black uppercase px-1.5 py-0.5 shrink-0"
                    style="color: #ca8a04; border: 1px solid rgba(202,138,4,0.3); letter-spacing: 0.05em;"
                  >TREASON</span>
                }

                <!-- Boosted indicator -->
                @if (slot.isBoosted) {
                  <span
                    class="font-headline text-[8px] font-black uppercase px-1.5 py-0.5 shrink-0 text-primary-container"
                    style="border: 1px solid rgba(196,30,30,0.3);"
                  >SG</span>
                }

                <!-- Base value -->
                <span class="font-headline text-[10px] text-gray-700 w-10 text-right shrink-0">
                  base {{ slot.base }}
                </span>

                <!-- Value stepper -->
                <div class="flex items-center gap-0 shrink-0">

                  <!-- Minus -->
                  <button
                    class="w-7 h-7 flex items-center justify-center font-black text-sm transition-colors bg-surface-container-highest"
                    style="border: 1px solid rgba(92,64,61,0.15);"
                    [class.text-gray-600]="slot.value > slot.base"
                    [class.text-gray-800]="slot.value <= slot.base"
                    [class.hover:bg-primary-container]="slot.value > slot.base"
                    [class.hover:text-white]="slot.value > slot.base"
                    [class.cursor-not-allowed]="slot.value <= slot.base"
                    [class.opacity-25]="slot.value <= slot.base"
                    (click)="decrement(slot)"
                  >−</button>

                  <!-- Value display -->
                  <span
                    class="font-headline font-black w-8 text-center text-sm"
                    [class.text-primary-container]="slot.value > slot.base"
                    [class.text-gray-600]="slot.value === slot.base"
                  >{{ slot.value }}</span>

                  <!-- Plus -->
                  <button
                    class="w-7 h-7 flex items-center justify-center font-black text-sm transition-colors bg-surface-container-highest"
                    style="border: 1px solid rgba(92,64,61,0.15);"
                    [class.text-gray-600]="canIncrement(slot)"
                    [class.text-gray-800]="!canIncrement(slot)"
                    [class.hover:bg-primary-container]="canIncrement(slot)"
                    [class.hover:text-white]="canIncrement(slot)"
                    [class.cursor-not-allowed]="!canIncrement(slot)"
                    [class.opacity-25]="!canIncrement(slot)"
                    (click)="increment(slot)"
                  >+</button>

                </div>

                <!-- Cap indicator -->
                <span
                  class="font-headline text-[10px] font-bold w-8 text-right shrink-0"
                  [class.text-primary-container]="slot.isBoosted"
                  [class.text-gray-700]="!slot.isBoosted"
                >/{{ slot.max }}</span>

              </div>
            }
          </div>

        </div>
      }
    </div>
  `,
})
export class SkillsStepComponent {
  readonly skillSlots    = input.required<SkillSlot[]>();
  readonly poolRemaining = input.required<number>();

  readonly skillChanged = output<{ id: string; newValue: number }>();

  readonly groupedSlots = computed<GroupSection[]>(() => {
    const slots = this.skillSlots();
    return GROUP_ORDER.map(({ group, label }) => {
      const groupSlots = slots.filter(s => s.skillGroup === group);
      return {
        group,
        label,
        base: groupSlots[0]?.base ?? 0,
        slots: groupSlots,
      };
    });
  });

  canIncrement(slot: SkillSlot): boolean {
    return slot.value < slot.max && this.poolRemaining() > 0;
  }

  increment(slot: SkillSlot): void {
    if (!this.canIncrement(slot)) return;
    this.skillChanged.emit({ id: slot.id, newValue: slot.value + 1 });
  }

  decrement(slot: SkillSlot): void {
    if (slot.value <= slot.base) return;
    this.skillChanged.emit({ id: slot.id, newValue: slot.value - 1 });
  }
}
