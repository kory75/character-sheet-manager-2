import { Routes } from '@angular/router';
import { ShellComponent } from './layout/shell/shell.component';

export const routes: Routes = [
  {
    // Home — standalone, no shell
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then(m => m.HomeComponent),
  },
  {
    // Game routes — wrapped in shell (Paranoia sidebar/header)
    path: '',
    component: ShellComponent,
    children: [
      {
        path: 'paranoia',
        loadComponent: () =>
          import('./pages/paranoia-creation/paranoia-creation.component')
            .then(m => m.ParanoiaCreationComponent),
      },
      {
        path: 'sheet',
        loadComponent: () =>
          import('./pages/paranoia-sheet/paranoia-sheet.component')
            .then(m => m.ParanoiaSheetComponent),
      },
      {
        path: 'dnd',
        loadComponent: () =>
          import('./pages/dnd-creation/dnd-creation.component')
            .then(m => m.DndCreationComponent),
      },
      {
        path: 'dnd-sheet',
        loadComponent: () =>
          import('./pages/dnd-sheet/dnd-sheet.component')
            .then(m => m.DndSheetComponent),
      },
      {
        path: 'load',
        loadComponent: () =>
          import('./pages/load-character/load-character.component')
            .then(m => m.LoadCharacterComponent),
      },
    ],
  },
];
