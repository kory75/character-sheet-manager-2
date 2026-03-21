import { Component } from '@angular/core';

@Component({
  selector: 'app-placeholder',
  template: `
    <div class="max-w-5xl mx-auto p-12">
      <div class="border-l-8 border-primary-container pl-8 mb-16">
        <h1 class="font-headline text-6xl font-black uppercase tracking-tighter leading-none mb-2">
          Character <span class="text-primary-container">Synthesizer</span>
        </h1>
        <p class="font-headline text-sm text-surface-container-highest uppercase font-bold tracking-[0.2em]">
          Deployment Authorization: Required // Form 22-A-9
        </p>
      </div>
      <p class="font-body text-on-surface/40 text-sm uppercase tracking-widest">
        — Awaiting creation wizard implementation —
      </p>
    </div>
  `,
})
export class PlaceholderComponent {}
