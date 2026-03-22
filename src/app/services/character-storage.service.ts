import { Injectable, signal } from '@angular/core';
import { CharacterSnapshot } from './character-draft.service';
import { DndSnapshot } from './dnd-draft.service';

export type GameSystem = 'paranoia-2e' | 'dnd-5e-2024';

export interface SavedCharacter {
  id: string;
  system: GameSystem;
  name: string;
  statLine: string;
  savedAt: number;
  snapshot: CharacterSnapshot | DndSnapshot;
}

@Injectable({ providedIn: 'root' })
export class CharacterStorageService {
  private static readonly PREFIX = 'codex:character:';
  private static readonly INDEX_KEY = 'codex:index';

  private readonly _characters = signal<SavedCharacter[]>([]);
  readonly characters = this._characters.asReadonly();

  /** Set before navigating to a creation wizard to overwrite on finalise instead of creating a new entry. */
  readonly editingId = signal<string | null>(null);

  constructor() { this._loadFromStorage(); }

  save(data: Omit<SavedCharacter, 'id' | 'savedAt'>): SavedCharacter {
    const entry: SavedCharacter = { ...data, id: crypto.randomUUID(), savedAt: Date.now() };
    localStorage.setItem(CharacterStorageService.PREFIX + entry.id, JSON.stringify(entry));
    this._updateIndex(ids => [...ids, entry.id]);
    this._characters.update(list => [...list, entry]);
    return entry;
  }

  update(id: string, data: Omit<SavedCharacter, 'id' | 'savedAt'>): SavedCharacter {
    const entry: SavedCharacter = { ...data, id, savedAt: Date.now() };
    localStorage.setItem(CharacterStorageService.PREFIX + id, JSON.stringify(entry));
    this._characters.update(list => list.map(c => c.id === id ? entry : c));
    return entry;
  }

  delete(id: string): void {
    localStorage.removeItem(CharacterStorageService.PREFIX + id);
    this._updateIndex(ids => ids.filter(i => i !== id));
    this._characters.update(list => list.filter(c => c.id !== id));
  }

  getById(id: string): SavedCharacter | undefined {
    return this._characters().find(c => c.id === id);
  }

  private _loadFromStorage(): void {
    const raw = localStorage.getItem(CharacterStorageService.INDEX_KEY);
    const ids: string[] = raw ? JSON.parse(raw) : [];
    const loaded: SavedCharacter[] = [];
    for (const id of ids) {
      try {
        const item = localStorage.getItem(CharacterStorageService.PREFIX + id);
        if (item) loaded.push(JSON.parse(item));
      } catch { /* skip corrupt entries */ }
    }
    this._characters.set(loaded);
  }

  private _updateIndex(fn: (ids: string[]) => string[]): void {
    const raw = localStorage.getItem(CharacterStorageService.INDEX_KEY);
    const ids: string[] = raw ? JSON.parse(raw) : [];
    localStorage.setItem(CharacterStorageService.INDEX_KEY, JSON.stringify(fn(ids)));
  }
}
