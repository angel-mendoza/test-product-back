import { Component, OnInit } from '@angular/core';

// components
import {TableProduct} from '../..//components/product/table-product/table-product';
import { Modal } from '../../components/ui/modal/modal';

// service
import { ProductsService } from '../../services/products.service'
import { AlertService } from '../../components/ui/alert/alert';

// Interfaces
import { Product } from '../../types/product.interface';

@Component({
  selector: 'app-home',
  imports: [TableProduct, Modal],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomePage implements OnInit{
  isLoading = true;
  data: Product[] | null = null;
  error: string | null = null;

  // Modal state
  isDeleteModalOpen = false;
  productToDelete: Product | null = null;

  // Modal de ejemplo para demostrar versatilidad
  isExampleModalOpen = false;

  constructor(
    private productsService: ProductsService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.isLoading = true;
    this.error = null
    this.productsService.getAll().subscribe({
      next: (response) => {
        this.data = response.data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to fetch data.';
        this.isLoading = false;
        console.error('Error fetching data:', err);
      },
    });
  }

  // Método que recibe el ID del producto a eliminar desde la tabla
  onDeleteProduct(id: string): void {
    // Buscar el producto completo por ID
    const product = this.data?.find(p => p.id === id);
    if (product) {
      this.productToDelete = product;
      this.isDeleteModalOpen = true;
    }
  }

  // Confirmar eliminación desde el modal
  confirmDelete(): void {
    if (this.productToDelete) {
      this.productsService.delete(this.productToDelete.id).subscribe({
        next: () => {
          this.alertService.success(
            `El producto "${this.productToDelete?.name}" ha sido eliminado exitosamente.`,
            'Producto Eliminado'
          );
          this.closeDeleteModal();
          this.fetchData(); // Recargar la lista
        },
        error: (err) => {
          console.error('Error al eliminar el producto:', err);
          let errorMessage = 'No se pudo eliminar el producto. Intenta nuevamente.';
          // Personalizar mensaje según el error
          if (err.status === 404) {
            errorMessage = 'El producto no existe o ya fue eliminado.';
          } else if (err.status === 403) {
            errorMessage = 'No tienes permisos para eliminar este producto.';
          }
          this.alertService.error(errorMessage, 'Error al Eliminar');
          this.closeDeleteModal();
        }
      });
    }
  }

  // Cancelar eliminación
  cancelDelete(): void {
    this.closeDeleteModal();
  }

  // Cerrar modal
  closeDeleteModal(): void {
    this.isDeleteModalOpen = false;
    this.productToDelete = null;
  }

  // Getter para el mensaje del modal
  get deleteModalMessage(): string {
    if (!this.productToDelete) return '';
    return `¿Estás seguro que deseas eliminar el producto "${this.productToDelete.name}"? Esta acción no se puede deshacer.`;
  }

}
