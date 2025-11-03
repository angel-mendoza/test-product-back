import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { Product } from '../../../types/product.interface'
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-table-product',
  imports: [CommonModule, FormsModule, MatIcon, RouterLink],
  templateUrl: './table-product.html',
  styleUrl: './table-product.css',
})
export class TableProduct implements OnInit {
  @Input() products: Product[] = [];
  @Input() loading: boolean = false;
  @Input() error: string | null = null;
  @Output() reload = new EventEmitter<void>();

  // Propiedades para búsqueda y filtrado
  searchTerm: string = '';
  filteredProducts: Product[] | null = [];
  paginatedProducts: Product[] = [];

  // Propiedades para ordenamiento
  sortField: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  // Propiedades para dropdown
  openDropdownId: string | null = null;

  // Propiedades para paginación
  pageSize: number = 5;
  currentPage: number = 1;
  totalPages: number = 1;

  get totalItems(): number {
    return this.filteredProducts?.length || 0;
  }

  get hasData(): boolean {
    return !this.loading && !this.error && this.products.length > 0;
  }

  get isEmpty(): boolean {
    return !this.loading && !this.error && this.products.length === 0;
  }

  get skeletonRows(): number[] {
    return Array(this.pageSize).fill(0).map((_, i) => i);
  }

  ngOnInit() {
    this.filteredProducts = [...this.products];
    this.updatePagination();
  }

  ngOnChanges() {
    this.filteredProducts = [...this.products];
    this.onSearch();
  }

  onSearch() {
    if (!this.searchTerm.trim()) {
      this.filteredProducts = [...this.products];
    } else {
      this.filteredProducts = this.products.filter(product =>
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    this.currentPage = 1;
    this.updatePagination();
  }

  sort(field: string) {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }

    this.filteredProducts?.sort((a, b) => {
      let valueA = (a as any)[field];
      let valueB = (b as any)[field];

      // Manejo especial para fechas
      if (field.includes('date')) {
        valueA = new Date(valueA);
        valueB = new Date(valueB);
      } else if (typeof valueA === 'string') {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }

      if (valueA < valueB) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
    
    this.updatePagination();
  }

  updatePagination() {
    if (!this.filteredProducts) return;
    
    // Calcular el número total de páginas
    this.totalPages = Math.ceil(this.filteredProducts.length / this.pageSize);
    
    // Asegurar que currentPage esté dentro del rango válido
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
    if (this.currentPage < 1) {
      this.currentPage = 1;
    }
    
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);
  }

  toggleDropdown(productId: string) {
    this.openDropdownId = this.openDropdownId === productId ? null : productId;
  }

  editProduct(product: any) {
    console.log('Editar producto:', product);
    this.closeDropdown();
    // Aquí implementarías la lógica para editar
  }

  deleteProduct(product: any) {
    console.log('Eliminar producto:', product);
    this.closeDropdown();
    // Aquí implementarías la lógica para eliminar
  }

  closeDropdown() {
    this.openDropdownId = null;
  }

  onImageError(event: any) {
    // Imagen placeholder cuando falla la carga
    event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iI0Y1RjVGNSIvPgo8cGF0aCBkPSJNMjAgMTJDMTYuNjg2MyAxMiAxNCAxNC42ODYzIDE0IDE4QzE0IDIxLjMxMzcgMTYuNjg2MyAyNCAyMCAyNEMyMy4zMTM3IDI0IDI2IDIxLjMxMzcgMjYgMThDMjYgMTQuNjg2MyAyMy4zMTM3IDEyIDIwIDEyWiIgZmlsbD0iI0NDQ0NDQyIvPgo8L3N2Zz4K';
  }

  // Métodos de navegación de páginas
  goToFirstPage() {
    this.currentPage = 1;
    this.updatePagination();
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  goToLastPage() {
    this.currentPage = this.totalPages;
    this.updatePagination();
  }

  onPageSizeChange() {
    this.currentPage = 1;
    this.updatePagination();
  }

  retryLoad() {
    this.reload.emit();
  }

  // Debug helper - puedes llamarlo desde el template para verificar
  debugState() {
    console.log('Loading:', this.loading);
    console.log('Error:', this.error);
    console.log('Products:', this.products);
    console.log('HasData:', this.hasData);
    console.log('IsEmpty:', this.isEmpty);
  }
}
