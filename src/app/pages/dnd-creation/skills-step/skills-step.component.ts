import { Component, input, output } from '@angular/core';
import { calcAbilityModifier } from '../../../games/dnd-5e-2024/creation-rules';

interface SkillDef {
  id: string;
  label: string;
  ability: string;
  abbr: string;
}

interface SkillGroup {
  ability: string;
  abbr: string;
  skills: SkillDef[];
}

const SAVING_THROWS = [
  { id: 'strength',     label: 'Strength',     abbr: 'STR' },
  { id: 'dexterity',    label: 'Dexterity',    abbr: 'DEX' },
  { id: 'constitution', label: 'Constitution', abbr: 'CON' },
  { id: 'intelligence', label: 'Intelligence', abbr: 'INT' },
  { id: 'wisdom',       label: 'Wisdom',       abbr: 'WIS' },
  { id: 'charisma',     label: 'Charisma',     abbr: 'CHA' },
];

const SKILL_GROUPS: SkillGroup[] = [
  {
    ability: 'Strength', abbr: 'STR',
    skills: [
      { id: 'athletics', label: 'Athletics', ability: 'strength', abbr: 'STR' },
    ],
  },
  {
    ability: 'Dexterity', abbr: 'DEX',
    skills: [
      { id: 'acrobatics',    label: 'Acrobatics',     ability: 'dexterity', abbr: 'DEX' },
      { id: 'sleightOfHand', label: 'Sleight of Hand', ability: 'dexterity', abbr: 'DEX' },
      { id: 'stealth',       label: 'Stealth',        ability: 'dexterity', abbr: 'DEX' },
    ],
  },
  {
    ability: 'Intelligence', abbr: 'INT',
    skills: [
      { id: 'arcana',        label: 'Arcana',        ability: 'intelligence', abbr: 'INT' },
      { id: 'history',       label: 'History',       ability: 'intelligence', abbr: 'INT' },
      { id: 'investigation', label: 'Investigation', ability: 'intelligence', abbr: 'INT' },
      { id: 'nature',        label: 'Nature',        ability: 'intelligence', abbr: 'INT' },
      { id: 'religion',      label: 'Religion',      ability: 'intelligence', abbr: 'INT' },
    ],
  },
  {
    ability: 'Wisdom', abbr: 'WIS',
    skills: [
      { id: 'animalHandling', label: 'Animal Handling', ability: 'wisdom', abbr: 'WIS' },
      { id: 'insight',        label: 'Insight',         ability: 'wisdom', abbr: 'WIS' },
      { id: 'medicine',       label: 'Medicine',        ability: 'wisdom', abbr: 'WIS' },
      { id: 'perception',     label: 'Perception',      ability: 'wisdom', abbr: 'WIS' },
      { id: 'survival',       label: 'Survival',        ability: 'wisdom', abbr: 'WIS' },
    ],
  },
  {
    ability: 'Charisma', abbr: 'CHA',
    skills: [
      { id: 'deception',    label: 'Deception',    ability: 'charisma', abbr: 'CHA' },
      { id: 'intimidation', label: 'Intimidation', ability: 'charisma', abbr: 'CHA' },
      { id: 'performance',  label: 'Performance',  ability: 'charisma', abbr: 'CHA' },
      { id: 'persuasion',   label: 'Persuasion',   ability: 'charisma', abbr: 'CHA' },
    ],
  },
];

// Flat list used for Select All
const ALL_SKILLS: SkillDef[] = SKILL_GROUPS.flatMap(g => g.skills);

