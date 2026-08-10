import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { ProductComponent } from './product.component';
import { ProductService } from '../core/services/product.service';
import { CartProduct } from '../shared/models/cart-product';
import { Product } from '../shared/models/product';

describe('ProductComponent', () => {
  let component: ProductComponent;
  let fixture: ComponentFixture<ProductComponent>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;

  const product: Product = {
    id: '1',
    name: 'Test Product',
    description: 'desc',
    urlImg: 'img.png',
    reviews: 5,
    price: 50,
    previousPrice: null,
  };

  const otherProduct: Product = {
    id: '2',
    name: 'Other Product',
    description: 'desc 2',
    urlImg: 'img2.png',
    reviews: 3,
    price: 30,
    previousPrice: null,
  };

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ProductService', ['getById']);
    spy.getById.and.returnValue(of(product));

    await TestBed.configureTestingModule({
      imports: [ProductComponent],
      providers: [{ provide: ProductService, useValue: spy }],
    }).compileComponents();

    productServiceSpy = TestBed.inject(
      ProductService
    ) as jasmine.SpyObj<ProductService>;

    fixture = TestBed.createComponent(ProductComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should fetch the product by the id input on init', () => {
    fixture.componentRef.setInput('id', '1');
    fixture.detectChanges();

    expect(productServiceSpy.getById).toHaveBeenCalledWith('1');
  });

  it('should expose the fetched product on product$', (done) => {
    fixture.componentRef.setInput('id', '1');
    fixture.detectChanges();

    component.product$.subscribe((res) => {
      expect(res).toEqual(product);
      done();
    });
  });

  describe('addToCart', () => {
    it('should create the cart in localStorage when it does not exist yet', () => {
      localStorage.removeItem('cart-products');

      component.addToCart(product);

      const stored: CartProduct[] = JSON.parse(
        localStorage.getItem('cart-products') as string
      );
      expect(stored).toEqual([{ product, quantity: 1 }]);
    });

    it('should append a new product to an existing cart', () => {
      localStorage.setItem(
        'cart-products',
        JSON.stringify([{ product: otherProduct, quantity: 1 }])
      );

      component.addToCart(product);

      const stored: CartProduct[] = JSON.parse(
        localStorage.getItem('cart-products') as string
      );
      expect(stored.length).toBe(2);
      expect(stored.find((p) => p.product.id === product.id)?.quantity).toBe(1);
    });

    it('should increment the quantity when the product is already in the cart', () => {
      localStorage.setItem(
        'cart-products',
        JSON.stringify([{ product, quantity: 2 }])
      );

      component.addToCart(product);

      const stored: CartProduct[] = JSON.parse(
        localStorage.getItem('cart-products') as string
      );
      expect(stored.length).toBe(1);
      expect(stored[0].quantity).toBe(3);
    });
  });
});
