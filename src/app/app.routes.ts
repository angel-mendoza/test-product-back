import { Routes } from '@angular/router';

import { HomePage } from '../app/pages/home/home';
import { NotFoundPage } from '../app/pages/not-found/not-found';

export const routes: Routes = [
  { path: '', component: HomePage },
  { path: '**', component: NotFoundPage }
];
