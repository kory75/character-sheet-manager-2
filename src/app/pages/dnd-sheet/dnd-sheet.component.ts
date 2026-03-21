import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DndDraftService, DndSnapshot } from '../../services/dnd-draft.service';
import { calcSkillTotal, calcSavingThrow } from '../../games/dnd-5e-2024/creation-rules';

interface SkillRow {
  id: string;
  label: string;
  ability: string;
}

const SKILL_ROWS: SkillRow[] = [
  { id: 'acrobatics',    label: 'Acrobatics',     ability: 'dexterity'    },
  { id: 'animalHandling',label: 'Animal Handling', ability: 'wisdom'       },
  { id: 'arcana',        label: 'Arcana',          ability: 'intelligence' },
  { id: 'athletics',     label: 'Athletics',       ability: 'strength'     },
  { id: 'deception',     label: 'Deception',       ability: 'charisma'     },
  { id: 'history',       label: 'History',         ability: 'intelligence' },
  { id: 'insight',       label: 'Insight',         ability: 'wisdom'       },
  { id: 'intimidation',  label: 'Intimidation',    ability: 'charisma'     },
  { id: 'investigation', label: 'Investigation',   ability: 'intelligence' },
  { id: 'medicine',      label: 'Medicine',        ability: 'wisdom'       },
  { id: 'nature',        label: 'Nature',          ability: 'intelligence' },
  { id: 'perception',    label: 'Perception',      ability: 'wisdom'       },
  { id: 'performance',   label: 'Performance',     ability: 'charisma'     },
  { id: 'persuasion',    label: 'Persuasion',      ability: 'charisma'     },
  { id: 'religion',      label: 'Religion',        ability: 'intelligence' },
  { id: 'sleightOfHand', label: 'Sleight of Hand', ability: 'dexterity'    },
  { id: 'stealth',       label: 'Stealth',         ability: 'dexterity'    },
  { id: 'survival',      label: 'Survival',        ability: 'wisdom'       },
];

const SAVING_THROW_ROWS = [
  { id: 'strength',     label: 'Strength',     abbr: 'STR' },
  { id: 'dexterity',    label: 'Dexterity',    abbr: 'DEX' },
  { id: 'constitution', label: 'Constitution', abbr: 'CON' },
  { id: 'intelligence', label: 'Intelligence', abbr: 'INT' },
  { id: 'wisdom',       label: 'Wisdom',       abbr: 'WIS' },
  { id: 'charisma',     label: 'Charisma',     abbr: 'CHA' },
];

const ABILITY_LABELS: Record<string, string> = {
  strength: 'STR', dexterity: 'DEX', constitution: 'CON',
  intelligence: 'INT', wisdom: 'WIS', charisma: 'CHA',
};

