import { ProductsService } from './../../services/products.service';
import { Component } from '@angular/core';
import { FormProduct } from '../../components/product/form-product/form-product'
import { Product } from '../../types/product.interface'
import { ReactiveFormsModule } from '@angular/forms';
import { AlertService } from '../../components/ui/alert/alert';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-product',
  imports: [FormProduct, ReactiveFormsModule],
  templateUrl: './create-product.html',
  styleUrl: './create-product.css',
})
export class CreateProduct {
  constructor(
    private productsService: ProductsService,
    private alertService: AlertService,
    private router: Router
  ) {}

  onSubmit(formData: Product) {
    this.productsService.create(formData).subscribe({
      next: () => {
        // Mostrar alerta de éxito
        this.alertService.success(
          `El producto "${formData.name}" ha sido creado exitosamente.`,
          'Producto Creado'
        );
        this.router.navigate(['/products']);
      },
      error: (error) => {
        console.error('Error al crear producto:', error);

        // Mostrar alerta de error
        let errorMessage = 'No se pudo crear el producto. Intenta nuevamente.';

        // Personalizar mensaje según el tipo de error
        if (error.status === 409) {
          errorMessage = 'Ya existe un producto con este ID.';
        } else if (error.status === 400) {
          errorMessage = 'Los datos del producto no son válidos.';
        } else if (error.status === 0) {
          errorMessage = 'No se pudo conectar al servidor.';
        }
        this.alertService.error(errorMessage, 'Error al Crear Producto');
      }
    });
  }
}
