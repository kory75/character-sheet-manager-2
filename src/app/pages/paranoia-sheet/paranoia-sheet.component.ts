import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CharacterDraftService, SnapshotSkill } from '../../services/character-draft.service';
import { CLEARANCE_LEVELS } from '../paranoia-creation/identity-step/identity-step.component';
import { PARANOIA_DEFAULT_EQUIPMENT } from '../../games/paranoia-2e/data/equipment.data';

const SKILL_GROUP_LABELS: Record<string, string> = {
  agility:    'Agility',
  chutzpah:   'Chutzpah',
  dexterity:  'Dexterity',
  mechanical: 'Mechanical',
  moxie:      'Moxie',
};

const SKILL_GROUP_ORDER = ['agility', 'chutzpah', 'dexterity', 'mechanical', 'moxie'] as const;

interface SkillGroup { id: string; label: string; skills: SnapshotSkill[]; }

@Component({
  selector: 'app-paranoia-sheet',
  imports: [RouterLink],
  template: `

    <div class="sheet-container max-w-6xl mx-auto px-8 py-8 pb-32">

      <!-- ══ CONTROLS (hidden in print) ══ -->
      <div class="print-hide flex items-center gap-4 mb-8">
        <a routerLink="/"
           class="font-headline font-black uppercase text-[10px] tracking-widest px-5 py-3
                  flex items-center gap-2 text-gray-500 hover:text-on-surface transition-colors"
           style="border: 1px solid rgba(92,64,61,0.3);">
          <span class="material-symbols-outlined text-sm">home</span>
          <span>HOME</span>
        </a>
        <button
          class="font-headline font-black uppercase text-[10px] tracking-widest px-5 py-3
                 flex items-center gap-2 text-gray-500 hover:text-on-surface transition-colors"
          style="border: 1px solid rgba(92,64,61,0.3);"
          onclick="window.print()"
        >
          <span class="material-symbols-outlined text-sm">print</span>
          <span>PRINT DOSSIER</span>
        </button>
      </div>

      @if (!snap()) {
        <div class="flex flex-col items-center justify-center py-32 text-center">
          <span class="material-symbols-outlined text-6xl text-gray-700 mb-4">assignment_late</span>
          <p class="font-headline text-sm font-black uppercase tracking-widest text-gray-600 mb-2">No Active Dossier</p>
          <p class="font-headline text-[10px] uppercase text-gray-700 mb-6">
            Complete the Character Synthesizer to generate your citizen file.
          </p>
          <a routerLink="/" class="font-headline font-black uppercase px-8 py-4 text-sm bg-primary-container text-white">
            ← Return to Home
          </a>
        </div>

      } @else {

        <!-- ══ IDENTITY HEADER ══ -->
        <div class="print-panel mb-8 p-6 relative overflow-hidden"
             style="background: rgba(19,19,24,0.7); border: 1px solid rgba(92,64,61,0.2); transition: border-left-color 0.3s;"
             [style.border-left]="'8px solid ' + clearanceColor()">

          <div class="absolute inset-0 flex items-center justify-end pr-10 pointer-events-none select-none print-hide" aria-hidden="true">
            <span class="font-headline font-black uppercase tracking-tighter opacity-[0.035]"
                  style="font-size: 7rem; line-height: 1; color: #e4e1e8;">DOSSIER</span>
          </div>

          <div class="relative">
            <div class="flex items-start justify-between mb-4">
              <p class="font-headline text-[9px] font-black uppercase tracking-[0.35em] text-gray-600">
                Alpha Complex // Citizen Dossier // Form-22B // Active Troubleshooter
              </p>
              <span class="print-hide font-headline text-[9px] font-black uppercase tracking-widest px-3 py-1"
                    style="background: rgba(34,197,94,0.15); border: 1px solid rgba(34,197,94,0.4); color: #4ade80;">
                ● ACTIVE
              </span>
            </div>

            <p class="font-headline font-black uppercase tracking-tighter leading-none mb-5"
               style="font-size: clamp(2.5rem, 6vw, 4.5rem); transition: color 0.3s;"
               [style.color]="clearanceLabelColor()">
              {{ snap()!.fullName }}
            </p>

            <div class="flex flex-wrap items-center gap-6">
              <div>
                <p class="font-headline text-[8px] text-gray-700 uppercase tracking-widest mb-0.5">Clearance</p>
                <span class="clearance-badge font-headline text-[10px] font-black uppercase px-2 py-0.5"
                      [style.background]="clearanceColor()" [style.color]="clearanceTextColor()">
                  {{ snap()!.clearance }} — {{ clearanceLabel() }}
                </span>
              </div>
              <div>
                <p class="font-headline text-[8px] text-gray-700 uppercase tracking-widest mb-0.5">Sector</p>
                <span class="font-headline text-sm font-black uppercase" style="color: #e4e1e8;">{{ snap()!.sectorCode || '???' }}</span>
              </div>
              <div>
                <p class="font-headline text-[8px] text-gray-700 uppercase tracking-widest mb-0.5">Clone</p>
                <span class="font-headline text-sm font-black" style="color: #e4e1e8;">{{ snap()!.cloneNumber }}</span>
              </div>
              @if (snap()!.serviceGroupLabel) {
                <div>
                  <p class="font-headline text-[8px] text-gray-700 uppercase tracking-widest mb-0.5">Service Group</p>
                  <span class="font-headline text-sm font-black uppercase" style="color: #e4e1e8;">{{ snap()!.serviceGroupLabel }}</span>
                </div>
              }
              @if (snap()!.playerName) {
                <div>
                  <p class="font-headline text-[8px] text-gray-700 uppercase tracking-widest mb-0.5">Player</p>
                  <span class="font-body text-sm text-gray-400">{{ snap()!.playerName }}</span>
                </div>
              }
            </div>
          </div>
        </div>

        <!-- ══ MAIN GRID ══ -->
        <div class="grid gap-6 mb-6" style="grid-template-columns: 38% 1fr;">

          <!-- ── LEFT COLUMN ── -->
          <div class="space-y-5">

            <!-- PRIMARY ATTRIBUTES -->
            <div class="print-panel p-5" style="background: rgba(19,19,24,0.5); border: 1px solid rgba(92,64,61,0.2);"
                 [style.border-left]="'4px solid ' + clearanceColor()">
              <h3 class="font-headline text-[9px] font-black uppercase tracking-[0.3em] mb-5"
                  [style.color]="clearanceLabelColor()">■ Primary Attributes</h3>
              <div class="space-y-3">
                @for (attr of snap()!.attributes; track attr.id) {
                  <div>
                    <div class="flex items-baseline justify-between mb-1">
                      <span class="font-headline text-[9px] uppercase tracking-widest text-gray-500">{{ attr.label }}</span>
                      <span class="font-headline text-lg font-black leading-none" style="color: #e4e1e8;">{{ pad(attr.value) }}</span>
                    </div>
                    <div class="attr-bar-track h-[2px] bg-surface-container">
                      <div class="attr-bar-fill h-full" [style.width]="attrBarWidth(attr.value)" [style.background]="clearanceColor()"></div>
                    </div>
                  </div>
                }
              </div>
            </div>

            <!-- DERIVED LOGISTICS -->
            <div class="print-panel p-5" style="background: rgba(19,19,24,0.5); border: 1px solid rgba(92,64,61,0.2);"
                 [style.border-left]="'4px solid ' + clearanceColor()">
              <h3 class="font-headline text-[9px] font-black uppercase tracking-[0.3em] mb-4"
                  [style.color]="clearanceLabelColor()">■ Derived Logistics</h3>
              <div class="space-y-2.5">
                <div class="flex items-center justify-between">
                  <span class="font-headline text-[9px] uppercase tracking-widest text-gray-500">Carrying Capacity</span>
                  <span class="font-headline text-sm font-black" style="color: #e4e1e8;">{{ derived()!.carryingCapacity }} KG</span>
                </div>
                <div class="h-px bg-surface-container"></div>
                <div class="flex items-center justify-between">
                  <span class="font-headline text-[9px] uppercase tracking-widest text-gray-500">Damage Bonus</span>
                  <span class="font-headline text-sm font-black" style="color: #e4e1e8;">+{{ pad(derived()!.damageBonus) }}</span>
                </div>
                <div class="h-px bg-surface-container"></div>
                <div class="flex items-center justify-between">
                  <span class="font-headline text-[9px] uppercase tracking-widest text-gray-500">Power Index</span>
                  <span class="font-headline text-sm font-black" style="color: #e4e1e8;">{{ pad(derived()!.powerIndex) }}</span>
                </div>
                <div class="h-px bg-surface-container"></div>
                <div class="flex items-center justify-between">
                  <span class="font-headline text-[9px] uppercase tracking-widest text-gray-500">Machinability</span>
                  <span class="font-headline text-sm font-black" style="color: #e4e1e8;">{{ derived()!.machinability }}</span>
                </div>
              </div>
            </div>

            <!-- ARMOUR -->
            <div class="print-panel p-5" style="background: rgba(19,19,24,0.5); border: 1px solid rgba(92,64,61,0.2);"
                 [style.border-left]="'4px solid ' + clearanceColor()">
              <h3 class="font-headline text-[9px] font-black uppercase tracking-[0.3em] mb-3"
                  [style.color]="clearanceLabelColor()">■ Armour</h3>
              <div class="flex items-center justify-between">
                <span class="font-headline text-sm font-black uppercase" style="color: #e4e1e8;">{{ snap()!.armourWorn }}</span>
                <div class="flex gap-4">
                  <div class="text-right">
                    <p class="font-headline text-[8px] text-gray-700 uppercase mb-0">Type</p>
                    <span class="font-headline text-sm font-black" style="color: #e4e1e8;">{{ snap()!.armourType }}</span>
                  </div>
                  <div class="text-right">
                    <p class="font-headline text-[8px] text-gray-700 uppercase mb-0">Rating</p>
                    <span class="font-headline text-sm font-black" style="color: #e4e1e8;">{{ snap()!.armourRating }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- EQUIPMENT -->
            <div class="print-panel p-5" style="background: rgba(19,19,24,0.5); border: 1px solid rgba(92,64,61,0.2);"
                 [style.border-left]="'4px solid ' + clearanceColor()">
              <h3 class="font-headline text-[9px] font-black uppercase tracking-[0.3em] mb-3"
                  [style.color]="clearanceLabelColor()">■ Equipment &amp; Inventory</h3>

              <p class="font-headline text-[8px] uppercase tracking-widest text-gray-700 mb-2">Standard Issue</p>
              <div class="space-y-1 mb-4">
                @for (item of standardIssue; track item) {
                  <div class="flex items-center gap-2">
                    <span class="w-1.5 h-1.5 shrink-0" style="background: rgba(92,64,61,0.4);"></span>
                    <span class="font-headline text-[9px] uppercase tracking-wide text-gray-600">{{ item }}</span>
                  </div>
                }
              </div>

              @if (snap()!.equipment.length > 0) {
                <div style="border-top: 1px solid rgba(92,64,61,0.15);" class="pt-3">
                  <p class="font-headline text-[8px] uppercase tracking-widest text-gray-700 mb-2">Purchased</p>
                  <div class="space-y-1.5">
                    @for (item of snap()!.equipment; track item.id) {
                      <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                          <span class="w-1.5 h-1.5 shrink-0" [style.background]="clearanceColor()"></span>
                          <span class="font-headline text-[9px] uppercase tracking-wide" style="color: #e4e1e8;">{{ item.name }}</span>
                          @if (item.quantity > 1) {
                            <span class="font-headline text-[8px] text-gray-600">×{{ item.quantity }}</span>
                          }
                        </div>
                        <span class="font-headline text-[9px] text-gray-600">{{ item.cost * item.quantity }}₡</span>
                      </div>
                    }
                  </div>
                  <div class="flex justify-between mt-3 pt-2" style="border-top: 1px solid rgba(92,64,61,0.15);">
                    <span class="font-headline text-[9px] uppercase tracking-widest text-gray-600">Credits remaining</span>
                    <span class="font-headline text-sm font-black" style="color: #e4e1e8;">{{ creditsRemaining() }}₡</span>
                  </div>
                </div>
              }
            </div>

          </div>

          <!-- ── RIGHT COLUMN ── -->
          <div class="space-y-5">

            <!-- SKILL GROUPS -->
            <div class="grid grid-cols-2 gap-4">
              @for (group of skillGroups(); track group.id) {
                <div class="print-panel p-4"
                     [class.col-span-2]="$last && skillGroups().length % 2 !== 0"
                     style="background: rgba(19,19,24,0.5); border: 1px solid rgba(92,64,61,0.15);"
                     [style.border-left]="'3px solid ' + clearanceColor()">

                  <h4 class="font-headline text-[9px] font-black uppercase tracking-[0.25em] mb-3"
                      [style.color]="clearanceLabelColor()">{{ group.label }}</h4>

                  <div [class]="($last && skillGroups().length % 2 !== 0)
                    ? 'grid grid-cols-2 gap-x-6 gap-y-1.5' : 'space-y-1.5'">
                    @for (skill of group.skills; track skill.id) {
                      <div class="flex items-center gap-2">
                        <span class="font-headline text-[9px] uppercase tracking-wide leading-none flex-1 min-w-0 truncate"
                              [class.text-gray-500]="!skill.treasonous"
                              [class.text-primary-container]="skill.treasonous">
                          {{ skill.label }}@if (skill.treasonous) {⚠}
                        </span>
                        <div class="flex gap-[2px] shrink-0">
                          @for (filled of pips(skill.value); track $index) {
                            <div class="pip-dot w-[7px] h-[7px]"
                                 [class.pip-filled]="filled"
                                 [style.background]="filled ? clearanceColor() : 'rgba(92,64,61,0.2)'"></div>
                          }
                        </div>
                        <span class="font-headline text-[9px] font-black w-4 text-right shrink-0" style="color: #e4e1e8;">
                          {{ skill.value }}
                        </span>
                      </div>
                    }
                  </div>
                </div>
              }
            </div>

            <!-- AUTHORIZED ARMAMENTS -->
            @if (filledWeapons().length > 0) {
              <div class="print-panel p-5" style="background: rgba(19,19,24,0.5); border: 1px solid rgba(92,64,61,0.2);"
                   [style.border-left]="'4px solid ' + clearanceColor()">
                <h3 class="font-headline text-[9px] font-black uppercase tracking-[0.3em] mb-4"
                    [style.color]="clearanceLabelColor()">■ Authorized Armaments</h3>
                <div class="grid gap-4 mb-2 pb-2" style="grid-template-columns: 1fr 70px 70px 60px 70px; border-bottom: 1px solid rgba(92,64,61,0.2);">
                  <span class="font-headline text-[8px] uppercase tracking-widest text-gray-700">Weapon</span>
                  <span class="font-headline text-[8px] uppercase tracking-widest text-gray-700">WSN</span>
                  <span class="font-headline text-[8px] uppercase tracking-widest text-gray-700">Type</span>
                  <span class="font-headline text-[8px] uppercase tracking-widest text-gray-700">Damage</span>
                  <span class="font-headline text-[8px] uppercase tracking-widest text-gray-700">Range</span>
                </div>
                <div class="space-y-2">
                  @for (w of filledWeapons(); track $index) {
                    <div class="grid gap-4 py-1.5" style="grid-template-columns: 1fr 70px 70px 60px 70px; border-bottom: 1px solid rgba(92,64,61,0.08);">
                      <span class="font-headline text-xs font-black uppercase" style="color: #e4e1e8;">
                        {{ w.name }}@if (w.experimental) {<span class="font-headline text-[7px] text-yellow-600 ml-1">EXP</span>}
                      </span>
                      <span class="font-headline text-xs font-black" style="color: #e4e1e8;">{{ w.wsn || '—' }}</span>
                      <span class="font-headline text-xs text-gray-500 uppercase">{{ w.type || '—' }}</span>
                      <span class="font-headline text-xs font-black" style="color: #e4e1e8;">{{ w.damage || '—' }}</span>
                      <span class="font-headline text-xs text-gray-500">{{ w.range || '—' }}</span>
                    </div>
                  }
                </div>
              </div>
            }

            <!-- MISSION NOTES (public) -->
            @if (snap()!.publicNotes.trim()) {
              <div class="print-panel p-5" style="background: rgba(19,19,24,0.5); border: 1px solid rgba(92,64,61,0.2); border-left: 3px solid rgba(92,64,61,0.4);">
                <h3 class="font-headline text-[9px] font-black uppercase tracking-[0.3em] text-gray-600 mb-3">■ Mission Notes</h3>
                <p class="font-body text-sm text-gray-400 leading-relaxed whitespace-pre-wrap">{{ snap()!.publicNotes }}</p>
              </div>
            }

            <!-- Neural link placeholder (screen only) -->
            <div class="print-hide p-6 flex flex-col items-center justify-center gap-3"
                 style="background: rgba(19,19,24,0.3); border: 1px dashed rgba(92,64,61,0.2); min-height: 5rem;">
              <span class="material-symbols-outlined text-gray-800 text-3xl">hub</span>
              <p class="font-headline text-[9px] uppercase tracking-[0.3em] text-gray-800">
                Awaiting Neural Link Synchronization...
              </p>
            </div>

          </div>
        </div>

        <!-- ══ SECRET PAGE (page 2 in print) ══ -->
        <div class="secret-page relative overflow-hidden mb-8"
             style="background: rgba(196,30,30,0.06); border: 1px solid rgba(196,30,30,0.25);">

          <!-- Secret header -->
          <div class="absolute inset-0 flex items-center justify-center pointer-events-none select-none print-hide" aria-hidden="true">
            <span class="font-headline font-black uppercase tracking-tighter opacity-[0.03] text-primary-container"
                  style="font-size: 9rem; line-height: 1;">SECRET</span>
          </div>

          <div class="relative p-5">
            <div class="flex items-center gap-3 mb-6">
              <span class="material-symbols-outlined text-primary-container text-lg">lock</span>
              <div>
                <span class="font-headline text-[10px] font-black uppercase tracking-[0.25em] text-primary-container block">
                  Secret Page — Classified Information
                </span>
                <span class="font-headline text-[9px] text-gray-600 uppercase tracking-widest print-hide">
                  Disclose this page to no one. Tap a panel to reveal its contents.
                </span>
                <span class="font-headline text-[9px] text-gray-600 uppercase tracking-widest" style="display:none;" id="print-secret-hint">
                  Keep this page concealed from other players.
                </span>
              </div>
            </div>

            <!-- Mutation + Society side by side -->
            <div class="grid grid-cols-2 gap-5 mb-5">

              <!-- MUTATION -->
              <div class="cursor-pointer select-none print-panel" (click)="mutationRevealed.update(v => !v)">

                <!-- Redacted (hidden in print) -->
                <div class="secret-redacted"
                     [style.display]="mutationRevealed() ? 'none' : 'block'">
                  <div class="p-6 flex flex-col items-center justify-center gap-3"
                       style="background: rgba(19,19,24,0.8); border: 1px dashed rgba(196,30,30,0.35); min-height: 10rem;">
                    <p class="font-headline text-[9px] font-black uppercase tracking-[0.3em] text-gray-700">Mutation Classification</p>
                    <p class="font-headline text-2xl font-black uppercase tracking-tighter text-gray-800 select-none">██████████</p>
                    <p class="font-headline text-[8px] text-gray-800 uppercase tracking-widest select-none">Type: ████████</p>
                    <div class="flex items-center gap-2 mt-2">
                      <span class="material-symbols-outlined text-gray-700 text-sm">visibility_off</span>
                      <span class="font-headline text-[9px] text-gray-700 uppercase tracking-widest">Tap to reveal</span>
                    </div>
                  </div>
                </div>

                <!-- Revealed (always shown in print) -->
                <div class="secret-revealed reveal-flash"
                     [style.display]="mutationRevealed() ? 'block' : 'none'">
                  <div class="p-5 relative overflow-hidden"
                       style="background: rgba(19,19,24,0.8); border: 1px solid rgba(139,92,246,0.35); border-left: 4px solid #7e22ce;">
                    <div class="relative">
                      <div class="flex items-center justify-between mb-2">
                        <span class="font-headline text-[9px] font-black uppercase tracking-[0.25em]" style="color: #a78bfa;">■ Mutation</span>
                        <div class="flex items-center gap-2">
                          <span class="font-headline text-[8px] font-black uppercase px-2 py-0.5"
                                [style]="snap()!.mutationType === 'Psionic'
                                  ? 'background: rgba(139,92,246,0.15); border: 1px solid rgba(139,92,246,0.4); color: #a78bfa;'
                                  : 'background: rgba(234,179,8,0.12); border: 1px solid rgba(234,179,8,0.3); color: #ca8a04;'">
                            {{ snap()!.mutationType }}
                          </span>
                          <span class="material-symbols-outlined text-gray-700 text-sm print-hide">visibility</span>
                        </div>
                      </div>
                      <p class="font-headline text-xl font-black uppercase tracking-tight mb-1" style="color: #e4e1e8;">
                        {{ snap()!.mutationLabel || '— No Mutation —' }}
                      </p>
                      <p class="font-body text-xs text-gray-500 leading-relaxed">{{ snap()!.mutationDescription }}</p>
                    </div>
                  </div>
                </div>

              </div>

              <!-- SECRET SOCIETY -->
              <div class="cursor-pointer select-none print-panel" (click)="societyRevealed.update(v => !v)">

                <!-- Redacted (hidden in print) -->
                <div class="secret-redacted"
                     [style.display]="societyRevealed() ? 'none' : 'block'">
                  <div class="p-6 flex flex-col items-center justify-center gap-3"
                       style="background: rgba(19,19,24,0.8); border: 1px dashed rgba(196,30,30,0.35); min-height: 10rem;">
                    <p class="font-headline text-[9px] font-black uppercase tracking-[0.3em] text-gray-700">Society Affiliation</p>
                    <p class="font-headline text-2xl font-black uppercase tracking-tighter text-gray-800 select-none">██████████</p>
                    <p class="font-headline text-[8px] text-gray-800 uppercase tracking-widest select-none">Allegiance: ████████</p>
                    <div class="flex items-center gap-2 mt-2">
                      <span class="material-symbols-outlined text-gray-700 text-sm">visibility_off</span>
                      <span class="font-headline text-[9px] text-gray-700 uppercase tracking-widest">Tap to reveal</span>
                    </div>
                  </div>
                </div>

                <!-- Revealed (always shown in print) -->
                <div class="secret-revealed"
                     [style.display]="societyRevealed() ? 'block' : 'none'">
                  <div class="p-5"
                       style="background: rgba(19,19,24,0.8); border: 1px solid rgba(196,30,30,0.4); border-left: 4px solid #c41e1e;">
                    <div class="flex items-center justify-between mb-2">
                      <span class="font-headline text-[9px] font-black uppercase tracking-[0.25em] text-primary-container">■ True Allegiance</span>
                      <span class="material-symbols-outlined text-gray-700 text-sm print-hide">visibility</span>
                    </div>
                    <p class="font-headline text-xl font-black uppercase tracking-tight mb-1" style="color: #e4e1e8;">
                      {{ snap()!.societyLabel || '— Unknown —' }}
                    </p>
                    <p class="font-body text-xs text-gray-500 leading-relaxed mb-3">{{ snap()!.societyIdeology }}</p>

                    @if (snap()!.coverSocietyId) {
                      <div class="pt-3" style="border-top: 1px solid rgba(196,30,30,0.2);">
                        <p class="font-headline text-[8px] uppercase tracking-widest text-gray-600 mb-1">Cover Society (False Front)</p>
                        <p class="font-headline text-base font-black uppercase tracking-tight" style="color: #e4e1e8;">
                          {{ snap()!.coverSocietyLabel }}
                        </p>
                        <p class="font-body text-xs text-gray-600 leading-relaxed mt-1">{{ snap()!.coverSocietyIdeology }}</p>
                      </div>
                    }
                  </div>
                </div>

              </div>
            </div>

            <!-- SECRET NOTES full width -->
            <div class="cursor-pointer select-none print-panel" (click)="secretNotesRevealed.update(v => !v)">

              <!-- Redacted (hidden in print) -->
              <div class="secret-redacted"
                   [style.display]="secretNotesRevealed() ? 'none' : 'block'">
                <div class="p-5 flex items-center gap-6"
                     style="background: rgba(19,19,24,0.8); border: 1px dashed rgba(196,30,30,0.35);">
                  <div class="flex-1">
                    <p class="font-headline text-[9px] font-black uppercase tracking-[0.3em] text-gray-700 mb-1">Secret Notes</p>
                    <p class="font-headline text-sm font-black uppercase tracking-tighter text-gray-800 select-none">
                      ████ ████████ ███ ████ █████████ ██ ████████
                    </p>
                  </div>
                  <div class="flex items-center gap-2 shrink-0">
                    <span class="material-symbols-outlined text-gray-700 text-sm">visibility_off</span>
                    <span class="font-headline text-[9px] text-gray-700 uppercase tracking-widest">Tap to reveal</span>
                  </div>
                </div>
              </div>

              <!-- Revealed (always shown in print) -->
              <div class="secret-revealed"
                   [style.display]="secretNotesRevealed() ? 'block' : 'none'">
                <div class="p-5"
                     style="background: rgba(19,19,24,0.8); border: 1px solid rgba(196,30,30,0.3); border-left: 4px solid #c41e1e;">
                  <div class="flex items-center justify-between mb-3">
                    <span class="font-headline text-[9px] font-black uppercase tracking-[0.25em] text-primary-container">■ Secret Notes</span>
                    <span class="material-symbols-outlined text-gray-700 text-sm print-hide">visibility</span>
                  </div>
                  @if (snap()!.secretNotes.trim()) {
                    <p class="font-body text-sm text-gray-400 leading-relaxed whitespace-pre-wrap">{{ snap()!.secretNotes }}</p>
                  } @else {
                    <p class="font-headline text-[9px] text-gray-700 uppercase italic">No secret notes recorded.</p>
                  }
                </div>
              </div>

            </div>
          </div>
        </div>

      }
    </div>

  `,
  styles: [`
    @keyframes reveal-flash-anim {
      0%   { opacity: 0; transform: translateY(4px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    .reveal-flash { animation: reveal-flash-anim 300ms ease-out forwards; }
  `],
})
export class ParanoiaSheetComponent {
  private readonly draft = inject(CharacterDraftService);

