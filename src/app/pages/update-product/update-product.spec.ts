import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { UpdateProduct } from './update-product';

describe('UpdateProduct', () => {
  let component: UpdateProduct;
  let fixture: ComponentFixture<UpdateProduct>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateProduct],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateProduct);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