@Component({
  selector: 'app-dnd-sheet',
  imports: [RouterLink],
  template: `
  <div class="theme-dnd5e min-h-screen relative" style="background: #0d131e;">

    <!-- Dragon watermark -->
    <div class="dnd-watermark fixed bottom-[5%] right-[-3%] w-[500px] h-[500px] pointer-events-none z-0"
         style="opacity: 0.025;" aria-hidden="true">
      <svg viewBox="0 0 100 100" fill="#e6c364" xmlns="http://www.w3.org/2000/svg">
        <text x="10" y="80" style="font-size: 80px;">🐉</text>
      </svg>
    </div>

    <div class="relative z-10">

      @if (!snap()) {
        <!-- ══ NO SNAPSHOT STATE ══ -->
        <div class="flex flex-col items-center justify-center min-h-screen text-center px-8">
          <span class="material-symbols-outlined text-6xl mb-4" style="color: #4d4637;">menu_book</span>
          <h2 class="font-headline text-lg font-bold uppercase tracking-widest mb-2"
              style="color: #e6c364;">No Character Found</h2>
          <p class="font-headline text-[10px] uppercase tracking-widest mb-8"
             style="color: #4d4637;">Complete the Character Creator to generate your hero's ledger.</p>
          <a routerLink="/dnd"
             class="font-headline font-bold uppercase px-8 py-4 text-sm transition-all hover:brightness-110"
             style="background: linear-gradient(45deg, #e6c364, #c9a84c); color: #3d2e00; border-radius: 0;">
            ← Create a Character
          </a>
        </div>

      } @else {

        <!-- ══ PRINT CONTROLS ══ -->
        <div class="print-hide flex items-center gap-4 px-8 py-4"
             style="border-bottom: 1px solid #4d4637;">
          <a routerLink="/"
             class="font-headline font-bold uppercase text-[10px] tracking-widest px-5 py-3
                    flex items-center gap-2 transition-colors"
             style="border: 1px solid #4d4637; color: #99907e; border-radius: 0;">
            <span class="material-symbols-outlined text-sm">home</span>
            <span>HOME</span>
          </a>
          <a routerLink="/dnd"
             class="font-headline font-bold uppercase text-[10px] tracking-widest px-5 py-3
                    flex items-center gap-2 transition-colors"
             style="border: 1px solid #4d4637; color: #99907e; border-radius: 0;">
            <span class="material-symbols-outlined text-sm">edit</span>
            <span>EDIT</span>
          </a>
          <button
            class="font-headline font-bold uppercase text-[10px] tracking-widest px-5 py-3
                   flex items-center gap-2 transition-colors"
            style="border: 1px solid #4d4637; color: #99907e; border-radius: 0;"
            onclick="window.print()"
          >
            <span class="material-symbols-outlined text-sm">print</span>
            <span>PRINT SHEET</span>
          </button>
        </div>

        <!-- ══ CLASS / LEVEL BANNER ══ -->
        <section class="w-full px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4 print-panel"
                 style="background: linear-gradient(to right, #080e19, #161c27, #080e19);
                        border-top: 0.5px solid #e6c364; border-bottom: 0.5px solid #e6c364;">
          <div class="flex items-center gap-6">
            <div class="w-14 h-14 border flex items-center justify-center"
                 style="border: 1px solid rgba(230,195,100,0.2); background: #1a202b;">
              <span class="material-symbols-outlined text-3xl" style="color: #e6c364;">shield_with_heart</span>
            </div>
            <div>
              <h1 class="font-headline text-3xl font-bold uppercase tracking-wider"
                  style="color: #dde2f2;">{{ snap()!.characterName || 'Unnamed Adventurer' }}</h1>
              <p class="font-headline tracking-widest uppercase text-sm mt-0.5" style="color: #e6c364;">
                {{ toTitleCase(snap()!.characterClass) }}
                @if (snap()!.subclass) { · {{ snap()!.subclass }} }
                · Level {{ snap()!.characterLevel }}
              </p>
            </div>
          </div>
          <!-- Proficiency badge -->
          <div class="px-4 py-2 font-headline text-sm font-bold uppercase tracking-wider"
               style="background: #e6c364; color: #3d2e00;">
            +{{ snap()!.proficiencyBonus }} PROF BONUS
          </div>
        </section>

        <!-- ══ MAIN LAYOUT ══ -->
        <div class="flex flex-col lg:flex-row gap-0 min-h-screen">

          <!-- ── LEFT SIDEBAR (~280px) ── -->
          <aside class="w-full lg:w-[280px] flex-shrink-0 space-y-0"
                 style="background: #161c27;">

            <!-- Identity Card -->
            <div class="stat-box p-5 relative" style="background: #161c27;">
              <div class="dnd-flourish-tl"></div>
              <div class="dnd-flourish-tr"></div>
              <h3 class="font-headline text-xs uppercase tracking-widest mb-4"
                  style="color: #e6c364;">Identity</h3>
              <div class="dnd-identity-fields space-y-3">
                @for (field of identityFields(); track field.label) {
                  <div>
                    <p class="font-headline text-[9px] uppercase tracking-widest mb-0.5"
                       style="color: #4d4637;">{{ field.label }}</p>
                    <p class="font-body text-sm" style="color: #d0c5b2;">{{ field.value || '—' }}</p>
                  </div>
                  <div class="dnd-divider"></div>
                }
              </div>
            </div>

            <div class="dnd-combat-saves-group">

            <!-- Combat Overview Card -->
            <div class="dnd-stat-box p-5 relative mt-0" style="background: #161c27;">
              <div class="dnd-flourish-tl"></div>
              <div class="dnd-flourish-tr"></div>
              <h3 class="font-headline text-xs uppercase tracking-widest mb-4"
                  style="color: #e6c364;">Combat Overview</h3>

              <!-- AC big display -->
              <div class="flex items-center gap-4 mb-4">
                <div class="text-center p-4" style="background: #2f3541; border-left: 2px solid #e6c364;">
                  <p class="font-headline text-[9px] uppercase" style="color: #99907e;">AC</p>
                  <p class="font-headline text-3xl font-bold" style="color: #e6c364;">{{ snap()!.armorClass }}</p>
                </div>
                <!-- HP very large -->
                <div class="text-center flex-1">
                  <p class="font-headline text-[9px] uppercase" style="color: #99907e;">Max HP</p>
                  <p class="font-headline font-bold" style="font-size: 2.5rem; color: #dde2f2;">{{ snap()!.maxHitPoints }}</p>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3 mb-4">
                <div class="p-3 text-center" style="background: #242a36;">
                  <p class="font-headline text-[9px] uppercase mb-1" style="color: #99907e;">Initiative</p>
                  <p class="font-headline text-lg font-bold" style="color: #dde2f2;">{{ formatMod(snap()!.initiative) }}</p>
                </div>
                <div class="p-3 text-center" style="background: #242a36;">
                  <p class="font-headline text-[9px] uppercase mb-1" style="color: #99907e;">Speed</p>
                  <p class="font-headline text-lg" style="color: #dde2f2;">{{ snap()!.speed }}</p>
                </div>
                <div class="p-3 text-center" style="background: #242a36;">
                  <p class="font-headline text-[9px] uppercase mb-1" style="color: #99907e;">Hit Dice</p>
                  <p class="font-headline text-lg" style="color: #dde2f2;">{{ snap()!.hitDice }}</p>
                </div>
                <div class="p-3 text-center" style="background: #242a36;">
                  <p class="font-headline text-[9px] uppercase mb-1" style="color: #99907e;">Species</p>
                  <p class="font-headline text-sm uppercase" style="color: #dde2f2;">{{ snap()!.species || '—' }}</p>
                </div>
              </div>
            </div>

            <!-- Saving Throws Card -->
            <div class="dnd-stat-box p-5 relative mt-0" style="background: #161c27;">
              <div class="dnd-flourish-tl"></div>
              <div class="dnd-flourish-tr"></div>
              <h3 class="font-headline text-xs uppercase tracking-widest mb-4"
                  style="color: #e6c364;">Saving Throws</h3>
              <div class="space-y-2">
                @for (save of savingThrowRows; track save.id) {
                  <div class="flex items-center gap-3">
                    <!-- Proficiency indicator -->
                    <div
                      class="w-4 h-4 flex-shrink-0"
                      [style.background]="isSaveProficient(save.id) ? 'rgba(230,195,100,0.15)' : 'transparent'"
                      [style.border]="isSaveProficient(save.id) ? '1px solid rgba(230,195,100,0.4)' : '1px solid #4d4637'"
                    ></div>
                    <span class="font-headline text-[9px] uppercase tracking-widest flex-1"
                          style="color: #d0c5b2;">{{ save.label }}</span>
                    <span class="font-headline text-sm font-bold"
                          [style.color]="isSaveProficient(save.id) ? '#e6c364' : '#99907e'">
                      {{ formatMod(calcSaveValue(save.id)) }}
                    </span>
                  </div>
                }
              </div>
            </div>

            </div><!-- /dnd-combat-saves-group -->

            <!-- Long Rest button -->
            <div class="p-4 print-hide" style="background: #161c27;">
              <button
                class="w-full py-4 font-headline font-bold uppercase tracking-widest text-sm transition-all hover:brightness-110"
                style="background: linear-gradient(to bottom right, #e6c364, #c9a84c); color: #3d2e00; border-radius: 0;"
              >Long Rest</button>
            </div>

          </aside>

          <!-- ── MAIN PANEL ── -->
          <main class="flex-1 p-6 space-y-8" style="background: #0d131e;">

            <!-- Ability Scores 2x3 grid -->
            <section class="print-panel">
              <div class="dnd-ability-grid grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
                @for (ab of abilityBlocks(); track ab.key) {
                  <div class="dnd-stat-box p-4 text-center group" style="background: #2f3541; border-radius: 0;">
                    <p class="font-headline text-[10px] uppercase tracking-widest mb-1" style="color: #e6c364;">
                      {{ ab.label }}
                    </p>
                    <div class="flex items-center justify-center gap-1">
                      <span class="font-headline text-3xl font-bold" style="color: #dde2f2;">{{ ab.score }}</span>
                    </div>
                    <div class="mt-2 font-headline text-sm" style="color: #d1c5b2;">
                      ({{ formatMod(ab.mod) }})
                    </div>
                  </div>
                }
              </div>
            </section>

            <!-- Skills -->
            <section class="print-panel dnd-stat-box p-6 relative" style="background: #161c27; border-radius: 0;">
              <div class="dnd-flourish-tl"></div>
              <div class="dnd-flourish-br"></div>
              <h3 class="font-headline text-sm uppercase tracking-widest mb-4" style="color: #e6c364;">Skills</h3>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-1.5">
                @for (skill of skillRows; track skill.id) {
                  <div class="flex items-center justify-between text-[11px]">
                    <span class="font-body uppercase tracking-wider flex-1"
                          [style.color]="isSkillProficient(skill.id) ? '#dde2f2' : '#99907e'">
                      {{ skill.label }}
                    </span>
                    <span class="font-headline font-bold ml-2"
                          [style.color]="isSkillProficient(skill.id) ? '#e6c364' : '#99907e'">
                      {{ formatMod(calcSkillValue(skill)) }}
                    </span>
                  </div>
                }
              </div>
            </section>

            <!-- Spellcasting -->
            @if (hasSpellcasting()) {
              <section class="print-panel dnd-stat-box p-6 relative overflow-hidden" style="background: #161c27; border-radius: 0;">
                <div class="dnd-flourish-tl" style="opacity: 0.5;"></div>
                <div class="dnd-flourish-tr" style="opacity: 0.5;"></div>
                <div class="dnd-flourish-bl" style="opacity: 0.5;"></div>
                <div class="dnd-flourish-br" style="opacity: 0.5;"></div>

                <div class="flex items-center gap-4 mb-6">
                  <h3 class="font-headline text-xl uppercase tracking-[0.2rem]" style="color: #e6c364;">Spellcasting</h3>
                  <div class="flex-1 h-px" style="background: linear-gradient(to right, rgba(230,195,100,0.4), transparent);"></div>
                  <div class="text-right">
                    <p class="font-headline text-[9px] uppercase tracking-tighter" style="color: #d0c5b2;">Spell Save DC</p>
                    <p class="font-headline text-xl" style="color: #e6c364;">{{ snap()!.spellSaveDC }}</p>
                  </div>
                  <div class="text-right">
                    <p class="font-headline text-[9px] uppercase tracking-tighter" style="color: #d0c5b2;">Spell Attack</p>
                    <p class="font-headline text-xl" style="color: #e6c364;">{{ formatMod(snap()!.spellAttackBonus) }}</p>
                  </div>
                </div>

                <!-- Spell slots -->
                <div class="grid grid-cols-3 md:grid-cols-9 gap-3 mb-6">
                  @for (lvl of spellLevelLabels; track lvl; let i = $index) {
                    <div class="text-center">
                      <p class="font-headline text-[9px] uppercase mb-1" style="color: #d0c5b2;">{{ lvl }}</p>
                      <div class="font-headline text-sm font-bold" style="color: #e6c364;">
                        {{ snap()!.spellSlots['' + (i + 1)] || '—' }}
                      </div>
                    </div>
                  }
                </div>

                <!-- Cantrips + prepared spells -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 class="font-headline text-[11px] uppercase tracking-widest mb-3 flex items-center gap-2"
                        style="color: #e6c364;">
                      <span class="material-symbols-outlined text-xs">star_shine</span> Cantrips
                    </h4>
                    <div class="p-3 min-h-[80px] font-body text-sm leading-relaxed"
                         style="background: #0d131e; border-bottom: 1px solid #4d4637; color: #d0c5b2;">
                      {{ snap()!.cantrips || '—' }}
                    </div>
                  </div>
                  <div>
                    <h4 class="font-headline text-[11px] uppercase tracking-widest mb-3 flex items-center gap-2"
                        style="color: #e6c364;">
                      <span class="material-symbols-outlined text-xs">menu_book</span> Prepared Spells
                    </h4>
                    <div class="p-3 min-h-[80px] font-body text-sm leading-relaxed"
                         style="background: #0d131e; border-bottom: 1px solid #4d4637; color: #d0c5b2; white-space: pre-wrap;">
                      {{ allSpells() || '—' }}
                    </div>
                  </div>
                </div>
              </section>
            }

            <!-- Equipment -->
            <section class="print-panel dnd-stat-box p-6 relative" style="background: #161c27; border-radius: 0;">
              <div class="dnd-flourish-tl"></div>
              <div class="dnd-flourish-br"></div>
              <h3 class="font-headline text-sm uppercase tracking-widest mb-4" style="color: #e6c364;">Equipment</h3>

              <!-- Currency row -->
              <div class="grid grid-cols-5 gap-2 mb-4">
                @for (curr of currencyDisplay(); track curr.abbr) {
                  <div class="text-center p-2" style="background: #2f3541;">
                    <p class="font-headline text-[9px] uppercase mb-1"
                       [style.color]="curr.color">{{ curr.abbr }}</p>
                    <p class="font-headline text-base font-bold" style="color: #dde2f2;">{{ curr.value || '—' }}</p>
                  </div>
                }
              </div>

              <!-- Armour -->
              @if (snap()!.armorName) {
                <div class="flex items-center justify-between mb-4 p-3" style="background: #2f3541;">
                  <span class="font-headline text-sm uppercase" style="color: #dde2f2;">{{ snap()!.armorName }}</span>
                  <span class="font-headline text-[10px] uppercase" style="color: #99907e;">{{ snap()!.armorType }}</span>
                </div>
              }

              <!-- Weapons -->
              @if (filledWeapons().length > 0) {
                <div class="mb-4">
                  <div class="grid gap-2 px-2 mb-1"
                       style="grid-template-columns: 1fr 80px 100px;">
                    <span class="font-headline text-[8px] uppercase tracking-widest" style="color: #4d4637;">Weapon</span>
                    <span class="font-headline text-[8px] uppercase tracking-widest" style="color: #4d4637;">Damage</span>
                    <span class="font-headline text-[8px] uppercase tracking-widest" style="color: #4d4637;">Type</span>
                  </div>
                  @for (w of filledWeapons(); track $index) {
                    <div class="grid gap-2 py-2 px-2" style="grid-template-columns: 1fr 80px 100px; border-bottom: 1px solid #4d4637;">
                      <span class="font-headline text-xs font-bold uppercase" style="color: #dde2f2;">{{ w.name }}</span>
                      <span class="font-headline text-xs font-bold" style="color: #dde2f2;">{{ w.damage || '—' }}</span>
                      <span class="font-body text-xs" style="color: #99907e;">{{ w.damageType || '—' }}</span>
                    </div>
                  }
                </div>
              }

              <!-- Equipment notes -->
              @if (snap()!.equipment) {
                <p class="font-body text-xs leading-relaxed whitespace-pre-wrap" style="color: #d0c5b2;">{{ snap()!.equipment }}</p>
              }
            </section>

            <!-- Background & Features -->
            <section class="print-panel dnd-stat-box p-6 relative" style="background: #161c27; border-radius: 0;">
              <div class="dnd-flourish-tl"></div>
              <h3 class="font-headline text-sm uppercase tracking-widest mb-4" style="color: #e6c364;">Background &amp; Features</h3>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-4">
                  @for (trait of traitFields(); track trait.label) {
                    @if (trait.value) {
                      <div>
                        <p class="font-headline text-[9px] uppercase tracking-widest mb-1" style="color: #4d4637;">{{ trait.label }}</p>
                        <p class="font-body text-xs leading-relaxed whitespace-pre-wrap" style="color: #d0c5b2;">{{ trait.value }}</p>
                      </div>
                    }
                  }
                </div>
                <div class="space-y-4">
                  @for (prof of profFields(); track prof.label) {
                    @if (prof.value) {
                      <div>
                        <p class="font-headline text-[9px] uppercase tracking-widest mb-1" style="color: #4d4637;">{{ prof.label }}</p>
                        <p class="font-body text-xs leading-relaxed whitespace-pre-wrap" style="color: #d0c5b2;">{{ prof.value }}</p>
                      </div>
                    }
                  }
                </div>
              </div>
            </section>

            <!-- Notes -->
            @if (hasNotes()) {
              <section class="print-panel dnd-stat-box p-6 relative" style="background: #161c27; border-radius: 0;">
                <div class="dnd-flourish-tl"></div>
                <h3 class="font-headline text-sm uppercase tracking-widest mb-4" style="color: #e6c364;">Notes</h3>
                <div class="space-y-5">
                  @for (note of noteFields(); track note.label) {
                    @if (note.value) {
                      <div>
                        <p class="font-headline text-[9px] uppercase tracking-widest mb-1" style="color: #4d4637;">{{ note.label }}</p>
                        <p class="font-body text-sm leading-relaxed whitespace-pre-wrap" style="color: #d0c5b2;">{{ note.value }}</p>
                      </div>
                    }
                  }
                </div>
              </section>
            }

          </main>

        </div>

      }
    </div>
  </div>
  `,
  styles: [`
    :host { display: block; }
  `],
})
export class DndSheetComponent {
  private readonly _draft = inject(DndDraftService);

