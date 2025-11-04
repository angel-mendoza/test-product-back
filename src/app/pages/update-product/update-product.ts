import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormProduct } from '../../components/product/form-product/form-product'
import { Product } from '../../types/product.interface'
import { ProductsService } from '../../services/products.service';
import { AlertService } from '../../components/ui/alert/alert';
@Component({
  selector: 'app-update-product',
  imports: [CommonModule, FormProduct],
  templateUrl: './update-product.html',
  styleUrl: './update-product.css',
})
export class UpdateProduct implements OnInit {
  productData: Product | null = null;
  isLoading = true;
  error: string | null = null;
  productId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productsService: ProductsService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    // Extraer el ID del producto de la URL
    this.productId = this.route.snapshot.paramMap.get('idProduct') || '';
    if (this.productId) {
      this.loadProduct();
    } else {
      this.error = 'ID de producto no válido';
      this.isLoading = false;
    }
  }

  loadProduct() {
    this.isLoading = true;
    this.error = null;

    // Cargar el producto específico por ID
    this.productsService.getOne(this.productId).subscribe({
      next: (response) => {
        this.productData = response;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando producto:', err);
        this.error = 'Error al cargar el producto';
        this.router.navigate(['/products']);
        this.alertService.error('No se pudo cargar el producto solicitado.', 'Error');
        this.isLoading = false;
      }
    });
  }


  onSubmit(formData: Product) {
    if (!this.productId) {
      this.alertService.error('ID de producto no válido', 'Error');
      return;
    }

    this.productsService.update(this.productId, formData).subscribe({
      next: () => {
        this.alertService.success(
          `El producto "${formData.name}" ha sido actualizado exitosamente.`,
          'Producto Actualizado'
        );
        this.router.navigate(['/products']);
      },
      error: (error) => {
        console.error('Error al actualizar producto:', error);
        let errorMessage = 'No se pudo actualizar el producto. Intenta nuevamente.';
        if (error.status === 404) {
          errorMessage = 'El producto no existe o ya fue eliminado.';
        } else if (error.status === 400) {
          errorMessage = 'Los datos del producto no son válidos.';
        } else if (error.status === 0) {
          errorMessage = 'No se pudo conectar al servidor.';
        }
        this.alertService.error(errorMessage, 'Error al Actualizar Producto');
      }
    });
  }
}
