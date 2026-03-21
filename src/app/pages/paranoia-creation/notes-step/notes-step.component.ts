import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-notes-step',
  template: `

    <!-- ══════════════════════════ PUBLIC NOTES ══ -->
    <div class="mb-10">

      <div class="flex items-baseline gap-3 mb-3">
        <h2 class="font-headline text-[11px] font-black uppercase tracking-widest text-on-surface">
          Mission Notes
        </h2>
        <span class="font-headline text-[10px] text-gray-600 font-bold uppercase">
          — Public page
        </span>
      </div>

      <div class="bg-surface-container p-1" style="border: 1px solid rgba(92,64,61,0.12); border-left: 3px solid rgba(92,64,61,0.3);">
        <textarea
          class="w-full bg-transparent font-body text-sm text-on-surface placeholder-gray-700
                 outline-none resize-none p-4 leading-relaxed"
          rows="8"
          placeholder="Record mission objectives, contacts, important findings, and other notes here.

The Computer is watching. Keep this brief and loyal."
          [value]="publicNotes()"
          (input)="publicNotesChanged.emit($any($event.target).value)"
        ></textarea>
      </div>

    </div>

    <!-- ══════════════════════════ SECRET NOTES ══ -->
    <div>

      <div class="mb-3 p-4 relative overflow-hidden"
           style="background: rgba(196,30,30,0.06); border: 1px solid rgba(196,30,30,0.25);">

        <div class="absolute inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden="true">
          <span class="font-headline font-black text-[5rem] leading-none uppercase tracking-tighter opacity-[0.04] text-primary-container">
            SECRET
          </span>
        </div>

        <div class="relative flex items-center gap-3">
          <span class="material-symbols-outlined text-primary-container text-base">lock</span>
          <div>
            <span class="font-headline text-[10px] font-black uppercase tracking-[0.2em] text-primary-container block">
              Secret Notes — Classified
            </span>
            <span class="font-headline text-[9px] text-gray-600 uppercase tracking-widest">
              Society orders, mutation details, hidden equipment. Show no one.
            </span>
          </div>
        </div>

      </div>

      <div class="bg-surface-container p-1" style="border: 1px solid rgba(196,30,30,0.2); border-left: 3px solid #c41e1e;">
        <textarea
          class="w-full bg-transparent font-body text-sm text-on-surface placeholder-gray-700
                 outline-none resize-none p-4 leading-relaxed"
          rows="8"
          placeholder="Record secret society orders, mutation notes, hidden bribes, and anything The Computer must never learn about here."
          [value]="secretNotes()"
          (input)="secretNotesChanged.emit($any($event.target).value)"
        ></textarea>
      </div>

    </div>

    <!-- ══════════════════════════ COMPLETION HINT ══ -->
    <div class="mt-10 flex items-center gap-3 text-gray-700">
      <div class="flex-1 h-px bg-surface-container"></div>
      <span class="font-headline text-[9px] uppercase tracking-[0.3em]">
        All modules complete — press FINALISE to generate your dossier
      </span>
      <div class="flex-1 h-px bg-surface-container"></div>
    </div>

  `,
})
export class NotesStepComponent {
  readonly publicNotes  = input<string>('');
  readonly secretNotes  = input<string>('');

  readonly publicNotesChanged  = output<string>();
  readonly secretNotesChanged  = output<string>();
}