  readonly snap = computed(() => this._draft.snapshot());

  readonly savingThrowRows = SAVING_THROW_ROWS;
  readonly skillRows       = SKILL_ROWS;
  readonly spellLevelLabels = ['1st','2nd','3rd','4th','5th','6th','7th','8th','9th'];

  // ── Computed helpers ────────────────────────────────────────────────────

  private getAbilityMod(ability: string): number {
    const s = this.snap();
    if (!s) return 0;
    switch (ability) {
      case 'strength':     return s.strengthMod;
      case 'dexterity':    return s.dexMod;
      case 'constitution': return s.conMod;
      case 'intelligence': return s.intMod;
      case 'wisdom':       return s.wisMod;
      case 'charisma':     return s.chaMod;
      default:             return 0;
    }
  }

  formatMod(n: number): string { return n >= 0 ? `+${n}` : `${n}`; }

  isSaveProficient(id: string): boolean {
    return !!this.snap()?.savingThrowProficiencies?.[id];
  }

  isSkillProficient(id: string): boolean {
    return !!this.snap()?.skillProficiencies?.[id];
  }

  calcSaveValue(saveId: string): number {
    const s = this.snap();
    if (!s) return 0;
    const mod = this.getAbilityMod(saveId);
    return calcSavingThrow(mod, s.proficiencyBonus, this.isSaveProficient(saveId));
  }

