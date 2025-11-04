import { Component, OnInit } from '@angular/core';

// components
import {TableProduct} from '../..//components/product/table-product/table-product';

// service
import { ProductsService } from '../../services/products.service'
import { AlertService } from '../../components/ui/alert/alert';

// Interfaces
import { Product } from '../../types/product.interface';

@Component({
  selector: 'app-home',
  imports: [TableProduct],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomePage implements OnInit{
  isLoading = true;
  data: Product[] | null = null;
  error: string | null = null;

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
}
