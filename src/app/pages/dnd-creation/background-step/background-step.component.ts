import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-dnd-background-step',
  template: `
    <!-- Section header -->
    <div class="mb-6">
      <h2 class="font-headline text-xl font-bold uppercase tracking-widest dnd-gold-bar mb-2"
          style="color: #e6c364;">Shape Your History</h2>
      <p class="font-body text-sm italic" style="color: #99907e;">
        "Who you were before your life of adventure defines who you will become."
      </p>
    </div>

    <div class="dnd-divider mb-6"></div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">

      <!-- ── LEFT: Personality ── -->
      <div class="space-y-6">

        <!-- Personality Traits -->
        <div>
          <label class="block font-headline text-[9px] font-bold uppercase tracking-[0.2em] mb-2"
                 style="color: #99907e;">Personality Traits</label>
          <textarea
            class="w-full font-body text-sm outline-none p-4 resize-none"
            style="background: #161c27; color: #dde2f2; border: 1px solid #4d4637; border-radius: 0; min-height: 96px;"
            placeholder="Describe your character's personality traits…"
            [value]="personalityTraits()"
            (input)="personalityTraitsChanged.emit($any($event.target).value)"
          ></textarea>
        </div>

        <!-- Ideals -->
        <div>
          <label class="block font-headline text-[9px] font-bold uppercase tracking-[0.2em] mb-2"
                 style="color: #99907e;">Ideals</label>
          <textarea
            class="w-full font-body text-sm outline-none p-4 resize-none"
            style="background: #161c27; color: #dde2f2; border: 1px solid #4d4637; border-radius: 0; min-height: 80px;"
            placeholder="What ideals guide your character?"
            [value]="ideals()"
            (input)="idealsChanged.emit($any($event.target).value)"
          ></textarea>
        </div>

        <!-- Bonds -->
        <div>
          <label class="block font-headline text-[9px] font-bold uppercase tracking-[0.2em] mb-2"
                 style="color: #99907e;">Bonds</label>
          <textarea
            class="w-full font-body text-sm outline-none p-4 resize-none"
            style="background: #161c27; color: #dde2f2; border: 1px solid #4d4637; border-radius: 0; min-height: 80px;"
            placeholder="What bonds connect you to the world?"
            [value]="bonds()"
            (input)="bondsChanged.emit($any($event.target).value)"
          ></textarea>
        </div>

        <!-- Flaws -->
        <div>
          <label class="block font-headline text-[9px] font-bold uppercase tracking-[0.2em] mb-2"
                 style="color: #99907e;">Flaws</label>
          <textarea
            class="w-full font-body text-sm outline-none p-4 resize-none"
            style="background: #161c27; color: #dde2f2; border: 1px solid #4d4637; border-radius: 0; min-height: 80px;"
            placeholder="What flaws or weaknesses define your character?"
            [value]="flaws()"
            (input)="flawsChanged.emit($any($event.target).value)"
          ></textarea>
        </div>

      </div>

      <!-- ── RIGHT: Features & Proficiencies ── -->
      <div class="space-y-6">

        <!-- Feat from Background -->
        <div>
          <label class="block font-headline text-[9px] font-bold uppercase tracking-[0.2em] mb-2"
                 style="color: #99907e;">Feat Name (from Background)</label>
          <input
            type="text"
            class="w-full font-headline text-sm outline-none px-4 py-3 mb-3"
            style="background: #161c27; color: #dde2f2; border-bottom: 1px solid #4d4637; border-radius: 0;"
            placeholder="e.g. Lucky, Alert, Skilled…"
            [value]="featName()"
            (input)="featNameChanged.emit($any($event.target).value)"
          />
          <textarea
            class="w-full font-body text-sm outline-none p-4 resize-none"
            style="background: #161c27; color: #dde2f2; border: 1px solid #4d4637; border-radius: 0; min-height: 72px;"
            placeholder="Feat description or notes…"
            [value]="featDescription()"
            (input)="featDescriptionChanged.emit($any($event.target).value)"
          ></textarea>
        </div>

        <!-- Languages Known -->
        <div>
          <label class="block font-headline text-[9px] font-bold uppercase tracking-[0.2em] mb-2"
                 style="color: #99907e;">Languages Known</label>
          <textarea
            class="w-full font-body text-sm outline-none p-4 resize-none"
            style="background: #161c27; color: #dde2f2; border: 1px solid #4d4637; border-radius: 0; min-height: 64px;"
            placeholder="Common, Elvish, Dwarvish…"
            [value]="languagesKnown()"
            (input)="languagesKnownChanged.emit($any($event.target).value)"
          ></textarea>
        </div>

        <!-- Tool Proficiencies -->
        <div>
          <label class="block font-headline text-[9px] font-bold uppercase tracking-[0.2em] mb-2"
                 style="color: #99907e;">Tool Proficiencies</label>
          <textarea
            class="w-full font-body text-sm outline-none p-4 resize-none"
            style="background: #161c27; color: #dde2f2; border: 1px solid #4d4637; border-radius: 0; min-height: 64px;"
            placeholder="Thieves' Tools, Herbalism Kit…"
            [value]="toolProficiencies()"
            (input)="toolProficienciesChanged.emit($any($event.target).value)"
          ></textarea>
        </div>

        <!-- Other Proficiencies -->
        <div>
          <label class="block font-headline text-[9px] font-bold uppercase tracking-[0.2em] mb-2"
                 style="color: #99907e;">Other Proficiencies</label>
          <textarea
            class="w-full font-body text-sm outline-none p-4 resize-none"
            style="background: #161c27; color: #dde2f2; border: 1px solid #4d4637; border-radius: 0; min-height: 64px;"
            placeholder="Armor, weapon, or other proficiencies…"
            [value]="otherProficiencies()"
            (input)="otherProficienciesChanged.emit($any($event.target).value)"
          ></textarea>
        </div>

      </div>

    </div>
  `,
})
export class DndBackgroundStepComponent {
  readonly personalityTraits  = input<string>('');
  readonly ideals             = input<string>('');
  readonly bonds              = input<string>('');
  readonly flaws              = input<string>('');
  readonly featName           = input<string>('');
  readonly featDescription    = input<string>('');
  readonly languagesKnown     = input<string>('');
  readonly toolProficiencies  = input<string>('');
  readonly otherProficiencies = input<string>('');

  readonly personalityTraitsChanged  = output<string>();
  readonly idealsChanged             = output<string>();
  readonly bondsChanged              = output<string>();
  readonly flawsChanged              = output<string>();
  readonly featNameChanged           = output<string>();
  readonly featDescriptionChanged    = output<string>();
  readonly languagesKnownChanged     = output<string>();
  readonly toolProficienciesChanged  = output<string>();
  readonly otherProficienciesChanged = output<string>();
}
