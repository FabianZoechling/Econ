import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { HomeProductComponent } from './home-product.component';
import { Product } from '../../../shared/models/product';

describe('HomeProductComponent', () => {
  let component: HomeProductComponent;
  let fixture: ComponentFixture<HomeProductComponent>;

  const product: Product = {
    id: '1',
    name: 'Test Product',
    description: 'desc',
    urlImg: 'img.png',
    reviews: 5,
    price: 50,
    previousPrice: null,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeProductComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeProductComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('product', product);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should expose the product provided via the input', () => {
    fixture.detectChanges();
    expect(component.product()).toEqual(product);
  });

  it('should render the product name in the template', () => {
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain(product.name);
  });
});
