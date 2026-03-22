import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CharacterDraftService } from '../../services/character-draft.service';
import { AttributeGridComponent, AttributeSlot } from './attribute-grid/attribute-grid.component';
import { ServiceGroupStepComponent } from './service-group-step/service-group-step.component';
import { SkillsStepComponent, SkillSlot, SkillGroup } from './skills-step/skills-step.component';
import { WeaponsStepComponent, WeaponSlot, emptyWeaponSlot } from './weapons-step/weapons-step.component';
import { EquipmentStepComponent } from './equipment-step/equipment-step.component';
import { MutationStepComponent } from './mutation-step/mutation-step.component';
import { SocietyStepComponent } from './society-step/society-step.component';
import { NotesStepComponent } from './notes-step/notes-step.component';
import { IdentityStepComponent, CLEARANCE_LEVELS } from './identity-step/identity-step.component';
import { PARANOIA_PURCHASABLE_EQUIPMENT } from '../../games/paranoia-2e/data/equipment.data';
import { PARANOIA_MUTATIONS, MUTATION_BY_ID } from '../../games/paranoia-2e/data/mutations.data';
import { PARANOIA_SECRET_SOCIETIES, SECRET_SOCIETY_BY_ID } from '../../games/paranoia-2e/data/secret-societies.data';
import { rollSecretSociety, rollCoverSociety } from '../../games/paranoia-2e/creation-rules';
import { CharacterStorageService } from '../../services/character-storage.service';
import { PARANOIA_SERVICE_GROUPS, SERVICE_GROUP_BY_ID } from '../../games/paranoia-2e/data/service-groups.data';
import { PARANOIA_SKILLS } from '../../games/paranoia-2e/data/skills.data';
import { calcSkillBase } from '../../games/paranoia-2e/creation-rules';

type RollState = 'idle' | 'rolling' | 'done';

interface WizardStep { label: string; }

const WIZARD_STEPS: WizardStep[] = [
  { label: 'IDENTITY'      },
  { label: 'ATTRIBUTES'    },
  { label: 'SERVICE GROUP' },
  { label: 'SKILLS'        },
  { label: 'WEAPONS'       },
  { label: 'EQUIPMENT'     },
  { label: 'MUTATION'      },
  { label: 'SOCIETY'       },
  { label: 'NOTES'         },
];

const ATTRIBUTE_DEFS = [
  { id: 'strength',     label: 'Strength'        },
  { id: 'endurance',    label: 'Endurance'        },
  { id: 'agility',      label: 'Agility'          },
  { id: 'dexterity',    label: 'Manual Dexterity' },
  { id: 'moxie',        label: 'Moxie'            },
  { id: 'chutzpah',     label: 'Chutzpah'         },
  { id: 'mech',         label: 'Mech Aptitude'    },
  { id: 'mutant_power', label: 'Power Index'      },
];

const SKILL_GROUP_TO_ATTR: Record<SkillGroup, string> = {
  agility:    'agility',
  chutzpah:   'chutzpah',
  dexterity:  'dexterity',
  mechanical: 'mech',
  moxie:      'moxie',
};

const PARANOIA_FIRST_NAMES = [
  'Ace', 'Alf', 'Blip', 'Bob', 'Bud', 'Cal', 'Car', 'Dan',
  'Deek', 'Dex', 'Eli', 'Evap', 'Flo', 'Fox', 'Frug', 'Gil',
  'Gus', 'Hal', 'Hux', 'Ike', 'Ivy', 'Jan', 'Jay', 'Ken',
  'Kim', 'Klax', 'Les', 'Lou', 'Max', 'Meg', 'Mop', 'Ned',
  'Nix', 'Obi', 'Otto', 'Pat', 'Pax', 'Rex', 'Rog', 'Sal',
  'Snoz', 'Sue', 'Ted', 'Tom', 'Trog', 'Ugo', 'Val', 'Vic',
  'Wes', 'Win', 'Xen', 'Yak', 'Yul', 'Zap', 'Zed',
];

function randomSectorCode(): string {
  return Array.from({ length: 3 }, () =>
    String.fromCharCode(65 + Math.floor(Math.random() * 26))
  ).join('');
}

function d20(): number { return Math.floor(Math.random() * 20) + 1; }

function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

