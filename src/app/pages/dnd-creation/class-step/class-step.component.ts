import { Component, computed, input, output } from '@angular/core';
import { HIT_DIE_BY_CLASS } from '../../../games/dnd-5e-2024/creation-rules';

interface ClassCard {
  id: string;
  name: string;
  hitDie: number;
}

const CLASSES: ClassCard[] = [
  { id: 'artificer', name: 'Artificer',  hitDie: 8  },
  { id: 'barbarian', name: 'Barbarian',  hitDie: 12 },
  { id: 'bard',      name: 'Bard',       hitDie: 8  },
  { id: 'cleric',    name: 'Cleric',     hitDie: 8  },
  { id: 'druid',     name: 'Druid',      hitDie: 8  },
  { id: 'fighter',   name: 'Fighter',    hitDie: 10 },
  { id: 'monk',      name: 'Monk',       hitDie: 8  },
  { id: 'paladin',   name: 'Paladin',    hitDie: 10 },
  { id: 'ranger',    name: 'Ranger',     hitDie: 10 },
  { id: 'rogue',     name: 'Rogue',      hitDie: 8  },
  { id: 'sorcerer',  name: 'Sorcerer',   hitDie: 6  },
  { id: 'warlock',   name: 'Warlock',    hitDie: 8  },
  { id: 'wizard',    name: 'Wizard',     hitDie: 6  },
];

const SUBCLASSES: Record<string, string[]> = {
  artificer: ['Alchemist', 'Armorer', 'Artillerist', 'Battle Smith'],
  barbarian: ['Berserker', 'Storm Herald', 'Totem Warrior', 'Wild Magic', 'Zealot'],
  bard:      ['College of Creation', 'College of Eloquence', 'College of Glamour', 'College of Lore'],
  cleric:    ['Arcana', 'Death', 'Forge', 'Grave', 'Knowledge', 'Life', 'Light', 'Nature', 'Order', 'Peace', 'Tempest', 'Trickery', 'Twilight', 'War'],
  druid:     ['Circle of the Land', 'Circle of the Moon', 'Circle of Spores', 'Circle of Stars'],
  fighter:   ['Battle Master', 'Cavalier', 'Champion', 'Eldritch Knight'],
  monk:      ['Astral Self', 'Drunken Master', 'Four Elements', 'Kensei', 'Long Death', 'Mercy', 'Open Hand', 'Shadow', 'Sun Soul'],
  paladin:   ['Conquest', 'Devotion', 'Glory', 'Redemption', 'Vengeance', 'Watchers', 'Ancients'],
  ranger:    ['Beast Master', 'Fey Wanderer', 'Gloom Stalker', 'Hunter', 'Swarmkeeper'],
  rogue:     ['Arcane Trickster', 'Assassin', 'Inquisitive', 'Mastermind', 'Phantom', 'Scout', 'Soulknife', 'Swashbuckler', 'Thief'],
  sorcerer:  ['Aberrant Mind', 'Clockwork Soul', 'Draconic Bloodline', 'Shadow Magic', 'Storm Sorcery', 'Wild Magic'],
  warlock:   ['Archfey', 'Celestial', 'Fiend', 'Genie', 'Great Old One', 'Hexblade', 'Undead'],
  wizard:    ['Abjuration', 'Bladesinging', 'Chronurgy', 'Graviturgy', 'Conjuration', 'Divination', 'Enchantment', 'Evocation', 'Illusion', 'Necromancy', 'Order of Scribes', 'Transmutation', 'War Magic'],
};

