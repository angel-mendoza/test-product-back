// Importaciones para testing de Angular
import { TestBed } from '@angular/core/testing';
// Nueva API moderna para Router testing (reemplaza RouterTestingModule deprecated)
import { provideRouter } from '@angular/router';
// El componente principal de la aplicación
import { App } from './app';

describe('App', () => {
  // beforeEach se ejecuta antes de cada prueba individual
  beforeEach(async () => {
    // Configuramos el módulo de testing
    await TestBed.configureTestingModule({
      // Importamos el componente App (componente standalone)
      imports: [App],
      providers: [
        // Proveemos Router con configuración vacía para manejar <router-outlet>
        provideRouter([])
      ]
    }).compileComponents();
  });

  // Test básico: verifica que la aplicación se puede crear
  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    // Verificamos que la instancia de la app existe
    expect(app).toBeTruthy();
  });

  // Test del template: verifica que renderiza el componente app-alert
  it('should render app-alert component', () => {
    const fixture = TestBed.createComponent(App);
    // Ejecutamos detección de cambios para renderizar el template
    fixture.detectChanges();
    // Obtenemos el elemento DOM compilado
    const compiled = fixture.nativeElement as HTMLElement;
    // Verificamos que existe el selector app-alert en el DOM
    expect(compiled.querySelector('app-alert')).toBeTruthy();
  });
});
