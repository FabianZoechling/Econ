import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

import { PaymentSuccessComponent } from './payment-success.component';
import { PurchaseService } from '../../core/services/purchase.service';
import { CartProduct } from '../../shared/models/cart-product';
import { Product } from '../../shared/models/product';

describe('PaymentSuccessComponent', () => {
  let component: PaymentSuccessComponent;
  let fixture: ComponentFixture<PaymentSuccessComponent>;
  let purchaseServiceSpy: jasmine.SpyObj<PurchaseService>;

  const product1: Product = {
    id: '1',
    name: 'Product 1',
    description: 'desc',
    urlImg: 'img.png',
    reviews: 5,
    price: 50,
    previousPrice: null,
  };

  const product2: Product = {
    id: '2',
    name: 'Product 2',
    description: 'desc 2',
    urlImg: 'img2.png',
    reviews: 3,
    price: 20,
    previousPrice: null,
  };

  const cartProducts: CartProduct[] = [
    { product: product1, quantity: 2 },
    { product: product2, quantity: 3 },
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('PurchaseService', ['save']);

    await TestBed.configureTestingModule({
      imports: [PaymentSuccessComponent],
      providers: [
        provideRouter([]),
        { provide: PurchaseService, useValue: spy },
      ],
    }).compileComponents();

    purchaseServiceSpy = TestBed.inject(
      PurchaseService
    ) as jasmine.SpyObj<PurchaseService>;
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create', () => {
    localStorage.setItem('cart-products', JSON.stringify(cartProducts));
    purchaseServiceSpy.save.and.returnValue(of({ message: 'ok' }));

    fixture = TestBed.createComponent(PaymentSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should map cart products to {id, quantity} and compute the total, then call PurchaseService.save', () => {
    localStorage.setItem('cart-products', JSON.stringify(cartProducts));
    purchaseServiceSpy.save.and.returnValue(of({ message: 'ok' }));

    fixture = TestBed.createComponent(PaymentSuccessComponent);
    fixture.detectChanges();

    expect(purchaseServiceSpy.save).toHaveBeenCalledWith({
      total: 2 * 50 + 3 * 20,
      products: [
        { id: '1', quantity: 2 },
        { id: '2', quantity: 3 },
      ],
    });
  });

  it('should clear the cart from localStorage on init', () => {
    localStorage.setItem('cart-products', JSON.stringify(cartProducts));
    purchaseServiceSpy.save.and.returnValue(of({ message: 'ok' }));

    fixture = TestBed.createComponent(PaymentSuccessComponent);
    fixture.detectChanges();

    expect(localStorage.getItem('cart-products')).toBeNull();
  });

  it('should not throw when PurchaseService.save errors out', () => {
    localStorage.setItem('cart-products', JSON.stringify(cartProducts));
    purchaseServiceSpy.save.and.returnValue(throwError(() => new Error('fail')));

    expect(() => {
      fixture = TestBed.createComponent(PaymentSuccessComponent);
      fixture.detectChanges();
    }).not.toThrow();
  });
});
