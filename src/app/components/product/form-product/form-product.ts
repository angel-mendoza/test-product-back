import { RouterLink } from '@angular/router';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, FormGroup, Validators, AsyncValidatorFn, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ProductsService } from '../../../services/products.service';
import { Observable, of } from 'rxjs';
import { map, catchError, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Product } from '../../../types/product.interface';
@Component({
  selector: 'app-form-product',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './form-product.html',
  styleUrl: './form-product.css',
})
export class FormProduct implements OnInit {
  // Evento para emitir los datos del formulario al componente padre
  @Output() formSubmit = new EventEmitter<Product>();

  constructor(private productsService: ProductsService) {}

  // Validador personalizado para fecha de liberación (debe ser >= fecha actual)
  private dateReleaseValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // No validar si está vacío (Validators.required se encarga de eso)
      }

      const inputDate = new Date(control.value);
      const today = new Date();

      // Establecer la hora a 00:00:00 para comparar solo fechas
      today.setHours(0, 0, 0, 0);
      inputDate.setHours(0, 0, 0, 0);

      if (inputDate < today) {
        return {
          dateNotValid: {
            actualDate: today.toISOString().split('T')[0],
            inputDate: control.value
          }
        };
      }

      return null;
    };
  }

  // Validador asíncrono personalizado para verificar si el ID ya existe
  private productIdAsyncValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value || control.value.length < 3) {
        return of(null); // No validar si está vacío o muy corto
      }

      return of(control.value).pipe(
        debounceTime(500), // Esperar 500ms después de que el usuario deje de escribir
        distinctUntilChanged(), // Solo validar si el valor cambió
        switchMap(id => {
          return this.productsService.validateProductId(id).pipe(
            map(exists => {
              // Si exists es true, significa que el ID ya existe (error)
              const result = exists ? { productIdExists: { value: id } } : null;
              return result;
            }),
            catchError(error => {
              console.error('Error en validación:', error);
              return of(null);
            })
          );
        })
      );
    };
  }

  formProduct = new FormGroup({
    id: new FormControl('',
      [Validators.required, Validators.minLength(3), Validators.maxLength(10)],
      [this.productIdAsyncValidator()] // Validador asíncrono
    ),
    name: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]),
    description: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]),
    logo: new FormControl('', [Validators.required]),
    date_release: new FormControl('', [Validators.required, this.dateReleaseValidator()]),
    date_revision: new FormControl({ value: '', disabled: true }, [Validators.required]),
  });

  ngOnInit() {
    this.formProduct.get('date_release')?.valueChanges.subscribe(releaseDate => {
      if (releaseDate) {
        const revisionDate = this.calculateRevisionDate(releaseDate);
        this.formProduct.get('date_revision')?.setValue(revisionDate);
      }
    });
  }

  private calculateRevisionDate(releaseDate: string): string {
    const date = new Date(releaseDate);
    date.setFullYear(date.getFullYear() + 1);
    return date.toISOString().split('T')[0];
  }

  onSubmit() {
    if (this.formProduct.valid) {
      // Emitir los datos del formulario al componente padre
      const formData: Product = {
        id: this.formProduct.get('id')?.value || '',
        name: this.formProduct.get('name')?.value || '',
        description: this.formProduct.get('description')?.value || '',
        logo: this.formProduct.get('logo')?.value || '',
        date_release: this.formProduct.get('date_release')?.value || '',
        date_revision: this.formProduct.get('date_revision')?.value || ''
      };
      this.formSubmit.emit(formData);
    } else {
      this.markFormGroupTouched();
    }
  }

  onReset() {
    this.formProduct.reset();
  }

  private markFormGroupTouched() {
    Object.keys(this.formProduct.controls).forEach(key => {
      const control = this.formProduct.get(key);
      control?.markAsTouched();
    });
  }

  // Método para obtener la fecha mínima permitida (fecha actual)
  get minDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }
}