@Component({
  selector: 'app-paranoia-creation',
  imports: [AttributeGridComponent, ServiceGroupStepComponent, SkillsStepComponent, WeaponsStepComponent, EquipmentStepComponent, MutationStepComponent, SocietyStepComponent, NotesStepComponent, IdentityStepComponent],
  template: `
    <div class="max-w-5xl mx-auto p-12 pb-32">

      <!-- ═══════════════════════════════════════ HERO HEADER ══ -->
      <div class="mb-16 pl-8"
           style="transition: border-left-color 0.3s;"
           [style.border-left]="'8px solid ' + clearanceBorderColor()">
        <h1 class="font-headline text-6xl font-black uppercase tracking-tighter leading-none mb-2">
          Character <span class="text-primary-container">Synthesizer</span>
        </h1>
        <p class="font-headline text-sm text-surface-container-highest uppercase font-bold tracking-[0.2em]">
          Deployment Authorization: Required // Form 22-A-9
        </p>
      </div>

      <!-- ═══════════════════════════════════════ ACTION CONTROLS ══ -->
      <div class="flex items-center gap-4 mb-12">

        <!-- AUTO-ROLL button -->
        <button
          class="font-headline font-black uppercase px-12 py-5 text-lg flex items-center gap-3
                 transition-all active:scale-95 bg-primary-container text-white"
          [class.opacity-70]="rollState() === 'rolling'"
          [class.cursor-not-allowed]="rollState() === 'rolling'"
          [class.pointer-events-none]="rollState() === 'rolling'"
          [attr.aria-disabled]="rollState() === 'rolling'"
          (click)="onAutoRoll()"
        >
          <span>{{ autoRollLabel() }}</span>
          <span class="material-symbols-outlined" [class.dice-spin]="rollState() === 'rolling'">casino</span>
        </button>

        <!-- SKIP ANIMATION — visible only during sequence -->
        @if (isAutoRolling()) {
          <button
            class="font-headline font-bold uppercase px-6 py-5 text-sm flex items-center gap-2
                   transition-all active:scale-95 text-gray-400 hover:text-on-surface"
            style="border: 1px solid rgba(92,64,61,0.3);"
            (click)="skipAutoRoll()"
          >
            <span>SKIP ANIMATION</span>
            <span class="material-symbols-outlined text-sm">fast_forward</span>
          </button>
        }

        <!-- RESET ALL — visible whenever any data is present -->
        @if (hasAnyData() && !isAutoRolling()) {
          <button
            class="font-headline font-bold uppercase px-8 py-5 text-sm flex items-center gap-2
                   transition-all active:scale-95 hover:bg-surface-container"
            style="border: 1px solid rgba(92,64,61,0.3); color: #6b7280;"
            (click)="resetAll()"
          >
            <span>RESET ALL</span>
            <span class="material-symbols-outlined text-sm">delete_sweep</span>
          </button>
        }

      </div>

      <!-- ═══════════════════════════════════════ STEP CONTENT ══ -->
      @switch (currentStepIndex()) {
        @case (0) {
          <app-identity-step
            [firstName]="firstName()"
            [sectorCode]="sectorCode()"
            [cloneNumber]="cloneNumber()"
            [clearance]="clearance()"
            [playerName]="playerName()"
            [fullName]="fullName()"
            (firstNameChanged)="firstName.set($event)"
            (sectorCodeChanged)="sectorCode.set($event)"
            (cloneNumberChanged)="cloneNumber.set($event)"
            (clearanceChanged)="clearance.set($event)"
            (playerNameChanged)="playerName.set($event)"
            (generateRequested)="generateRandomIdentity()"
            (sectorRollRequested)="sectorCode.set(randomSectorCode())"
            (clearIdentityRequested)="firstName.set(''); sectorCode.set(''); cloneNumber.set(1); clearance.set('R')"
          />
        }
        @case (1) {
          <app-attribute-grid
            [attributes]="attributes()"
            (rollOne)="rollSingle($event)"
          />
        }
        @case (2) {
          <app-service-group-step
            [serviceGroupId]="serviceGroupId()"
            [isRolling]="serviceGroupIsRolling()"
            [lastRoll]="serviceGroupLastRoll()"
            (groupSelected)="onServiceGroupSelected($event)"
            (rollRequested)="rollServiceGroup()"
          />
        }
        @case (3) {
          <app-skills-step
            [skillSlots]="skillSlots()"
            [poolRemaining]="skillPool()"
            (skillChanged)="onSkillChanged($event)"
          />
        }
        @case (4) {
          <app-weapons-step
            [weaponSlots]="weaponSlots()"
            [laserWsn]="laserWsn()"
            [armourWorn]="armourWorn()"
            [armourType]="armourType()"
            [armourRating]="armourRating()"
            (slotChanged)="onSlotChanged($event)"
            (armourChanged)="onArmourChanged($event)"
          />
        }
        @case (5) {
          <app-equipment-step
            [purchasedItems]="purchasedItems()"
            [creditsRemaining]="creditsRemaining()"
            (add)="onAddItem($event)"
            (remove)="onRemoveItem($event)"
          />
        }
        @case (6) {
          <app-mutation-step
            [mutationId]="mutationId()"
            [isRolling]="mutationIsRolling()"
            [lastRoll]="mutationLastRoll()"
            [powerIndex]="powerIndex()"
            (rollRequested)="rollMutation()"
            (mutationSelected)="mutationId.set($event)"
          />
        }
        @case (7) {
          <app-society-step
            [societyId]="societyId()"
            [coverSocietyId]="coverSocietyId()"
            [isRolling]="societyIsRolling()"
            [lastRoll]="societyLastRoll()"
            [coverLastRoll]="coverLastRoll()"
            (rollRequested)="rollSociety()"
            (rollCoverRequested)="rollCoverSociety()"
            (societySelected)="societyId.set($event)"
            (coverSelected)="coverSocietyId.set($event)"
          />
        }
        @case (8) {
          <app-notes-step
            [publicNotes]="publicNotes()"
            [secretNotes]="secretNotes()"
            (publicNotesChanged)="publicNotes.set($event)"
            (secretNotesChanged)="secretNotes.set($event)"
          />
        }
        @default {
          <div class="flex items-center justify-center h-48 text-on-surface/20">
            <p class="font-headline text-sm uppercase tracking-widest">
              — {{ currentStep().label }} step coming soon —
            </p>
          </div>
        }
      }

    </div>

    <!-- ═══════════════════════════════════════ BOTTOM PROGRESS BAR ══ -->
    <div class="fixed bottom-0 left-0 md:left-64 right-0 z-40">
      <div class="bg-surface-container h-[3.5rem] flex items-center px-8 justify-between"
           style="transition: border-top-color 0.3s;"
           [style.border-top]="'2px solid ' + clearanceBorderColor()">

        <div class="flex items-center gap-6 flex-1 max-w-2xl">
          <span class="font-headline text-[10px] font-black uppercase text-primary-container whitespace-nowrap">
            STEP {{ currentStepIndex() + 1 }}: {{ currentStep().label }}
          </span>
          <div class="flex-1 h-1 bg-background relative">
            <div
              class="absolute top-0 left-0 h-full bg-primary-container transition-all duration-300"
              [style.width]="progressPercent() + '%'"
            ></div>
          </div>
          <span class="font-headline text-[10px] text-gray-500 font-bold uppercase whitespace-nowrap">
            {{ progressPercent() }}% COMPLETE
          </span>
        </div>

        <div class="flex items-center gap-3 ml-8">
          @if (currentStepIndex() > 0) {
            <button
              class="font-headline font-black text-[10px] px-4 py-2 uppercase tracking-widest
                     transition-all active:scale-95 text-gray-500 hover:text-on-surface"
              style="border: 1px solid rgba(92,64,61,0.3);"
              (click)="prevStep()"
            >PREV</button>
          }
          <button
            class="bg-primary-container text-white font-headline font-black text-[10px]
                   px-6 py-2 uppercase tracking-widest transition-all active:scale-95 hover:opacity-90"
            (click)="isLastStep() ? finalise() : nextStep()"
          >{{ isLastStep() ? 'FINALISE' : 'NEXT MODULE' }}</button>
        </div>

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
export class ParanoiaCreationComponent {
  readonly steps            = WIZARD_STEPS;
  readonly rollState        = signal<RollState>('idle');
  readonly currentStepIndex = signal(0);
  readonly isAutoRolling    = signal(false);

  readonly currentStep     = computed(() => this.steps[this.currentStepIndex()]);
  readonly isLastStep      = computed(() => this.currentStepIndex() === this.steps.length - 1);
  readonly progressPercent = computed(() =>
    Math.round((this.currentStepIndex() / (this.steps.length - 1)) * 100)
  );
  readonly autoRollLabel   = computed(() =>
    this.rollState() === 'rolling' ? 'ROLLING...' : 'AUTO-ROLL CHARACTER'
  );

  readonly clearanceBorderColor = computed(() =>
    CLEARANCE_LEVELS.find(l => l.code === this.clearance())?.color ?? '#c41e1e'
  );

  readonly hasAnyData = computed(() =>
    !!this.firstName().trim() ||
    !!this.sectorCode().trim() ||
    this.cloneNumber() !== 1 ||
    this.clearance() !== 'R' ||
    !!this.playerName().trim() ||
    this.attributes().some(a => a.value !== null) ||
    this.serviceGroupId() !== null ||
    this.skillPool() < 30 ||
    !!this.weaponSlots()[0].name ||
    Object.keys(this.purchasedItems()).length > 0 ||
    this.mutationId() !== null ||
    this.societyId() !== null ||
    !!this.publicNotes() ||
    !!this.secretNotes()
  );

  // ── Character state ───────────────────────────────────────────────────────

  // Identity — firstName / sectorCode / clearance are shared with the shell via service
  private readonly _draft = inject(CharacterDraftService);
  readonly firstName   = this._draft.firstName;
  readonly sectorCode  = this._draft.sectorCode;
  readonly clearance   = this._draft.clearance;
  readonly cloneNumber = signal(1);
  readonly playerName  = signal('');

  readonly fullName = computed(() => {
    const fn  = this.firstName().trim()  || '???';
    const cl  = this.clearance()         || 'R';
    const sec = this.sectorCode().trim() || '???';
    const cn  = this.cloneNumber();
    return `${fn}-${cl}-${sec}-${cn}`;
  });

  readonly serviceGroupId       = signal<string | null>(null);
  readonly serviceGroupIsRolling = signal(false);
  readonly serviceGroupLastRoll  = signal<number | null>(null);

  readonly skillValues = signal<Record<string, number>>({});
  readonly skillPool   = signal<number>(30);

  readonly weaponSlots  = signal<WeaponSlot[]>(Array.from({ length: 5 }, emptyWeaponSlot));
  readonly armourWorn   = signal('Red Reflect Armor');
  readonly armourType   = signal('L');
  readonly armourRating = signal('4');

  readonly purchasedItems   = signal<Record<string, number>>({});

  readonly mutationId        = signal<string | null>(null);
  readonly mutationIsRolling = signal(false);
  readonly mutationLastRoll  = signal<number | null>(null);

  readonly publicNotes  = signal('');
  readonly secretNotes  = signal('');

  readonly societyId          = signal<string | null>(null);
  readonly coverSocietyId     = signal<string | null>(null);
  readonly societyIsRolling   = signal(false);
  readonly societyLastRoll    = signal<number | null>(null);
  readonly coverLastRoll      = signal<number | null>(null);
  readonly creditsRemaining = computed(() => {
    const spent = Object.entries(this.purchasedItems()).reduce((sum, [id, qty]) => {
      const item = PARANOIA_PURCHASABLE_EQUIPMENT.find(e => e.id === id);
      return sum + (item?.cost ?? 0) * qty;
    }, 0);
    return 100 - spent;
  });

  private readonly _attributes = signal<AttributeSlot[]>(
    ATTRIBUTE_DEFS.map(def => ({
      id: def.id, label: def.label, value: null, isRolling: false, flashSettled: false,
    }))
  );
  readonly attributes = this._attributes.asReadonly();

  // ── Computed skill slots ──────────────────────────────────────────────────

  readonly skillSlots = computed<SkillSlot[]>(() => {
    const attrs  = this.attributes();
    const sgId   = this.serviceGroupId();
    const vals   = this.skillValues();
    const boosted = new Set<string>(sgId ? (SERVICE_GROUP_BY_ID[sgId]?.skillIds ?? []) : []);

    return PARANOIA_SKILLS.map(skill => {
      const attrId  = SKILL_GROUP_TO_ATTR[skill.skillGroup as SkillGroup];
      const attrVal = attrs.find(a => a.id === attrId)?.value ?? 0;
      const base    = calcSkillBase(attrVal);
      const stored  = vals[skill.id];
      const value   = stored !== undefined ? stored : base;
      const isBoosted = boosted.has(skill.id);
      return {
        id:         skill.id,
        label:      skill.label,
        skillGroup: skill.skillGroup as SkillGroup,
        treasonous: skill.treasonous,
        base,
        value,
        max:        isBoosted ? 20 : 12,
        isBoosted,
      };
    });
  });

  readonly laserWsn = computed(() =>
    this.skillSlots().find(s => s.id === 'skill_laser_weapons')?.value ?? 0
  );

  // ── Weapon handlers ───────────────────────────────────────────────────────

  onSlotChanged(event: { index: number; slot: WeaponSlot }): void {
    this.weaponSlots.update(slots =>
      slots.map((s, i) => i === event.index ? event.slot : s)
    );
  }

  onArmourChanged(event: { worn: string; rating: string; type?: string }): void {
    if (event.worn   !== undefined) this.armourWorn.set(event.worn);
    if (event.rating !== undefined) this.armourRating.set(event.rating);
    if (event.type   !== undefined) this.armourType.set(event.type);
  }

  onAddItem(id: string): void {
    const item = PARANOIA_PURCHASABLE_EQUIPMENT.find(e => e.id === id);
    if (!item || this.creditsRemaining() < item.cost) return;
    this.purchasedItems.update(m => ({ ...m, [id]: (m[id] ?? 0) + 1 }));
  }

  readonly powerIndex = computed(() =>
    this.attributes().find(a => a.id === 'mutant_power')?.value ?? 0
  );

  onRemoveItem(id: string): void {
    this.purchasedItems.update(m => {
      const qty = (m[id] ?? 0) - 1;
      if (qty <= 0) { const { [id]: _, ...rest } = m; return rest; }
      return { ...m, [id]: qty };
    });
  }

  rollMutation(): void {
    if (this.mutationIsRolling()) return;
    this.mutationIsRolling.set(true);
    setTimeout(() => {
      const roll = d20();
      const m = PARANOIA_MUTATIONS.find(m => m.d20Index === roll)!;
      this.mutationId.set(m.id);
      this.mutationLastRoll.set(roll);
      this.mutationIsRolling.set(false);
    }, 900);
  }

  rollSociety(): void {
    if (this.societyIsRolling()) return;
    this.societyIsRolling.set(true);
    setTimeout(() => {
      const roll = d20();
      const result = rollSecretSociety(roll);
      this.societyId.set(result.primary);
      this.societyLastRoll.set(roll);
      this.coverSocietyId.set(null);
      this.coverLastRoll.set(null);
      this.societyIsRolling.set(false);
    }, 900);
  }

  rollCoverSociety(): void {
    // Re-roll until not 18-20 (up to 10 attempts then fallback)
    let roll = d20();
    let attempts = 0;
    while (roll >= 18 && attempts < 10) { roll = d20(); attempts++; }
    const id = rollCoverSociety(roll);
    this.coverSocietyId.set(id);
    this.coverLastRoll.set(roll);
  }

  // ── Roll helpers ──────────────────────────────────────────────────────────

  private updateSlot(index: number, patch: Partial<AttributeSlot>): void {
    this._attributes.update(slots =>
      slots.map((s, i) => i === index ? { ...s, ...patch } : s)
    );
  }

  rollSingle(index: number): void {
    this.updateSlot(index, { isRolling: true, flashSettled: false });
    setTimeout(() => {
      this.updateSlot(index, { value: d20(), isRolling: false, flashSettled: true });
      setTimeout(() => this.updateSlot(index, { flashSettled: false }), 700);
    }, 450);
  }

  rollServiceGroup(): void {
    if (this.serviceGroupIsRolling()) return;
    this.serviceGroupIsRolling.set(true);
    setTimeout(() => {
      const roll = d20();
      const sg = PARANOIA_SERVICE_GROUPS.find(g => roll >= g.d20Min && roll <= g.d20Max)!;
      this.serviceGroupId.set(sg.id);
      this.serviceGroupLastRoll.set(roll);
      this.serviceGroupIsRolling.set(false);
      this.skillValues.set({});
      this.skillPool.set(30);
    }, 450);
  }

  onServiceGroupSelected(id: string): void {
    this.serviceGroupId.set(id);
    this.skillValues.set({});
    this.skillPool.set(30);
  }

  onSkillChanged(event: { id: string; newValue: number }): void {
    const slot = this.skillSlots().find(s => s.id === event.id);
    if (!slot) return;
    const delta = event.newValue - slot.value;
    if (delta > 0 && this.skillPool() < delta) return;
    if (event.newValue < slot.base || event.newValue > slot.max) return;
    this.skillValues.update(v => ({ ...v, [event.id]: event.newValue }));
    this.skillPool.update(p => p - delta);
  }

  // ── Auto-roll sequence ────────────────────────────────────────────────────

  onAutoRoll(): void {
    if (this.rollState() === 'rolling') return;
    this.resetCharacterState();
    this.runAutoRoll();
  }

  resetAll(): void {
    this.isAutoRolling.set(false);
    this.resetCharacterState();
    this.rollState.set('idle');
    this.currentStepIndex.set(0);
  }

  randomSectorCode(): string { return randomSectorCode(); }

  generateRandomIdentity(): void {
    const name = PARANOIA_FIRST_NAMES[Math.floor(Math.random() * PARANOIA_FIRST_NAMES.length)];
    this.firstName.set(name);
    this.sectorCode.set(randomSectorCode());
    this.cloneNumber.set(1);
    this.clearance.set('R');
  }

  private resetCharacterState(): void {
    this.firstName.set('');
    this.sectorCode.set('');
    this.cloneNumber.set(1);
    this.clearance.set('R');
    this.playerName.set('');
    this._attributes.update(slots => slots.map(s => ({ ...s, value: null, isRolling: false, flashSettled: false })));
    this.serviceGroupId.set(null);
    this.serviceGroupLastRoll.set(null);
    this.serviceGroupIsRolling.set(false);
    this.skillValues.set({});
    this.skillPool.set(30);
    this.weaponSlots.set(Array.from({ length: 5 }, emptyWeaponSlot));
    this.armourWorn.set('Red Reflect Armor');
    this.armourType.set('L');
    this.armourRating.set('4');
    this.purchasedItems.set({});
    this.mutationId.set(null);
    this.mutationLastRoll.set(null);
    this.mutationIsRolling.set(false);
    this.publicNotes.set('');
    this.secretNotes.set('');
    this.societyId.set(null);
    this.coverSocietyId.set(null);
    this.societyLastRoll.set(null);
    this.coverLastRoll.set(null);
    this.societyIsRolling.set(false);
  }

  private fillDefaultWeapons(): void {
    this.weaponSlots.update(slots => slots.map((s, i) =>
      i === 0
        ? { name: 'Laser Pistol', wsn: '', type: 'L', damage: '8', range: '20', experimental: false }
        : s
    ));
  }

  private autoAllocateSkills(): void {
    const slots = this.skillSlots();
    const newVals: Record<string, number> = {};
    let pool = 30;

    // Boosted skills first (prioritised), then normal — both in random order
    const order = [
      ...slots.filter(s => s.isBoosted).sort(() => Math.random() - 0.5),
      ...slots.filter(s => !s.isBoosted).sort(() => Math.random() - 0.5),
    ];

    for (const slot of order) {
      const room = slot.max - slot.base;
      if (room <= 0 || pool <= 0) { newVals[slot.id] = slot.base; continue; }
      const maxAdd = Math.min(room, pool);
      const add    = Math.floor(Math.random() * (maxAdd + 1));
      newVals[slot.id] = slot.base + add;
      pool -= add;
    }

    this.skillValues.set(newVals);
    this.skillPool.set(pool);
  }

  private async runAutoRoll(): Promise<void> {
    this.rollState.set('rolling');
    this.isAutoRolling.set(true);

    // ── Step 0: IDENTITY ──────────────────────────────────────────────────
    this.currentStepIndex.set(0);
    await wait(300);
    this.generateRandomIdentity();
    await wait(600);

    if (!this.isAutoRolling()) return;

    // ── Step 1: ATTRIBUTES ────────────────────────────────────────────────
    this.currentStepIndex.set(1);
    await wait(300);
    ATTRIBUTE_DEFS.forEach((_, i) => setTimeout(() => this.rollSingle(i), i * 120));
    await wait(ATTRIBUTE_DEFS.length * 120 + 600);

    if (!this.isAutoRolling()) return; // aborted by skip

    // ── Step 2: SERVICE GROUP ─────────────────────────────────────────────
    this.currentStepIndex.set(2);
    await wait(400);
    this.serviceGroupIsRolling.set(true);
    await wait(500);
    const sgRoll = d20();
    const sg = PARANOIA_SERVICE_GROUPS.find(g => sgRoll >= g.d20Min && sgRoll <= g.d20Max)!;
    this.serviceGroupId.set(sg.id);
    this.serviceGroupLastRoll.set(sgRoll);
    this.serviceGroupIsRolling.set(false);
    await wait(600);

    if (!this.isAutoRolling()) return; // aborted by skip

    // ── Step 3: SKILLS ────────────────────────────────────────────────────
    this.currentStepIndex.set(3);
    await wait(400);
    this.autoAllocateSkills();
    await wait(600);

    if (!this.isAutoRolling()) return; // aborted by skip

    // ── Step 4: WEAPONS ───────────────────────────────────────────────────
    this.currentStepIndex.set(4);
    await wait(300);
    this.fillDefaultWeapons();
    await wait(400);

    if (!this.isAutoRolling()) return; // aborted by skip

    // ── Step 5: EQUIPMENT ─────────────────────────────────────────────────
    this.currentStepIndex.set(5);
    await wait(400);

    if (!this.isAutoRolling()) return; // aborted by skip

    // ── Step 6: MUTATION ──────────────────────────────────────────────────
    this.currentStepIndex.set(6);
    await wait(300);
    this.mutationIsRolling.set(true);
    await wait(900);
    const mutRoll = d20();
    const mut = PARANOIA_MUTATIONS.find(m => m.d20Index === mutRoll)!;
    this.mutationId.set(mut.id);
    this.mutationLastRoll.set(mutRoll);
    this.mutationIsRolling.set(false);
    await wait(600);

    if (!this.isAutoRolling()) return; // aborted by skip

    // ── Step 7: SOCIETY ───────────────────────────────────────────────────
    this.currentStepIndex.set(7);
    await wait(300);
    this.societyIsRolling.set(true);
    await wait(900);
    const socRoll = d20();
    const socResult = rollSecretSociety(socRoll);
    this.societyId.set(socResult.primary);
    this.societyLastRoll.set(socRoll);
    this.societyIsRolling.set(false);
    await wait(500);
    if (socResult.isIntSec) {
      // Roll cover society
      let coverRoll = d20();
      let tries = 0;
      while (coverRoll >= 18 && tries < 10) { coverRoll = d20(); tries++; }
      const coverId = rollCoverSociety(coverRoll);
      this.coverSocietyId.set(coverId);
      this.coverLastRoll.set(coverRoll);
      await wait(400);
    }

    if (!this.isAutoRolling()) return; // aborted by skip

    // ── Step 8: NOTES — navigate then stop, player writes their own ───────
    this.currentStepIndex.set(8);
    await wait(300);

    this.isAutoRolling.set(false);
    this.rollState.set('done');
  }

  skipAutoRoll(): void {
    // Fill identity if not yet set
    if (!this.firstName().trim()) {
      this.generateRandomIdentity();
    }
    // Fill any un-rolled attribute values instantly
    this._attributes.update(slots =>
      slots.map(s => s.value === null ? { ...s, value: d20(), isRolling: false, flashSettled: false } : s)
    );
    // Fill service group if not yet set
    if (!this.serviceGroupId()) {
      const roll = d20();
      const sg = PARANOIA_SERVICE_GROUPS.find(g => roll >= g.d20Min && roll <= g.d20Max)!;
      this.serviceGroupId.set(sg.id);
      this.serviceGroupLastRoll.set(roll);
    }
    this.serviceGroupIsRolling.set(false);
    // Fill skills if not yet allocated
    if (this.skillPool() === 30 && Object.keys(this.skillValues()).length === 0) {
      this.autoAllocateSkills();
    }
    // Fill weapons if slot 1 is empty
    if (!this.weaponSlots()[0].name) {
      this.fillDefaultWeapons();
    }
    // Roll mutation if not yet assigned
    if (!this.mutationId()) {
      const roll = d20();
      const mut = PARANOIA_MUTATIONS.find(m => m.d20Index === roll)!;
      this.mutationId.set(mut.id);
      this.mutationLastRoll.set(roll);
    }
    // Roll society if not yet assigned
    if (!this.societyId()) {
      const roll = d20();
      const result = rollSecretSociety(roll);
      this.societyId.set(result.primary);
      this.societyLastRoll.set(roll);
      if (result.isIntSec && !this.coverSocietyId()) {
        let coverRoll = d20();
        let tries = 0;
        while (coverRoll >= 18 && tries < 10) { coverRoll = d20(); tries++; }
        this.coverSocietyId.set(rollCoverSociety(coverRoll));
        this.coverLastRoll.set(coverRoll);
      }
    }

    // Signal abort to the running sequence, then finalise
    this.isAutoRolling.set(false);
    this.rollState.set('done');
    this.currentStepIndex.set(8); // land on notes — player writes their own
  }

  // ── Step navigation ───────────────────────────────────────────────────────

  private readonly _router  = inject(Router);
  private readonly _storage = inject(CharacterStorageService);

  finalise(): void {
    const mut    = this.mutationId()     ? MUTATION_BY_ID[this.mutationId()!]         : null;
    const soc    = this.societyId()      ? SECRET_SOCIETY_BY_ID[this.societyId()!]    : null;
    const cover  = this.coverSocietyId() ? SECRET_SOCIETY_BY_ID[this.coverSocietyId()!] : null;
    const sg     = this.serviceGroupId() ? SERVICE_GROUP_BY_ID[this.serviceGroupId()!] : null;

    this._draft.snapshot.set({
      firstName:            this.firstName(),
      sectorCode:           this.sectorCode(),
      cloneNumber:          this.cloneNumber(),
      clearance:            this.clearance(),
      playerName:           this.playerName(),
      fullName:             this.fullName(),
      serviceGroupId:       this.serviceGroupId(),
      serviceGroupLabel:    sg?.label ?? '',
      serviceGroupDescription: sg?.description ?? '',
      attributes:           this.attributes().map(a => ({ id: a.id, label: a.label, value: a.value ?? 0 })),
      skills:               this.skillSlots().map(s => ({
        id: s.id, label: s.label, group: s.skillGroup as string,
        value: s.value, base: s.base, max: s.max, treasonous: s.treasonous,
      })),
      weapons:              this.weaponSlots().map(w => ({ ...w })),
      armourWorn:           this.armourWorn(),
      armourType:           this.armourType(),
      armourRating:         this.armourRating(),
      equipment:            Object.entries(this.purchasedItems()).map(([id, qty]) => {
                              const item = PARANOIA_PURCHASABLE_EQUIPMENT.find(e => e.id === id);
                              return { id, name: item?.label ?? id, cost: item?.cost ?? 0, quantity: qty };
                            }),
      mutationId:           this.mutationId(),
      mutationLabel:        mut?.label ?? '',
      mutationType:         mut?.type  ?? '',
      mutationDescription:  mut?.description ?? '',
      societyId:            this.societyId(),
      societyLabel:         soc?.label ?? '',
      societyIdeology:      soc?.ideology ?? '',
      coverSocietyId:       this.coverSocietyId(),
      coverSocietyLabel:    cover?.label ?? '',
      coverSocietyIdeology: cover?.ideology ?? '',
      publicNotes:          this.publicNotes(),
      secretNotes:          this.secretNotes(),
    });

    const saveData = {
      system: 'paranoia-2e' as const,
      name: this.fullName(),
      statLine: `CLEARANCE: ${this.clearance()}`,
      snapshot: this._draft.snapshot()!,
    };
    const editingId = this._storage.editingId();
    if (editingId) {
      this._storage.update(editingId, saveData);
      this._storage.editingId.set(null);
    } else {
      this._storage.save(saveData);
    }

    this._router.navigate(['/sheet']);
  }

  nextStep(): void {
    if (!this.isLastStep()) this.currentStepIndex.update(i => i + 1);
  }

  prevStep(): void {
    if (this.currentStepIndex() > 0) this.currentStepIndex.update(i => i - 1);
  }
}