@Component({
  selector: 'app-dnd-skills-step',
  template: `
    <!-- Section header -->
    <div class="mb-6">
      <h2 class="font-headline text-xl font-bold uppercase tracking-widest dnd-gold-bar mb-2"
          style="color: #e6c364;">Hone Your Talents</h2>
      <p class="font-body text-sm italic" style="color: #99907e;">
        "Mark skills and saving throws where you are proficient. Click twice for Expertise (★ = double proficiency)."
      </p>
    </div>

    <div class="dnd-divider mb-6"></div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">

      <!-- ── LEFT: Saving Throws ── -->
      <div>
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-headline text-xs font-bold uppercase tracking-widest dnd-gold-bar"
              style="color: #e6c364;">Saving Throws</h3>
          <div class="flex gap-2">
            <button
              class="font-headline text-[9px] uppercase tracking-widest px-2 py-1 transition-colors hover:brightness-110"
              style="border: 1px solid #4d4637; color: #e6c364; border-radius: 0; background: transparent;"
              (click)="selectAllSaves()"
            >All</button>
            <button
              class="font-headline text-[9px] uppercase tracking-widest px-2 py-1 transition-colors hover:brightness-110"
              style="border: 1px solid #4d4637; color: #99907e; border-radius: 0; background: transparent;"
              (click)="clearAllSaves()"
            >Clear</button>
          </div>
        </div>

        <div class="space-y-1">
          @for (save of savingThrows; track save.id) {
            <div class="flex items-center gap-3 px-2 py-2 transition-colors hover:bg-surface-container cursor-pointer"
                 style="border-bottom: 1px solid rgba(77,70,55,0.3);"
                 (click)="toggleSaveProficiency(save.id)">
              <!-- Checkbox -->
              <div class="w-4 h-4 flex items-center justify-center flex-shrink-0 transition-colors"
                   style="border-radius: 0;"
                   [style.background]="isSaveProficient(save.id) ? '#22c55e' : 'transparent'"
                   [style.border]="isSaveProficient(save.id) ? '1px solid #22c55e' : '1px solid #4d4637'">
                @if (isSaveProficient(save.id)) {
                  <span class="material-symbols-outlined text-white" style="font-size: 10px;">check</span>
                }
              </div>
              <!-- Abbr -->
              <span class="font-headline text-[9px] uppercase tracking-widest w-8 flex-shrink-0"
                    style="color: #99907e;">{{ save.abbr }}</span>
              <!-- Label -->
              <span class="font-body text-xs flex-1"
                    [style.color]="isSaveProficient(save.id) ? '#dde2f2' : '#d0c5b2'">
                {{ save.label }}
              </span>
              <!-- Total -->
              <span class="font-headline text-sm font-bold w-8 text-right"
                    [style.color]="isSaveProficient(save.id) ? '#e6c364' : '#99907e'">
                {{ formatMod(calcSaveTotal(save.id)) }}
              </span>
            </div>
          }
        </div>
      </div>

      <!-- ── RIGHT: Skills ── -->
      <div>
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-headline text-xs font-bold uppercase tracking-widest dnd-gold-bar"
              style="color: #e6c364;">Skills</h3>
          <div class="flex gap-2">
            <button
              class="font-headline text-[9px] uppercase tracking-widest px-2 py-1 transition-colors hover:brightness-110"
              style="border: 1px solid #4d4637; color: #e6c364; border-radius: 0; background: transparent;"
              (click)="selectAllSkills()"
            >All</button>
            <button
              class="font-headline text-[9px] uppercase tracking-widest px-2 py-1 transition-colors hover:brightness-110"
              style="border: 1px solid #4d4637; color: #99907e; border-radius: 0; background: transparent;"
              (click)="clearAllSkills()"
            >Clear</button>
          </div>
        </div>

        <!-- Legend -->
        <div class="flex items-center gap-4 mb-3 px-2">
          <div class="flex items-center gap-1">
            <div class="w-4 h-4 flex items-center justify-center"
                 style="background: #22c55e; border: 1px solid #22c55e; border-radius: 0;">
              <span class="material-symbols-outlined text-white" style="font-size: 10px;">check</span>
            </div>
            <span class="font-headline text-[9px] uppercase" style="color: #99907e;">Proficient</span>
          </div>
          <div class="flex items-center gap-1">
            <div class="w-4 h-4 flex items-center justify-center"
                 style="background: #3d2e00; border: 1px solid #e6c364; border-radius: 0;">
              <span class="material-symbols-outlined" style="font-size: 10px; color: #e6c364;">star</span>
            </div>
            <span class="font-headline text-[9px] uppercase" style="color: #99907e;">Expert (×2)</span>
          </div>
        </div>

        <div class="space-y-3">
          @for (group of skillGroups; track group.ability) {
            <div>
              <!-- Group header -->
              <div class="flex items-center gap-2 mb-1">
                <span class="font-headline text-[8px] uppercase tracking-widest px-2 py-0.5"
                      style="background: #2f3541; color: #99907e; border: 1px solid #4d4637;">
                  {{ group.abbr }}
                </span>
                <span class="font-headline text-[9px] uppercase tracking-wider" style="color: #4d4637;">
                  {{ group.ability }}
                </span>
              </div>

              @for (skill of group.skills; track skill.id) {
                <div class="flex items-center gap-3 px-2 py-2 transition-colors hover:bg-surface-container cursor-pointer"
                     style="border-bottom: 1px solid rgba(77,70,55,0.2);"
                     (click)="cycleSkillState(skill.id)">
                  <!-- State indicator -->
                  <div class="w-4 h-4 flex items-center justify-center flex-shrink-0 transition-all"
                       style="border-radius: 0;"
                       [style.background]="isSkillExpert(skill.id) ? '#3d2e00' : (isSkillProficient(skill.id) ? '#22c55e' : 'transparent')"
                       [style.border]="isSkillExpert(skill.id) ? '1px solid #e6c364' : (isSkillProficient(skill.id) ? '1px solid #22c55e' : '1px solid #4d4637')">
                    @if (isSkillExpert(skill.id)) {
                      <span class="material-symbols-outlined" style="font-size: 10px; color: #e6c364;">star</span>
                    } @else if (isSkillProficient(skill.id)) {
                      <span class="material-symbols-outlined text-white" style="font-size: 10px;">check</span>
                    }
                  </div>

                  <!-- Label -->
                  <span class="font-body text-xs flex-1"
                        [style.color]="isSkillExpert(skill.id) ? '#e6c364' : (isSkillProficient(skill.id) ? '#dde2f2' : '#d0c5b2')">
                    {{ skill.label }}
                  </span>

                  <!-- Total -->
                  <span class="font-headline text-sm font-bold w-8 text-right"
                        [style.color]="isSkillExpert(skill.id) ? '#e6c364' : (isSkillProficient(skill.id) ? '#c9a84c' : '#99907e')">
                    {{ formatMod(calcSkillTotalFor(skill)) }}
                  </span>
                </div>
              }
            </div>
          }
        </div>
      </div>

    </div>
  `,
})
export class DndSkillsStepComponent {
  readonly strength     = input<number>(10);
  readonly dexterity    = input<number>(10);
  readonly constitution = input<number>(10);
  readonly intelligence = input<number>(10);
  readonly wisdom       = input<number>(10);
  readonly charisma     = input<number>(10);
  readonly proficiencyBonus         = input<number>(2);
  readonly skillProficiencies       = input<Record<string, boolean>>({});
  readonly skillExpertise           = input<Record<string, boolean>>({});
  readonly savingThrowProficiencies = input<Record<string, boolean>>({});

