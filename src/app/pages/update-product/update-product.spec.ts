// Importaciones para testing de Angular
import { ComponentFixture, TestBed } from '@angular/core/testing';
// APIs modernas de Angular 18+ para HTTP testing
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
// API moderna para Router testing
import { provideRouter } from '@angular/router';
// ActivatedRoute para simular parámetros de ruta
import { ActivatedRoute } from '@angular/router';
// Observable para crear mocks reactivos
import { of } from 'rxjs';
// Página de actualización de productos
import { UpdateProduct } from './update-product';

describe('UpdateProduct', () => {
  // Variables para el componente y su testing fixture
  let component: UpdateProduct;
  let fixture: ComponentFixture<UpdateProduct>;

  // Configuración previa a cada test
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Componente standalone a probar
      imports: [UpdateProduct],
      providers: [
        // HttpClient para ProductsService (obtener/actualizar producto)
        provideHttpClient(),
        // Testing utilities para HTTP requests
        provideHttpClientTesting(),
        // Router para navegación
        provideRouter([]),
        {
          // Mock de ActivatedRoute - simula parámetros de la URL
          provide: ActivatedRoute,
          useValue: {
            // Observable que simula params de la ruta (para subscription)
            params: of({ id: 'test-id' }),
            // Snapshot que simula estado actual de la ruta (para acceso directo)
            snapshot: {
              paramMap: {
                // Mock del método get() para obtener parámetros por nombre
                get: (key: string) => key === 'idProduct' ? 'test-id' : null
              }
            }
          }
        }
      ]
    })
    .compileComponents();

    // Crear instancia del componente
    fixture = TestBed.createComponent(UpdateProduct);
    component = fixture.componentInstance;
    // Ejecutar ngOnInit y detectar cambios (carga el producto con ID mock)
    fixture.detectChanges();
  });

  // Test básico: verifica que el componente se instancia correctamente
  it('should create', () => {
    // Confirma que el componente existe y se inicializó sin errores
    expect(component).toBeTruthy();
  });
});
