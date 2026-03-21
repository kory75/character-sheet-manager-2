import { Component, input, output } from '@angular/core';

interface SpeciesCard {
  id: string;
  name: string;
  trait: string;
}

const SPECIES: SpeciesCard[] = [
  { id: 'aasimar',    name: 'Aasimar',    trait: 'Celestial legacy. Healing Hands and Light Bearer.' },
  { id: 'dragonborn', name: 'Dragonborn', trait: 'Draconic ancestry. Breath Weapon and Damage Resistance.' },
  { id: 'dwarf',      name: 'Dwarf',      trait: 'Dwarven Resilience. Stonecunning and Darkvision.' },
  { id: 'elf',        name: 'Elf',        trait: 'Keen Senses. Fey Ancestry, Trance, and Darkvision.' },
  { id: 'gnome',      name: 'Gnome',      trait: 'Gnomish Cunning. Advantage on Int, Wis, Cha magic saves.' },
  { id: 'goliath',    name: 'Goliath',    trait: 'Large Form. Stone\'s Endurance and Powerful Build.' },
  { id: 'halfling',   name: 'Halfling',   trait: 'Lucky. Brave, and Halfling Nimbleness.' },
  { id: 'human',      name: 'Human',      trait: 'Versatile. Resourceful Feat and Skilled Feat.' },
  { id: 'orc',        name: 'Orc',        trait: 'Adrenaline Rush. Powerful Build and Darkvision.' },
  { id: 'tiefling',   name: 'Tiefling',   trait: 'Infernal legacy. Fiendish Resistance and Spellcasting.' },
];

@Component({
  selector: 'app-dnd-species-step',
  template: `
    <!-- Section header -->
    <div class="mb-6">
      <h2 class="font-headline text-xl font-bold uppercase tracking-widest dnd-gold-bar mb-2"
          style="color: #e6c364;">Choose Your Heritage</h2>
      <p class="font-body text-sm italic" style="color: #99907e;">
        "Your species shapes your innate abilities and your place in the world."
      </p>
    </div>

    <div class="dnd-divider mb-6"></div>

    <!-- Species card grid — 2 columns -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      @for (sp of speciesList; track sp.id) {
        <button
          class="dnd-stat-box p-5 text-left transition-all hover:brightness-110 group"
          style="border-radius: 0;"
          [style.box-shadow]="species() === sp.id ? '0 0 20px rgba(230,195,100,0.2)' : 'none'"
          [style.border-left]="species() === sp.id ? '3px solid #e6c364' : '2px solid rgba(230,195,100,0.25)'"
          (click)="speciesChanged.emit(sp.id)"
        >
          <!-- Flourishes for selected card -->
          @if (species() === sp.id) {
            <div class="dnd-flourish-tl"></div>
            <div class="dnd-flourish-br"></div>
          }

          <div class="flex items-start justify-between mb-2">
            <span
              class="font-headline text-sm font-bold uppercase tracking-wider"
              [style.color]="species() === sp.id ? '#e6c364' : '#dde2f2'"
            >{{ sp.name }}</span>
            @if (species() === sp.id) {
              <span class="font-headline text-[8px] uppercase tracking-widest" style="color: #e6c364;">Selected</span>
            }
          </div>
          <p class="font-body text-xs leading-relaxed" style="color: #99907e;">{{ sp.trait }}</p>
        </button>
      }
    </div>
  `,
})
export class DndSpeciesStepComponent {
  readonly species       = input<string>('');
  readonly speciesChanged = output<string>();

  readonly speciesList = SPECIES;
}
