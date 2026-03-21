import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-dnd-notes-step',
  template: `
    <!-- Section header -->
    <div class="mb-6">
      <h2 class="font-headline text-xl font-bold uppercase tracking-widest dnd-gold-bar mb-2"
          style="color: #e6c364;">Chronicle Your Tale</h2>
      <p class="font-body text-sm italic" style="color: #99907e;">
        "Every hero has a story. Let yours be remembered."
      </p>
    </div>

    <div class="dnd-divider mb-6"></div>

    <div class="space-y-6">

      <!-- Backstory -->
      <div>
        <label class="block font-headline text-[9px] font-bold uppercase tracking-[0.2em] mb-2"
               style="color: #99907e;">Backstory</label>
        <textarea
          class="w-full font-body text-sm outline-none p-4 resize-none"
          style="background: #161c27; color: #dde2f2; border: 1px solid #4d4637; border-radius: 0; min-height: 140px;"
          placeholder="Describe your character's history, origins, and the events that led them to adventure…"
          [value]="backstory()"
          (input)="backstoryChanged.emit($any($event.target).value)"
        ></textarea>
      </div>

      <!-- Allies & Organizations -->
      <div>
        <label class="block font-headline text-[9px] font-bold uppercase tracking-[0.2em] mb-2"
               style="color: #99907e;">Allies &amp; Organizations</label>
        <textarea
          class="w-full font-body text-sm outline-none p-4 resize-none"
          style="background: #161c27; color: #dde2f2; border: 1px solid #4d4637; border-radius: 0; min-height: 96px;"
          placeholder="List allies, organizations, factions, and contacts…"
          [value]="alliesOrganizations()"
          (input)="alliesOrganizationsChanged.emit($any($event.target).value)"
        ></textarea>
      </div>

      <!-- Additional Features & Traits -->
      <div>
        <label class="block font-headline text-[9px] font-bold uppercase tracking-[0.2em] mb-2"
               style="color: #99907e;">Additional Features &amp; Traits</label>
        <textarea
          class="w-full font-body text-sm outline-none p-4 resize-none"
          style="background: #161c27; color: #dde2f2; border: 1px solid #4d4637; border-radius: 0; min-height: 96px;"
          placeholder="Note class features, racial traits, and other special abilities…"
          [value]="additionalFeatures()"
          (input)="additionalFeaturesChanged.emit($any($event.target).value)"
        ></textarea>
      </div>

      <!-- Treasure -->
      <div>
        <label class="block font-headline text-[9px] font-bold uppercase tracking-[0.2em] mb-2"
               style="color: #99907e;">Treasure</label>
        <textarea
          class="w-full font-body text-sm outline-none p-4 resize-none"
          style="background: #161c27; color: #dde2f2; border: 1px solid #4d4637; border-radius: 0; min-height: 80px;"
          placeholder="Special treasures, magic items, and heirlooms…"
          [value]="treasure()"
          (input)="treasureChanged.emit($any($event.target).value)"
        ></textarea>
      </div>

      <!-- General Notes -->
      <div>
        <label class="block font-headline text-[9px] font-bold uppercase tracking-[0.2em] mb-2"
               style="color: #99907e;">Notes</label>
        <textarea
          class="w-full font-body text-sm outline-none p-4 resize-none"
          style="background: #161c27; color: #dde2f2; border: 1px solid #4d4637; border-radius: 0; min-height: 120px;"
          placeholder="Any other notes, reminders, or session details…"
          [value]="notes()"
          (input)="notesChanged.emit($any($event.target).value)"
        ></textarea>
      </div>

    </div>
  `,
})
export class DndNotesStepComponent {
  readonly backstory           = input<string>('');
  readonly alliesOrganizations = input<string>('');
  readonly additionalFeatures  = input<string>('');
  readonly treasure            = input<string>('');
  readonly notes               = input<string>('');

  readonly backstoryChanged           = output<string>();
  readonly alliesOrganizationsChanged = output<string>();
  readonly additionalFeaturesChanged  = output<string>();
  readonly treasureChanged            = output<string>();
  readonly notesChanged               = output<string>();
}
