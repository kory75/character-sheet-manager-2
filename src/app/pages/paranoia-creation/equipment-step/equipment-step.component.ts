import { Component, computed, input, output } from '@angular/core';
import {
  PARANOIA_DEFAULT_EQUIPMENT,
  PARANOIA_PURCHASABLE_EQUIPMENT,
} from '../../../games/paranoia-2e/data/equipment.data';

const STARTING_CREDITS = 100;

@Component({
  selector: 'app-equipment-step',
  template: `

    <!-- ══════════════════════════ CREDITS TRACKER ══ -->
    <div class="sticky top-0 z-30 pb-4 mb-2 bg-background">
      <div class="bg-surface-container px-5 py-3 flex items-center gap-4"
           style="border-bottom: 2px solid rgba(196,30,30,0.4);">

        <span class="font-headline text-[10px] font-black uppercase tracking-widest text-gray-500 whitespace-nowrap">
          Plasticredits
        </span>

        <span
          class="font-headline text-3xl font-black leading-none transition-colors duration-200"
          [class.text-primary-container]="creditsRemaining() > 0"
          [class.text-gray-600]="creditsRemaining() === 0"
        >{{ creditsRemaining() }}</span>

        <span class="font-headline text-[10px] font-bold text-gray-600">/ {{ startingCredits }}</span>

        <div class="flex-1 h-1 bg-surface-container-lowest">
          <div
            class="h-full transition-all duration-300"
            [class.bg-primary-container]="creditsRemaining() > 20"
            [class.bg-yellow-600]="creditsRemaining() > 0 && creditsRemaining() <= 20"
            [class.bg-gray-700]="creditsRemaining() === 0"
            [style.width]="(creditsRemaining() / startingCredits * 100) + '%'"
          ></div>
        </div>

        @if (creditsRemaining() === 0) {
          <span class="font-headline text-[10px] font-bold uppercase tracking-widest text-gray-600 whitespace-nowrap">
            FULLY SPENT
          </span>
        }

      </div>
    </div>

    <!-- ══════════════════════════ STANDARD ISSUE ══ -->
    <div class="mb-8">

      <div class="flex items-baseline gap-3 mb-3">
        <h2 class="font-headline text-[11px] font-black uppercase tracking-widest text-on-surface">
          Standard Issue
        </h2>
        <span class="font-headline text-[10px] text-gray-600 font-bold uppercase">
          — Issued at no charge
        </span>
      </div>

      <div class="bg-surface-container" style="border: 1px solid rgba(92,64,61,0.12); border-left: 3px solid #c41e1e;">
        @for (item of defaultItems; track item.id; let last = $last) {
          <div
            class="flex items-center gap-3 px-4 py-2.5"
            [style.border-bottom]="last ? 'none' : '1px solid rgba(92,64,61,0.1)'"
          >
            <span class="material-symbols-outlined text-sm text-primary-container">check</span>
            <span class="font-body text-sm text-on-surface flex-1">{{ item.label }}</span>
            @if (item.notes) {
              <span class="font-headline text-[9px] text-gray-600 uppercase hidden md:block">{{ item.notes }}</span>
            }
            <span class="font-headline text-[10px] font-black text-gray-700 uppercase tracking-wide whitespace-nowrap">
              ISSUED
            </span>
          </div>
        }
      </div>

    </div>

    <!-- ══════════════════════════ EQUIPMENT SHOP ══ -->
    <div>

      <div class="flex items-baseline gap-3 mb-3">
        <h2 class="font-headline text-[11px] font-black uppercase tracking-widest text-on-surface">
          Requisition Additional Equipment
        </h2>
        <span class="font-headline text-[10px] text-gray-600 font-bold uppercase">
          — {{ totalItemsCount() }} items purchased
        </span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-1">
        @for (item of shopItems; track item.id) {
          @let qty = qtyOf(item.id);
          @let canAfford = creditsRemaining() >= item.cost;

          <div
            class="flex items-center gap-3 px-4 py-2.5 bg-surface-container transition-colors"
            [class.bg-primary-container/[0.05]]="qty > 0"
            style="border: 1px solid rgba(92,64,61,0.1);"
          >

            <!-- Item label + cost -->
            <div class="flex-1 min-w-0">
              <span
                class="font-body text-sm block truncate"
                [class.text-on-surface]="qty > 0"
                [class.text-gray-500]="qty === 0"
              >{{ item.label }}</span>
              @if (item.notes) {
                <span class="font-headline text-[9px] text-gray-700 uppercase">{{ item.notes }}</span>
              }
            </div>

            <!-- Cost per unit -->
            <span
              class="font-headline text-[10px] font-black whitespace-nowrap shrink-0"
              [class.text-primary-container]="qty > 0"
              [class.text-gray-600]="qty === 0"
            >{{ item.cost }}₡</span>

            <!-- Quantity stepper -->
            <div class="flex items-center gap-0 shrink-0">

              <!-- Minus -->
              <button
                class="w-7 h-7 flex items-center justify-center font-black text-sm transition-colors bg-surface-container-highest"
                style="border: 1px solid rgba(92,64,61,0.15);"
                [class.text-gray-600]="qty > 0"
                [class.text-gray-800]="qty === 0"
                [class.hover:bg-primary-container]="qty > 0"
                [class.hover:text-white]="qty > 0"
                [class.cursor-not-allowed]="qty === 0"
                [class.opacity-25]="qty === 0"
                (click)="qty > 0 && remove.emit(item.id)"
              >−</button>

              <!-- Quantity -->
              <span
                class="font-headline font-black w-8 text-center text-sm"
                [class.text-primary-container]="qty > 0"
                [class.text-gray-600]="qty === 0"
              >{{ qty }}</span>

              <!-- Plus -->
              <button
                class="w-7 h-7 flex items-center justify-center font-black text-sm transition-colors bg-surface-container-highest"
                style="border: 1px solid rgba(92,64,61,0.15);"
                [class.text-gray-600]="canAfford"
                [class.text-gray-800]="!canAfford"
                [class.hover:bg-primary-container]="canAfford"
                [class.hover:text-white]="canAfford"
                [class.cursor-not-allowed]="!canAfford"
                [class.opacity-25]="!canAfford"
                (click)="canAfford && add.emit(item.id)"
              >+</button>

            </div>

            <!-- Running subtotal when qty > 1 -->
            <span
              class="font-headline text-[10px] font-bold w-12 text-right shrink-0"
              [class.text-primary-container]="qty > 1"
              [class.text-gray-700]="qty <= 1"
            >{{ qty > 1 ? (qty * item.cost) + '₡' : '' }}</span>

          </div>
        }
      </div>

    </div>

  `,
})
export class EquipmentStepComponent {
  readonly purchasedItems   = input.required<Record<string, number>>();
  readonly creditsRemaining = input.required<number>();

  readonly add    = output<string>();
  readonly remove = output<string>();

  readonly startingCredits = STARTING_CREDITS;
  readonly defaultItems    = PARANOIA_DEFAULT_EQUIPMENT;
  readonly shopItems       = PARANOIA_PURCHASABLE_EQUIPMENT;

  readonly totalItemsCount = computed(() =>
    Object.values(this.purchasedItems()).reduce((s, q) => s + q, 0)
  );

  qtyOf(id: string): number {
    return this.purchasedItems()[id] ?? 0;
  }
}