  readonly snap = computed(() => this.draft.snapshot());

  readonly mutationRevealed    = signal(false);
  readonly societyRevealed     = signal(false);
  readonly secretNotesRevealed = signal(false);

  readonly standardIssue = PARANOIA_DEFAULT_EQUIPMENT.map(e => e.label);

  readonly clearanceColor = computed(() =>
    CLEARANCE_LEVELS.find(l => l.code === this.snap()?.clearance)?.color ?? '#c41e1e'
  );

  readonly clearanceTextColor = computed(() =>
    CLEARANCE_LEVELS.find(l => l.code === this.snap()?.clearance)?.textColor ?? '#ffffff'
  );

  readonly clearanceLabelColor = computed(() => {
    const code = this.snap()?.clearance;
    if (code === 'IR') return '#6b7280';
    return CLEARANCE_LEVELS.find(l => l.code === code)?.color ?? '#c41e1e';
  });

  readonly clearanceLabel = computed(() =>
    CLEARANCE_LEVELS.find(l => l.code === this.snap()?.clearance)?.label ?? 'Red'
  );

  readonly skillGroups = computed<SkillGroup[]>(() => {
    const snap = this.snap();
    if (!snap) return [];
    return SKILL_GROUP_ORDER.map(id => ({
      id,
      label: SKILL_GROUP_LABELS[id],
      skills: snap.skills.filter(s => s.group === id),
    }));
  });

