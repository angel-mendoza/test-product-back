import { Component, OnInit } from '@angular/core';
// import { HttpClient } from '@angular/common/http';

// service
import { ProductsService } from '../../services/products.service'

// Interfaces
import { Product } from '../../types/product.interface';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomePage implements OnInit{
  isLoading = false;
  data: Product[] | null = null;
  error: string | null = null;

  constructor(private productsService: ProductsService) {}

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
        console.log('Data fetched successfully:', response);
      },
      error: (err) => {
        this.error = 'Failed to fetch data.';
        this.isLoading = false;
        console.error('Error fetching data:', err);
      },
    });
  }
}
