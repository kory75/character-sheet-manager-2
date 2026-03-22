import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CharacterStorageService } from '../../services/character-storage.service';
import { CharacterDraftService, CharacterSnapshot } from '../../services/character-draft.service';
import { DndDraftService, DndSnapshot } from '../../services/dnd-draft.service';

@Component({
  selector: 'app-load-character',
  standalone: true,
  template: ``,
})
export class LoadCharacterComponent implements OnInit {
  private readonly _storage = inject(CharacterStorageService);
  private readonly _paranoiaDraft = inject(CharacterDraftService);
  private readonly _dndDraft = inject(DndDraftService);
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);

  ngOnInit(): void {
    const id = this._route.snapshot.queryParamMap.get('id');
    if (!id) { this._router.navigate(['/']); return; }

    const saved = this._storage.getById(id);
    if (!saved) { this._router.navigate(['/']); return; }

    this._storage.editingId.set(saved.id);

    if (saved.system === 'paranoia-2e') {
      this._paranoiaDraft.snapshot.set(saved.snapshot as CharacterSnapshot);
      this._router.navigate(['/sheet']);
    } else {
      this._dndDraft.loadFromSnapshot(saved.snapshot as DndSnapshot);
      this._router.navigate(['/dnd-sheet']);
    }
  }
}