  calcSkillValue(skill: SkillRow): number {
    const s = this.snap();
    if (!s) return 0;
    const mod = this.getAbilityMod(skill.ability);
    return calcSkillTotal(mod, s.proficiencyBonus, this.isSkillProficient(skill.id));
  }

  readonly abilityBlocks = computed(() => {
    const s = this.snap();
    if (!s) return [];
    return [
      { key: 'strength',     label: 'Strength',     score: s.strength,     mod: s.strengthMod },
      { key: 'dexterity',    label: 'Dexterity',    score: s.dexterity,    mod: s.dexMod      },
      { key: 'constitution', label: 'Constitution', score: s.constitution, mod: s.conMod      },
      { key: 'intelligence', label: 'Intelligence', score: s.intelligence, mod: s.intMod      },
      { key: 'wisdom',       label: 'Wisdom',       score: s.wisdom,       mod: s.wisMod      },
      { key: 'charisma',     label: 'Charisma',     score: s.charisma,     mod: s.chaMod      },
    ];
  });

  readonly identityFields = computed(() => {
    const s = this.snap();
    if (!s) return [];
    return [
      { label: 'Player',     value: s.playerName },
      { label: 'Background', value: s.background },
      { label: 'Species',    value: s.species     },
      { label: 'Class',      value: `${s.characterClass}${s.subclass ? ' · ' + s.subclass : ''}` },
      { label: 'Level',      value: String(s.characterLevel) },
      { label: 'XP',         value: s.experiencePoints },
    ];
  });

