import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([])
      ]
    }).compileComponents();
  });

  // Test básico: verifica que la aplicación se puede crear
  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  // Test del template: verifica que renderiza el componente app-alert
  it('should render app-alert component', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    // Obtenemos el elemento DOM compilado
    const compiled = fixture.nativeElement as HTMLElement;
    // Verificamos que existe el selector app-alert en el DOM
    expect(compiled.querySelector('app-alert')).toBeTruthy();
  });
});
