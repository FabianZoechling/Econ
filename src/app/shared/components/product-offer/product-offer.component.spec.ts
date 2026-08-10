import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ProductOfferComponent } from './product-offer.component';
import { Product } from '../../models/product';

describe('ProductOfferComponent', () => {
  let component: ProductOfferComponent;
  let fixture: ComponentFixture<ProductOfferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductOfferComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductOfferComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    const product: Product = {
      id: '1',
      name: 'Test Product',
      description: 'desc',
      urlImg: 'img.png',
      reviews: 5,
      price: 50,
      previousPrice: 100,
    };
    fixture.componentRef.setInput('product', product);

    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should compute the discount ratio when a previous price exists', () => {
    const product: Product = {
      id: '1',
      name: 'Test Product',
      description: 'desc',
      urlImg: 'img.png',
      reviews: 5,
      price: 75,
      previousPrice: 100,
    };
    fixture.componentRef.setInput('product', product);

    fixture.detectChanges();

    expect(component.discount).toBe((100 - 75) / 100);
  });

  it('should leave the discount at 0 when there is no previous price', () => {
    const product: Product = {
      id: '1',
      name: 'Test Product',
      description: 'desc',
      urlImg: 'img.png',
      reviews: 5,
      price: 75,
      previousPrice: null,
    };
    fixture.componentRef.setInput('product', product);

    fixture.detectChanges();

    expect(component.discount).toBe(0);
  });

  it('should leave the discount at 0 when the previous price is 0', () => {
    const product: Product = {
      id: '1',
      name: 'Test Product',
      description: 'desc',
      urlImg: 'img.png',
      reviews: 5,
      price: 0,
      previousPrice: 0,
    };
    fixture.componentRef.setInput('product', product);

    fixture.detectChanges();

    expect(component.discount).toBe(0);
  });

  it('should compute a full 100% discount when the current price is 0', () => {
    const product: Product = {
      id: '1',
      name: 'Test Product',
      description: 'desc',
      urlImg: 'img.png',
      reviews: 5,
      price: 0,
      previousPrice: 100,
    };
    fixture.componentRef.setInput('product', product);

    fixture.detectChanges();

    expect(component.discount).toBe(1);
  });
});