  readonly skillProficienciesChanged       = output<Record<string, boolean>>();
  readonly skillExpertiseChanged           = output<Record<string, boolean>>();
  readonly savingThrowProficienciesChanged = output<Record<string, boolean>>();

  readonly savingThrows = SAVING_THROWS;
  readonly skillGroups  = SKILL_GROUPS;

  private getAbilityMod(ability: string): number {
    switch (ability) {
      case 'strength':     return calcAbilityModifier(this.strength());
      case 'dexterity':    return calcAbilityModifier(this.dexterity());
      case 'constitution': return calcAbilityModifier(this.constitution());
      case 'intelligence': return calcAbilityModifier(this.intelligence());
      case 'wisdom':       return calcAbilityModifier(this.wisdom());
      case 'charisma':     return calcAbilityModifier(this.charisma());
      default:             return 0;
    }
  }

  isSkillProficient(id: string): boolean { return !!this.skillProficiencies()[id]; }
  isSkillExpert(id: string):     boolean { return !!this.skillExpertise()[id]; }
  isSaveProficient(id: string):  boolean { return !!this.savingThrowProficiencies()[id]; }

  calcSkillTotalFor(skill: SkillDef): number {
    const mod = this.getAbilityMod(skill.ability);
    const prof = this.proficiencyBonus();
    if (this.isSkillExpert(skill.id))     return mod + prof * 2;
    if (this.isSkillProficient(skill.id)) return mod + prof;
    return mod;
  }

  calcSaveTotal(abilityId: string): number {
    const mod = this.getAbilityMod(abilityId);
    return this.isSaveProficient(abilityId) ? mod + this.proficiencyBonus() : mod;
  }

  formatMod(n: number): string { return n >= 0 ? `+${n}` : `${n}`; }

  // Cycle: none → proficient → expert → none
  cycleSkillState(id: string): void {
    const prof = { ...this.skillProficiencies() };
    const exp  = { ...this.skillExpertise() };

    if (exp[id]) {
      // expert → none
      delete prof[id];
      delete exp[id];
    } else if (prof[id]) {
      // proficient → expert
      exp[id] = true;
    } else {
      // none → proficient
      prof[id] = true;
    }

    this.skillProficienciesChanged.emit(prof);
    this.skillExpertiseChanged.emit(exp);
  }

  toggleSaveProficiency(id: string): void {
    const current = { ...this.savingThrowProficiencies() };
    if (current[id]) delete current[id];
    else current[id] = true;
    this.savingThrowProficienciesChanged.emit(current);
  }

  selectAllSkills(): void {
    const all: Record<string, boolean> = {};
    for (const skill of ALL_SKILLS) all[skill.id] = true;
    this.skillProficienciesChanged.emit(all);
  }

  clearAllSkills(): void {
    this.skillProficienciesChanged.emit({});
    this.skillExpertiseChanged.emit({});
  }

  selectAllSaves(): void {
    const all: Record<string, boolean> = {};
    for (const save of SAVING_THROWS) all[save.id] = true;
    this.savingThrowProficienciesChanged.emit(all);
  }

  clearAllSaves(): void {
    this.savingThrowProficienciesChanged.emit({});
  }
}