@Component({
  selector: 'app-dnd-class-step',
  template: `
    <!-- Section header -->
    <div class="mb-6">
      <h2 class="font-headline text-xl font-bold uppercase tracking-widest dnd-gold-bar mb-2"
          style="color: #e6c364;">Embrace Your Calling</h2>
      <p class="font-body text-sm italic" style="color: #99907e;">
        "Your class is your martial discipline, arcane pursuit, or sacred calling."
      </p>
    </div>

    <div class="dnd-divider mb-6"></div>

    <!-- Class card grid -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
      @for (cls of classList; track cls.id) {
        <button
          class="dnd-stat-box p-4 text-left transition-all hover:brightness-110"
          style="border-radius: 0;"
          [style.box-shadow]="characterClass() === cls.id ? '0 0 20px rgba(230,195,100,0.2)' : 'none'"
          [style.border-left]="characterClass() === cls.id ? '3px solid #e6c364' : '2px solid rgba(230,195,100,0.25)'"
          (click)="classChanged.emit(cls.id)"
        >
          <span
            class="font-headline text-sm font-bold uppercase tracking-wider block mb-1"
            [style.color]="characterClass() === cls.id ? '#e6c364' : '#dde2f2'"
          >{{ cls.name }}</span>
          <span class="font-headline text-[10px] uppercase tracking-widest" style="color: #99907e;">
            Hit Die: d{{ cls.hitDie }}
          </span>
        </button>
      }
    </div>

    <!-- Hit Die display box -->
    @if (characterClass()) {
      <div class="flex items-center gap-4 mb-8 p-4"
           style="background: #1a202b; border: 1px solid #4d4637;">
        <div class="text-center px-6 py-3" style="background: #2f3541; border-left: 2px solid #e6c364;">
          <p class="font-headline text-[9px] uppercase tracking-widest mb-1" style="color: #99907e;">Hit Die</p>
          <p class="font-headline text-3xl font-bold" style="color: #e6c364;">d{{ hitDieSize() }}</p>
        </div>
        <div>
          <p class="font-headline text-xs uppercase tracking-wider" style="color: #dde2f2;">
            {{ selectedClassName() }}
          </p>
          <p class="font-body text-xs" style="color: #99907e;">
            Hit points per level: {{ hitDieAvg() }} + Constitution modifier
          </p>
        </div>
      </div>
    }

    <!-- Subclass section -->
    @if (characterClass()) {
      <div>
        <h3 class="font-headline text-sm font-bold uppercase tracking-widest dnd-gold-bar mb-3"
            style="color: #e6c364;">Subclass</h3>

        @if (characterLevel() < 3) {
          <div class="p-4 mb-4" style="background: #1a202b; border: 1px solid #4d4637; opacity: 0.6;">
            <p class="font-headline text-xs uppercase tracking-wider" style="color: #99907e;">
              Subclass available at Level 3
            </p>
            <p class="font-body text-xs mt-1" style="color: #4d4637;">
              Your character gains their subclass at 3rd level. You can pre-select one below.
            </p>
          </div>
        }

        <div class="flex flex-col" style="border: 1px solid #4d4637;"
             [style.opacity]="characterLevel() < 3 ? '0.6' : '1'">
          @for (sub of availableSubclasses(); track sub) {
            <button
              class="flex items-center gap-3 px-3 py-2 transition-all text-left"
              [style.background]="subclass() === sub ? 'rgba(230,195,100,0.08)' : 'transparent'"
              [style.border-left]="subclass() === sub ? '3px solid #e6c364' : '3px solid transparent'"
              (click)="subclassChanged.emit(sub)"
            >
              <span
                class="font-headline text-[10px] uppercase tracking-widest flex-1"
                [style.color]="subclass() === sub ? '#e6c364' : '#d0c5b2'"
              >{{ sub }}</span>
              @if (subclass() === sub) {
                <span class="font-headline text-[8px] uppercase tracking-widest" style="color: #e6c364;">Selected</span>
              }
            </button>
            @if (!$last) {
              <div style="height: 1px; background: rgba(77,70,55,0.4);"></div>
            }
          }
        </div>
      </div>
    }
  `,
})
export class DndClassStepComponent {
  readonly characterClass  = input<string>('');
  readonly subclass        = input<string>('');
  readonly characterLevel  = input<number>(1);

  readonly classChanged    = output<string>();
  readonly subclassChanged = output<string>();

  readonly classList = CLASSES;

  readonly hitDieSize = computed(() => {
    const cls = this.characterClass();
    return HIT_DIE_BY_CLASS[cls] ?? 8;
  });

  readonly hitDieAvg = computed(() => {
    return Math.floor(this.hitDieSize() / 2) + 1;
  });

  readonly selectedClassName = computed(() => {
    const found = this.classList.find(c => c.id === this.characterClass());
    return found?.name ?? '';
  });

  readonly availableSubclasses = computed<string[]>(() => {
    const cls = this.characterClass();
    return SUBCLASSES[cls] ?? [];
  });
}
