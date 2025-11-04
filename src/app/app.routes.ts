import { Routes } from '@angular/router';

import { HomePage } from '../app/pages/home/home';
import { CreateProduct } from '../app/pages/create-product/create-product';
import { UpdateProduct } from '../app/pages/update-product/update-product';
import { NotFoundPage } from '../app/pages/not-found/not-found';

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'products', component: HomePage },
  { path: 'products/create', component: CreateProduct },
  { path: 'products/:idProduct/edit', component: UpdateProduct },
  { path: '**', component: NotFoundPage }
];
