// Importaciones para testing de Angular
import { ComponentFixture, TestBed } from '@angular/core/testing';
// Componente de página 404/Not Found
import { NotFoundPage } from './not-found';

describe('NotFound', () => {
  // Variables para el componente y su testing wrapper
  let component: NotFoundPage;
  let fixture: ComponentFixture<NotFoundPage>;

  // Setup antes de cada test individual
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Componente standalone que no requiere dependencias especiales
      imports: [NotFoundPage]
    })
    .compileComponents();

    // Crear instancia del componente para testing
    fixture = TestBed.createComponent(NotFoundPage);
    component = fixture.componentInstance;
    // Ejecutar ciclo de detección de cambios (renderizar)
    fixture.detectChanges();
  });

  // Test básico: verifica que el componente se crea sin problemas
  it('should create', () => {
    // Confirma que la instancia del componente existe
    expect(component).toBeTruthy();
  });
});
