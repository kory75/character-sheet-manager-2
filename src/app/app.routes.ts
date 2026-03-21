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
    ],
  },
];
