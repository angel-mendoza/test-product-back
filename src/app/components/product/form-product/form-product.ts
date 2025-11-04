import { RouterLink } from '@angular/router';
import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
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
  providers: [DatePipe]
})
export class FormProduct implements OnInit, OnChanges {
  // Evento para emitir los datos del formulario al componente padre
  @Output() formSubmit = new EventEmitter<Product>();

  @Input() typeForm: 'create' | 'update' = 'create';
  @Input() productData: Product | null = null;
  @Input() loadingData: boolean = false;

  constructor(
    private productsService: ProductsService,
    private datePipe: DatePipe
  ) {}

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

  formProduct!: FormGroup;

  // Método optimizado para formatear fecha usando DatePipe
  private formatDateForInput(dateString: string): string {
    if (!dateString) return '';
    try {
      // Usar DatePipe para formatear a yyyy-MM-dd
      const formatted = this.datePipe.transform(dateString, 'yyyy-MM-dd');
      return formatted || '';
    } catch (error) {
      console.error('Error formateando fecha con DatePipe:', dateString, error);
      return '';
    }
  }

  ngOnInit() {
    this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    // Detectar cuando cambia productData
    if (changes['productData']) {
      // Si el formulario ya está inicializado, actualizar los valores
      if (this.formProduct) {
        this.updateFormWithProductData();
      }
      // Si no está inicializado y tenemos datos, inicializar
      else if (this.productData && !this.formProduct) {
        this.initializeForm();
      }
    }
  }

  private initializeForm() {
    // Inicializar el formulario
    this.createFormGroup();
    this.setupFormBehavior();
  }

  private createFormGroup() {
    this.formProduct = new FormGroup({
      id: new FormControl(
        this.productData ? this.productData.id : '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(10)],
        this.typeForm === 'create' ? [this.productIdAsyncValidator()] : []
      ),
      name: new FormControl(this.productData ? this.productData.name : '', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]),
      description: new FormControl(this.productData ? this.productData.description : '', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]),
      logo: new FormControl(this.productData ? this.productData.logo : '', [Validators.required]),
      date_release: new FormControl(this.productData ? this.formatDateForInput(this.productData.date_release) : '', [Validators.required, this.dateReleaseValidator()]),
      date_revision: new FormControl({ value: this.productData ? this.formatDateForInput(this.productData.date_revision) : '', disabled: true }, [Validators.required]),
    });
  }

  private setupFormBehavior() {
    // En modo edición, deshabilitar el campo ID
    if (this.typeForm === 'update') {
      this.formProduct.get('id')?.disable();
    }

    // Suscribirse a cambios en date_release
    this.formProduct.get('date_release')?.valueChanges.subscribe(releaseDate => {
      if (releaseDate) {
        const revisionDate = this.calculateRevisionDate(releaseDate);
        this.formProduct.get('date_revision')?.setValue(revisionDate);
      }
    });
  }

  private updateFormWithProductData() {
    if (!this.productData) return;
    // Actualizar valores del formulario
    this.formProduct.patchValue({
      id: this.productData.id,
      name: this.productData.name,
      description: this.productData.description,
      logo: this.productData.logo,
      date_release: this.formatDateForInput(this.productData.date_release)
    });

    // Para date_revision (que está deshabilitado), usar setValue directamente
    const formattedRevisionDate = this.formatDateForInput(this.productData.date_revision);
    this.formProduct.get('date_revision')?.setValue(formattedRevisionDate);

    // En modo edición, deshabilitar el campo ID
    if (this.typeForm === 'update') {
      this.formProduct.get('id')?.disable();
    }
  }

  private calculateRevisionDate(releaseDate: string): string {
    const [year, month, day] = releaseDate.split('-').map(Number);
    const date = new Date(year, month - 1, day);

    date.setFullYear(date.getFullYear() + 1);
    // Usar DatePipe para formatear la fecha de revisión
    return this.datePipe.transform(date, 'yyyy-MM-dd') || '';
  }

  onSubmit() {
    if (this.formProduct.valid) {
      // Emitir los datos del formulario al componente padre
      const formData: Product = {
        // Usar getRawValue() para obtener valores incluso de campos deshabilitados
        id: this.formProduct.getRawValue().id || '',
        name: this.formProduct.get('name')?.value || '',
        description: this.formProduct.get('description')?.value || '',
        logo: this.formProduct.get('logo')?.value || '',
        date_release: this.formProduct.get('date_release')?.value || '',
        date_revision: this.formProduct.getRawValue().date_revision || ''
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
    return this.datePipe.transform(today, 'yyyy-MM-dd') || '';
  }
}