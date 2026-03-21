# Auto-Roll Character — Sequence Design

**Version:** 1.1
**Date:** 2026-03-21
**Status:** Implemented for both Paranoia and D&D 5e

> **Paranoia:** Full sequence built (attributes → service group → skills → weapons → mutation → society).
> **D&D:** Sequence built (identity → species → class → ability scores animated → skills random pick → steps 5–9 flash navigation). Steps 5–9 do not fill real data yet — pending auto-roll content for combat, equipment, spells, background.

---

## Overview

The AUTO-ROLL CHARACTER button triggers a cinematic, automated character creation
sequence. The wizard navigates through each step in order, plays each step's roll
animation, then advances — as if The Computer is generating the Troubleshooter on
your behalf. A SKIP button is available at any point to immediately fill all
remaining steps and jump to completion.

---

## Sequence Steps

| # | Step | Action | Est. Duration |
|---|---|---|---|
| 1 | Attributes | Cascade-roll all 8 attributes (120ms apart) | ~1.4s |
| 2 | Service Group | Dice spin → auto-select via d20 roll table | ~0.5s |
| 3 | Skills | Flash-allocate points (service group skills first, remainder distributed) | ~1.0s |
| 4 | Weapons | Pre-fill standard loadout | ~0.3s |
| 5 | Mutation | Dice spin → assign mutation | ~0.5s |
| 6 | Society | Dice spin → assign primary + cover society | ~0.5s |
| 7 | Notes | **Stop** — user writes their own notes | — |

**Total sequence time (all steps built):** ~4–5 seconds.

Between each step there is a 300–400ms pause before the wizard advances, giving the
user time to see the result before the screen changes.

---

## Button States

| State | Label | Appearance |
|---|---|---|
| `idle` | AUTO-ROLL CHARACTER | Full `primary-container` red, dice icon |
| `rolling` | ROLLING... | Same background, 70% opacity, `cursor-not-allowed`, dice spinning |
| `done` | AUTO-ROLL CHARACTER | Same as idle (RE-ROLL ALL ghost button appears beside it) |

RE-ROLL ALL resets all character state and restarts the sequence from the beginning.

---

## Skip Button

- Visible only while the sequence is running (`isAutoRolling === true`).
- Positioned beside the main AUTO-ROLL button.
- On click: fills all remaining steps instantly (no animation), sets
  `currentStepIndex` to the last auto-fillable step (Society), ends sequence.
- Label: "SKIP ANIMATION"
- Style: ghost / secondary button (outline border, no fill).

---

## Architecture

### State ownership

All character state lives in `ParanoiaCreationComponent`. Child step components are
purely presentational — they receive state via `input()` and emit user interactions
via `output()`.

Signals added to `ParanoiaCreationComponent`:

```typescript
isAutoRolling         = signal(false);
serviceGroupIsRolling = signal(false);
serviceGroupLastRoll  = signal<number | null>(null);
// (future steps add their own isRolling / result signals here)
```

### ServiceGroupStepComponent changes

| Before | After |
|---|---|
| `isRolling` — internal signal | `isRolling = input<boolean>(false)` |
| `lastRoll` — internal signal | `lastRoll = input<number \| null>(null)` |
| Dice button calls `roll()` directly | Dice button emits `rollRequested` output |

Parent handles all roll logic; child only displays state and fires events.

### Sequence implementation

```typescript
private wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async runAutoRoll(): Promise<void> {
  this.rollState.set('rolling');
  this.isAutoRolling.set(true);

  // ── Step 1: ATTRIBUTES ────────────────────────────────────────
  this.currentStepIndex.set(1);
  await this.wait(300);
  ATTRIBUTE_DEFS.forEach((_, i) =>
    setTimeout(() => this.rollSingle(i), i * 120)
  );
  await this.wait(ATTRIBUTE_DEFS.length * 120 + 600); // ~1560ms

  // ── Step 2: SERVICE GROUP ─────────────────────────────────────
  this.currentStepIndex.set(2);
  await this.wait(400);
  this.serviceGroupIsRolling.set(true);
  await this.wait(500);
  const sgRoll = d20();
  const sg = PARANOIA_SERVICE_GROUPS.find(
    g => sgRoll >= g.d20Min && sgRoll <= g.d20Max
  )!;
  this.serviceGroupId.set(sg.id);
  this.serviceGroupLastRoll.set(sgRoll);
  this.serviceGroupIsRolling.set(false);
  await this.wait(600);

  // ── Future steps appended here as they are built ──────────────

  this.isAutoRolling.set(false);
  this.rollState.set('done');
}
```

### Skip implementation

```typescript
skipAutoRoll(): void {
  // Fill all remaining steps instantly, no animation
  if (!this.serviceGroupId()) {
    const roll = d20();
    const sg = PARANOIA_SERVICE_GROUPS.find(g => roll >= g.d20Min && roll <= g.d20Max)!;
    this.serviceGroupId.set(sg.id);
    this.serviceGroupLastRoll.set(roll);
  }
  // (future steps: fill their state here)

  this.serviceGroupIsRolling.set(false);
  this.isAutoRolling.set(false);
  this.rollState.set('done');
  this.currentStepIndex.set(/* last auto-fillable step index */);
}
```

---

## Extension Pattern

When a new step is built, add its entry to the sequence by:

1. Adding the step's rolling/result signals to `ParanoiaCreationComponent`.
2. Appending the `await`-based block to `runAutoRoll()`.
3. Adding the instant-fill logic to `skipAutoRoll()`.
4. Updating the step's child component to accept `isRolling` and result state as
   inputs (if it has a roll animation), and emit `rollRequested` for manual use.
