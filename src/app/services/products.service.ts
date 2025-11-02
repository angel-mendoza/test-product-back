import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProductResponse } from '../types/product.interface'

import { environment } from '../../environments/environment';

// Interfaces
@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private apiUrl = `${environment.apiUrl}/api/products`;

  constructor(
    private http: HttpClient
  ) { }

  getAll() {
    return this.http.get<ProductResponse>(this.apiUrl)
  }

}


