import { Component, input, output } from '@angular/core';

export interface AttributeSlot {
  id: string;
  label: string;
  value: number | null;
  isRolling: boolean;
  flashSettled: boolean;
}

@Component({
  selector: 'app-attribute-grid',
  template: `
    <div class="grid grid-cols-2 lg:grid-cols-4 bg-background"
         style="border: 1px solid rgba(92,64,61,0.2);">

      @for (attr of attributes(); track attr.id; let i = $index) {
        <div
          class="p-8 hover:bg-surface-container transition-colors group"
          style="border-right: 1px solid rgba(92,64,61,0.2);
                 border-bottom: 1px solid rgba(92,64,61,0.2);"
        >
          <!-- Label -->
          <label class="block font-headline text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">
            {{ attr.label }}
          </label>

          <!-- Value + Dice button row -->
          <div class="flex items-end justify-between">

            <!-- Value -->
            <span
              class="font-headline text-5xl font-black leading-none transition-all duration-150"
              [class.text-primary-container]="attr.value !== null"
              [class.text-gray-600]="attr.value === null"
              [class.blur-sm]="attr.isRolling"
              [class.opacity-50]="attr.isRolling"
              [class.dice-flash]="attr.flashSettled"
            >
              {{ attr.value !== null ? formatValue(attr.value) : '—' }}
            </span>

            <!-- Dice button — group-hover must be static -->
            <button
              class="p-2 bg-surface-container-highest group-hover:bg-primary-container
                     text-primary-container group-hover:text-white transition-colors"
              [class.opacity-50]="attr.isRolling"
              [class.cursor-not-allowed]="attr.isRolling"
              [attr.aria-label]="'Roll ' + attr.label"
              [attr.aria-disabled]="attr.isRolling"
              (click)="!attr.isRolling && rollOne.emit(i)"
            >
              <span
                class="material-symbols-outlined text-lg"
                [class.dice-spin]="attr.isRolling"
              >casino</span>
            </button>

          </div>

          <!-- Progress bar -->
          <div class="mt-4 h-1 w-full bg-surface-container-low">
            <div
              class="h-full bg-primary-container transition-all duration-300"
              [style.width]="attr.value !== null ? (attr.value / 20 * 100) + '%' : '0%'"
            ></div>
          </div>

        </div>
      }

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
    .dice-spin {
      animation: dice-spin 400ms ease-in-out 1;
    }

    @keyframes dice-flash-anim {
      0%   { background-color: rgba(245, 197, 66, 0.4); border-radius: 2px; }
      100% { background-color: transparent; }
    }
    .dice-flash {
      animation: dice-flash-anim 600ms ease-out forwards;
    }
  `],
})
export class AttributeGridComponent {
  readonly attributes = input.required<AttributeSlot[]>();
  readonly rollOne    = output<number>();

  formatValue(n: number): string {
    return n < 10 ? '0' + n : String(n);
  }
}
