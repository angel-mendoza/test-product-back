// Importaciones para testing de Angular
import { ComponentFixture, TestBed } from '@angular/core/testing';
// APIs modernas de Angular 18+ para HTTP testing
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
// API moderna para Router testing
import { provideRouter } from '@angular/router';
// Página principal/home que vamos a probar
import { HomePage } from './home';

describe('Home', () => {
  // Variables para el componente y su wrapper de testing
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  // Setup que se ejecuta antes de cada test individual
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Importamos el componente HomePage (standalone)
      imports: [HomePage],
      providers: [
        // HttpClient necesario para ProductsService (cargar productos)
        provideHttpClient(),
        // Testing utilities para interceptar llamadas HTTP
        provideHttpClientTesting(),
        // Router para manejar navegación en TableProduct (botones editar/eliminar)
        provideRouter([])
      ]
    })
    .compileComponents();

    // Creamos la instancia del componente
    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    // Ejecutamos ciclo de vida y renderizado (incluye TableProduct child)
    fixture.detectChanges();
  });

  // Test fundamental: verificar que el componente se crea sin errores
  it('should create', () => {
    // Valida que la instancia del componente existe
    expect(component).toBeTruthy();
  });
});