  readonly filledWeapons = computed(() =>
    (this.snap()?.weapons ?? []).filter(w => w.name.trim())
  );

  readonly currencyDisplay = computed(() => {
    const s = this.snap();
    if (!s) return [];
    return [
      { abbr: 'CP', value: s.copper,   color: '#b87333' },
      { abbr: 'SP', value: s.silver,   color: '#c0c0c0' },
      { abbr: 'EP', value: s.electrum, color: '#5a9fd4' },
      { abbr: 'GP', value: s.gold,     color: '#e6c364' },
      { abbr: 'PP', value: s.platinum, color: '#e8e8e8' },
    ];
  });

  readonly hasSpellcasting = computed(() => {
    const s = this.snap();
    return !!(s?.spellcastingClass || s?.cantrips || s?.spells1);
  });

  readonly allSpells = computed(() => {
    const s = this.snap();
    if (!s) return '';
    return [s.spells1, s.spells2, s.spells3, s.spells4, s.spells5]
      .filter(Boolean).join('\n');
  });

  readonly traitFields = computed(() => {
    const s = this.snap();
    if (!s) return [];
    return [
      { label: 'Personality Traits', value: s.personalityTraits },
      { label: 'Ideals',             value: s.ideals            },
      { label: 'Bonds',              value: s.bonds             },
      { label: 'Flaws',              value: s.flaws             },
    ];
  });

  readonly profFields = computed(() => {
    const s = this.snap();
    if (!s) return [];
    return [
      { label: 'Feat',                value: s.featName ? `${s.featName}${s.featDescription ? ': ' + s.featDescription : ''}` : '' },
      { label: 'Languages',           value: s.languagesKnown     },
      { label: 'Tool Proficiencies',  value: s.toolProficiencies  },
      { label: 'Other Proficiencies', value: s.otherProficiencies },
    ];
  });

  readonly noteFields = computed(() => {
    const s = this.snap();
    if (!s) return [];
    return [
      { label: 'Backstory',                  value: s.backstory           },
      { label: 'Allies & Organizations',     value: s.alliesOrganizations },
      { label: 'Additional Features & Traits', value: s.additionalFeatures },
      { label: 'Treasure',                   value: s.treasure            },
      { label: 'Notes',                      value: s.notes               },
    ];
  });

  readonly hasNotes = computed(() =>
    this.noteFields().some(f => !!f.value)
  );

  toTitleCase(s: string): string {
    if (!s) return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
}
