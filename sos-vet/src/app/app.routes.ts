import { HttpClientModule } from '@angular/common/http';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
    providers: [HttpClientModule], // Asegúrate de incluir HttpClientModule aquí
  },
];
