import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartProductComponent } from './cart-product.component';
import { CartProduct } from '../../../shared/models/cart-product';
import { Product } from '../../../shared/models/product';

describe('CartProductComponent', () => {
  let component: CartProductComponent;
  let fixture: ComponentFixture<CartProductComponent>;

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

  let cartProduct: CartProduct;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartProductComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CartProductComponent);
    component = fixture.componentInstance;

    cartProduct = { product, quantity: 2 };
    fixture.componentRef.setInput('cartProduct', cartProduct);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should compute the initial total as price * quantity on init', () => {
    fixture.detectChanges();
    expect(component.total).toBe(100);
  });

  describe('updateQantity', () => {
    beforeEach(() => {
      localStorage.setItem(
        'cart-products',
        JSON.stringify([{ product, quantity: 2 }])
      );
      fixture.detectChanges();
    });

    it('should increase the quantity and recompute the total', () => {
      component.updateQantity(1);

      expect(component.cartProduct().quantity).toBe(3);
      expect(component.total).toBe(150);
    });

    it('should decrease the quantity and recompute the total', () => {
      component.updateQantity(-1);

      expect(component.cartProduct().quantity).toBe(1);
      expect(component.total).toBe(50);
    });

    it('should never let the quantity drop to 0, resetting it to 1 instead', () => {
      // starting quantity is 1 after this call, then subtract 1 again -> would be 0
      component.updateQantity(-1);
      component.updateQantity(-1);

      expect(component.cartProduct().quantity).toBe(1);
    });

    it('should persist the updated quantity back to localStorage', () => {
      component.updateQantity(2);

      const stored: CartProduct[] = JSON.parse(
        localStorage.getItem('cart-products') as string
      );
      const updated = stored.find((p) => p.product.id === product.id);

      expect(updated?.quantity).toBe(4);
    });

    it('should preserve other products already in localStorage when updating', () => {
      localStorage.setItem(
        'cart-products',
        JSON.stringify([
          { product, quantity: 2 },
          { product: otherProduct, quantity: 5 },
        ])
      );

      component.updateQantity(1);

      const stored: CartProduct[] = JSON.parse(
        localStorage.getItem('cart-products') as string
      );

      expect(stored.length).toBe(2);
      expect(stored.find((p) => p.product.id === otherProduct.id)?.quantity).toBe(5);
    });

    it('should emit updateCartEvent', () => {
      const emitSpy = spyOn(component.updateCartEvent, 'emit');

      component.updateQantity(1);

      expect(emitSpy).toHaveBeenCalled();
    });
  });

  describe('removeProduct', () => {
    it('should remove the current product from localStorage', () => {
      localStorage.setItem(
        'cart-products',
        JSON.stringify([
          { product, quantity: 2 },
          { product: otherProduct, quantity: 5 },
        ])
      );
      fixture.detectChanges();

      component.removeProduct();

      const stored: CartProduct[] = JSON.parse(
        localStorage.getItem('cart-products') as string
      );

      expect(stored.length).toBe(1);
      expect(stored[0].product.id).toBe(otherProduct.id);
    });

    it('should emit updateCartEvent', () => {
      localStorage.setItem(
        'cart-products',
        JSON.stringify([{ product, quantity: 2 }])
      );
      fixture.detectChanges();

      const emitSpy = spyOn(component.updateCartEvent, 'emit');

      component.removeProduct();

      expect(emitSpy).toHaveBeenCalled();
    });
  });
});
