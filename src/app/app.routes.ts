import { Routes } from '@angular/router';

import { HomePage } from '../app/pages/home/home';
import { NotFoundPage } from '../app/pages/not-found/not-found';

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'products', component: HomePage },
  { path: 'products/create', component: HomePage },
  { path: 'products/:idProduct/edit', component: HomePage },
  { path: '**', component: NotFoundPage }
];
