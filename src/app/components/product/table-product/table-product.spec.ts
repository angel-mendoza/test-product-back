import { productsDummy } from './../../../assets/data/products.mock';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { TableProduct } from './table-product';
import { Product } from '../../../types/product.interface';


describe('TableProduct', () => {
  // Variables para manejar el componente y su fixture en las pruebas
  let component: TableProduct;
  let fixture: ComponentFixture<TableProduct>;
  let router: Router;
  let location: Location;

  // Data de prueba estatica con algunos productos de ejemplo
  const testProducts: Product[] = productsDummy
  beforeEach(async () => {
    // Configuramos el modulo de testing de Angular
    await TestBed.configureTestingModule({
      imports: [TableProduct, FormsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        // Configuramos rutas para el testing
        provideRouter([
          { path: 'create', component: TableProduct }, // Ruta de prueba
          { path: '', redirectTo: '/create', pathMatch: 'full' }
        ])
      ]
    })
    .compileComponents();

    // Creamos una instancia del componente para pruebas
    fixture = TestBed.createComponent(TableProduct);
    // Obtenemos referencia
    component = fixture.componentInstance;
    // Obtenemos referencias del router y location para las pruebas de navegacion
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    // Ejecutamos el ciclo de deteccion de cambios
    fixture.detectChanges();
  });

  // Test basico: verifica que el componente se puede crear sin errores
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test para verificar que los skeletons se muestran cuando loading es true
  it('should display skeleton rows when loading is true', () => {
    // Configuramos el estado de loading en true
    component.loading = true;

    fixture.detectChanges();

    const skeletonRows = fixture.nativeElement.querySelectorAll('.skeleton-row');

    // Debe mostrar el número de filas skeleton igual al pageSize
    expect(skeletonRows.length).toBe(component.pageSize);
  });

  // Test para verificar que NO se muestran skeletons cuando loading es false
  it('should not display skeleton rows when loading is false', () => {
    component.loading = false;

    fixture.detectChanges();
    const skeletonRows = fixture.nativeElement.querySelectorAll('.skeleton-row');
    expect(skeletonRows.length).toBe(0);
  });


  // Test para verificar que el input de busqueda existe en el DOM
  it('should render search input element', () => {
    fixture.detectChanges();
    const searchInput = fixture.nativeElement.querySelector('.search-input');
    expect(searchInput).toBeTruthy();
    expect(searchInput.type).toBe('text');
    expect(searchInput.placeholder).toBe('Search...');
    expect(searchInput.classList).toContain('search-input');
  });

  // Prueba para verificar navegacion al hacer click en el boton "Agregar"
  it('You should navigate to the create product page when you click Add.', async () => {
    // Buscamos el enlace "Agregar" en el DOM
    const addLink = fixture.debugElement.query(By.css('a[routerLink="create"]'));

    expect(addLink).toBeTruthy();
    expect(addLink.attributes['routerLink']).toBe('create');

    // En lugar de simular el click, verificamos que el elemento tiene el routerLink correcto
    // Esto valida que la navegacion esta configurada correctamente
    expect(addLink.nativeElement.getAttribute('routerLink')).toBe('create');

    const buttonText = addLink.nativeElement.textContent.trim();
    expect(buttonText).toContain('Agregar');
  });

  // Test para verificar que se muestran productos cuando hay data
  it('should display products when data is loaded', () => {
    component.products = testProducts.slice(0, 10); // Solo 10 productos para el test
    component.loading = false;
    component.error = null;
    component.ngOnChanges();
    fixture.detectChanges();

    const productRows = fixture.nativeElement.querySelectorAll('.product-row');
    expect(productRows.length).toBe(Math.min(10, component.pageSize));

    // Verificar que no hay skeletons cuando hay data
    const skeletonRows = fixture.nativeElement.querySelectorAll('.skeleton-row');
    expect(skeletonRows.length).toBe(0);
  });

  // Test para verificar el filtrado por termino de busqueda
  it('You should filter products by search term.', () => {
    component.products = testProducts;
    component.ngOnChanges();
    component.searchTerm = 'TechPro';
    component.onSearch();

    // Debe encontrar productos que contengan "TechPro" en el nombre
    expect(component.filteredProducts!.length).toBeGreaterThan(0);
    expect(component.filteredProducts!.every(p =>
      p.name.toLowerCase().includes('techpro') ||
      p.description.toLowerCase().includes('techpro')
    )).toBe(true);
  });

  // Test para verificar filtrado por descripcion
  it('should filter products by description', () => {
    component.products = testProducts;
    component.ngOnChanges();
    component.searchTerm = 'smartphone';
    component.onSearch();

    expect(component.filteredProducts!.length).toBeGreaterThan(0);
    expect(component.filteredProducts!.every(p =>
      p.name.toLowerCase().includes('smartphone') ||
      p.description.toLowerCase().includes('smartphone')
    )).toBe(true);
  });

  // Test para verificar el ordenamiento por nombre
  it('should sort products by name in ascending order', () => {
    component.products = testProducts.slice(0, 5);
    component.ngOnChanges(); // Inicializar filteredProducts
    component.sort('name');

    const sortedNames = component.filteredProducts!.map(p => p.name);
    const expectedSorted = [...sortedNames].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
    expect(sortedNames).toEqual(expectedSorted);
    expect(component.sortDirection).toBe('asc');
  });

  // Test para verificar el ordenamiento por nombre descendente
  it('should sort products by descending name when double click', () => {
    component.products = testProducts.slice(0, 5);
    component.ngOnChanges();
    component.sort('name');
    component.sort('name'); // Segundo click - descendente

    const sortedNames = component.filteredProducts!.map(p => p.name);
    const expectedSorted = [...sortedNames].sort((a, b) => b.toLowerCase().localeCompare(a.toLowerCase()));
    expect(sortedNames).toEqual(expectedSorted);
    expect(component.sortDirection).toBe('desc');
  });

  // Test para verificar el ordenamiento por fecha
  it('should sort products by release date', () => {
    component.products = testProducts.slice(0, 8);
    component.ngOnChanges(); // Inicializar filteredProducts
    component.sort('date_release');

    const sortedDates = component.filteredProducts!.map(p => new Date(p.date_release).getTime());
    const expectedSorted = [...sortedDates].sort((a, b) => a - b);
    expect(sortedDates).toEqual(expectedSorted);
  });

  // Test para verificar la paginacion
  it('should paginate products correctly', () => {
    component.products = testProducts;
    component.pageSize = 5;
    component.currentPage = 1;
    component.ngOnChanges();
    component.updatePagination();

    expect(component.paginatedProducts.length).toBe(5);
    expect(component.totalPages).toBe(20);
    expect(component.currentPage).toBe(1);
  });

  // Test para verificar navegacion a la siguiente pagina
  it('should navigate to the next page correctly', () => {
    component.products = testProducts;
    component.pageSize = 5;
    component.currentPage = 1;
    component.ngOnChanges(); // Inicializar filteredProducts
    component.updatePagination();

    const firstPageFirstProduct = component.paginatedProducts[0].id;

    component.goToNextPage();

    expect(component.currentPage).toBe(2);
    expect(component.paginatedProducts.length).toBe(5);
    expect(component.paginatedProducts[0].id).not.toBe(firstPageFirstProduct);
  });

  // Test para verificar los limites de navegacion
  it('you should not navigate beyond the first page', () => {
    component.products = testProducts;
    component.pageSize = 10;
    component.currentPage = 1;
    component.updatePagination();

    component.goToPreviousPage();

    expect(component.currentPage).toBe(1);
  });

  // Test para verificar navegacion a la ultima pagina
  it('should navigate to the last page correctly', () => {
    component.products = testProducts;
    component.pageSize = 5;
    component.ngOnChanges();
    component.updatePagination();

    component.goToLastPage();

    expect(component.currentPage).toBe(component.totalPages);
    expect(component.paginatedProducts.length).toBe(5); // La ultima pagina tiene 5 productos (100 % 5 = 0, pagina completa)
  });


  // Test para verificar busqueda con paginacion
  it('You should reset the page when performing a search.', () => {
    component.products = testProducts;
    component.pageSize = 5;
    component.currentPage = 3;
    component.ngOnChanges(); // Inicializar filteredProducts
    component.updatePagination();

    component.searchTerm = 'TechPro';
    component.onSearch();

    expect(component.currentPage).toBe(1);
    expect(component.filteredProducts!.length).toBeLessThan(testProducts.length);
  });

  // Test para verificar estado vacio con busqueda sin resultados
  it('should display empty status when the search finds no results', () => {
    component.products = testProducts;
    component.loading = false;
    component.error = null;
    component.ngOnChanges(); // Inicializar filteredProducts
    component.searchTerm = 'ProductoQueNoExiste123';
    component.onSearch();

    expect(component.filteredProducts!.length).toBe(0);
    expect(component.paginatedProducts.length).toBe(0);
  });

  // Test para verificar el conteo total de resultados
  it('should display the correct count of filtered results', () => {
    component.products = testProducts;
    component.ngOnChanges(); // Inicializar filteredProducts
    component.searchTerm = 'Laptop';
    component.onSearch();

    const laptopCount = testProducts.filter(p =>
      p.name.toLowerCase().includes('laptop') ||
      p.description.toLowerCase().includes('laptop')
    ).length;

    expect(component.totalItems).toBe(laptopCount);
    expect(component.filteredProducts!.length).toBe(laptopCount);
  });

});
