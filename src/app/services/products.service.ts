import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProductResponse } from '../types/product.interface'
import { delay, switchMap } from 'rxjs/operators';
import { throwError, of } from 'rxjs';

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

  getAll(delayMs: number = 0, simulateError: boolean = false) {
    // Si se quiere simular error, retornar error después del delay
    if (simulateError) {
      return of(null).pipe(
        delay(delayMs),
        switchMap(() => throwError(() => new Error('Error simulado: No se pudieron cargar los productos')))
      );
    }

    // Funcionamiento normal con delay opcional
    return this.http.get<ProductResponse>(this.apiUrl).pipe(
      delay(delayMs)
    );
  }

}