  readonly filledWeapons = computed(() =>
    (this.snap()?.weapons ?? []).filter(w => w.name.trim())
  );

  readonly creditsRemaining = computed(() => {
    const eq = this.snap()?.equipment ?? [];
    const spent = eq.reduce((sum, e) => sum + e.cost * e.quantity, 0);
    return 100 - spent;
  });

  readonly derived = computed(() => {
    const snap = this.snap();
    if (!snap) return null;
    const str  = snap.attributes.find(a => a.id === 'strength')?.value ?? 0;
    const mech = snap.attributes.find(a => a.id === 'mech')?.value ?? 0;
    const dex  = snap.attributes.find(a => a.id === 'dexterity')?.value ?? 0;
    const pow  = snap.attributes.find(a => a.id === 'mutant_power')?.value ?? 0;
    return {
      carryingCapacity: str * 5,
      damageBonus:      Math.floor(str / 4),
      powerIndex:       pow,
      machinability:    ((mech + dex) / 40).toFixed(2),
    };
  });

  pips(value: number): boolean[] {
    const filled = Math.min(Math.floor(value / 2), 10);
    return Array.from({ length: 10 }, (_, i) => i < filled);
  }

  attrBarWidth(value: number): string {
    return `${Math.min((value / 20) * 100, 100)}%`;
  }

  pad(n: number): string {
    return n < 10 ? '0' + n : String(n);
  }
}
