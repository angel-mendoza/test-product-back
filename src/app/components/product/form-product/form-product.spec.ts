
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { FormProduct } from './form-product';

describe('FormProduct', () => {
  // Variables para manejar el componente y su fixture en las pruebas
  let component: FormProduct;
  let fixture: ComponentFixture<FormProduct>;

  beforeEach(async () => {
    // Configuramos el modulo de testing de Angular
    await TestBed.configureTestingModule({
      imports: [FormProduct],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    })
    .compileComponents();

    // Creamos una instancia del componente para pruebas
    fixture = TestBed.createComponent(FormProduct);
    // Obtenemos referencia
    component = fixture.componentInstance;
    // Ejecutamos el ciclo de deteccion de cambios
    fixture.detectChanges();
  });

  // Test basico: verifica que el componente se puede crear sin errores
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Grupo de pruebas para el renderizado del titulo según typeForm
  describe('Title rendering based on typeForm', () => {
    it('should display "Formulario de Registro" when typeForm is "create"', () => {
      component.typeForm = 'create';
      // Act: Ejecutar deteccion de cambios para actualizar el DOM
      fixture.detectChanges();

      // Assert: Verificar que el titulo correcto se muestra en el DOM
      const titleElement = fixture.nativeElement.querySelector('.form-title');
      expect(titleElement).toBeTruthy(); // Verificar que existe el elemento
      expect(titleElement.textContent.trim()).toBe('Formulario de Registro');
    });

    it('should display "Formulario de Actualización" when typeForm is "update"', () => {
      component.typeForm = 'update';
      // Act: Ejecutar deteccion de cambios para actualizar el DOM
      fixture.detectChanges();

      const titleElement = fixture.nativeElement.querySelector('.form-title');
      expect(titleElement).toBeTruthy(); // Verificar que existe el elemento
      expect(titleElement.textContent.trim()).toBe('Formulario de Actualización');
    });

    it('should update title dynamically when typeForm changes', () => {
      // Test inicial: modo create
      component.typeForm = 'create';
      fixture.detectChanges();

      let titleElement = fixture.nativeElement.querySelector('.form-title');
      expect(titleElement.textContent.trim()).toBe('Formulario de Registro');
      // Cambiar a modo update
      component.typeForm = 'update';
      fixture.detectChanges();

      titleElement = fixture.nativeElement.querySelector('.form-title');
      expect(titleElement.textContent.trim()).toBe('Formulario de Actualización');
    });
  });

  // validamos di el campo ID esta habilitado o deshabilitado segun typeForm
  describe('Form behavior based on typeForm', () => {
    it('should have enabled ID field when typeForm is "create"', () => {
      component.typeForm = 'create';
      component.ngOnInit(); // Re-inicializar el formulario con el nuevo tipo
      fixture.detectChanges();

      // Assert: El campo ID debe estar habilitado en modo create
      const idInput = fixture.nativeElement.querySelector('#id');
      expect(idInput.disabled).toBeFalsy();
    });

    it('should have disabled ID field when typeForm is "update"', () => {
      component.typeForm = 'update';
      component.ngOnInit();
      fixture.detectChanges();

      // Assert: El campo ID debe estar deshabilitado en modo update
      const idInput = fixture.nativeElement.querySelector('#id');
      expect(idInput.disabled).toBeTruthy();
    });
  });

  // Pruebas para validar el comportamiento de las fechas de liberacion y revision
  describe('Date fields behavior', () => {
    it('should automatically set date_revision to exactly one year after date_release and disable the revision input', () => {
      // Arrange: Configurar el componente en modo create
      component.typeForm = 'create';
      component.ngOnInit();
      fixture.detectChanges();

      // Act: Establecer una fecha de liberacion especifica usando el control del formulario
      const releaseDate = '2024-01-15';
      component.formProduct.get('date_release')?.setValue(releaseDate);

      fixture.detectChanges();

      const revisionDateValue = component.formProduct.get('date_revision')?.value;

      // Verificar que se establecio la fecha de revision exacta (misma fecha, un año después)
      expect(revisionDateValue).toBeTruthy();
      expect(revisionDateValue).toBe('2025-01-15'); // Exactamente un año después

      // Verificar que el campo de fecha de revision esta disabled
      const revisionDateInput = fixture.nativeElement.querySelector('#date_revision');
      expect(revisionDateInput.disabled).toBeTruthy();

      // Verificar que el control del formulario este deshabilitado
      expect(component.formProduct.get('date_revision')?.disabled).toBeTruthy();
    });

    it('should update date_revision when date_release changes', () => {
      // Arrange: Configurar el componente
      component.typeForm = 'create';
      component.ngOnInit();
      fixture.detectChanges();

      const firstReleaseDate = '2024-06-15';
      component.formProduct.get('date_release')?.setValue(firstReleaseDate);
      fixture.detectChanges();

      let revisionDateValue = component.formProduct.get('date_revision')?.value;
      expect(revisionDateValue).toBeTruthy();
      expect(revisionDateValue).toBe('2025-06-15');


      const secondReleaseDate = '2024-12-25';
      component.formProduct.get('date_release')?.setValue(secondReleaseDate);
      fixture.detectChanges();

      // Assert: Verificar que la fecha de revision se actualizo correctamente
      revisionDateValue = component.formProduct.get('date_revision')?.value;
      expect(revisionDateValue).toBeTruthy();
      expect(revisionDateValue).toBe('2025-12-25');

      // Verificar que el campo sigue deshabilitado
      const revisionDateInput = fixture.nativeElement.querySelector('#date_revision');
      expect(revisionDateInput.disabled).toBeTruthy();
    });

    it('should keep date_revision disabled at all times', () => {
      component.typeForm = 'create';
      component.ngOnInit();
      fixture.detectChanges();

      const revisionDateInput = fixture.nativeElement.querySelector('#date_revision');
      expect(revisionDateInput.disabled).toBeTruthy();
      expect(component.formProduct.get('date_revision')?.disabled).toBeTruthy();

      component.formProduct.get('date_release')?.setValue('2024-03-10');
      fixture.detectChanges();

      expect(revisionDateInput.disabled).toBeTruthy();
      expect(component.formProduct.get('date_revision')?.disabled).toBeTruthy();
    });

    it('should calculate revision date exactly one year after release date', () => {
      component.typeForm = 'create';
      component.ngOnInit();
      fixture.detectChanges();

      // Test con diferentes fechas para asegurar el calculo correcto - misma fecha pero un año después
      const testCases = [
        { release: '2024-01-15', expectedRevision: '2025-01-15' },
        { release: '2024-06-30', expectedRevision: '2025-06-30' },
        { release: '2024-12-31', expectedRevision: '2025-12-31' }
      ];

      testCases.forEach(testCase => {

        component.formProduct.get('date_release')?.setValue(testCase.release);
        fixture.detectChanges();

        const revisionDateValue = component.formProduct.get('date_revision')?.value;
        expect(revisionDateValue).toBeTruthy();
        expect(revisionDateValue).toBe(testCase.expectedRevision);

        const releaseDate = new Date(testCase.release);
        const revisionDate = new Date(revisionDateValue);
        expect(revisionDate.getFullYear()).toBe(releaseDate.getFullYear() + 1);
      });
    });
  });
});
