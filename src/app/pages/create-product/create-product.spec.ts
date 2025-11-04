// Importaciones para testing de Angular
import { ComponentFixture, TestBed } from '@angular/core/testing';
// Nuevas APIs modernas de Angular 18+ para HTTP testing
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
// Nueva API moderna para Router testing
import { provideRouter } from '@angular/router';
// Página de creación de productos que vamos a probar
import { CreateProduct } from './create-product';

describe('CreateProduct', () => {
  // Variables para manejar el componente y su fixture
  let component: CreateProduct;
  let fixture: ComponentFixture<CreateProduct>;

  // Configuración que se ejecuta antes de cada test
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Importamos el componente de página standalone
      imports: [CreateProduct],
      providers: [
        // HttpClient para que ProductsService funcione (usado en FormProduct child component)
        provideHttpClient(),
        // Utilidades de testing para HTTP (mockea las peticiones)
        provideHttpClientTesting(),
        // Router para manejar navegación en botones y formularios
        provideRouter([])
      ]
    })
    .compileComponents();

    // Creamos instancia del componente para testing
    fixture = TestBed.createComponent(CreateProduct);
    component = fixture.componentInstance;
    // Renderizamos el componente y sus hijos (FormProduct)
    fixture.detectChanges();
  });

  // Test de smoke: verifica creación básica sin errores
  it('should create', () => {
    // Confirma que el componente se instancia correctamente
    expect(component).toBeTruthy();
  });
});
