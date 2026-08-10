import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartComponent } from './cart.component';
import { CartProduct } from '../shared/models/cart-product';
import { Product } from '../shared/models/product';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;

  const product: Product = {
    id: '1',
    name: 'Test Product',
    description: 'desc',
    urlImg: 'img.png',
    reviews: 5,
    price: 50,
    previousPrice: null,
  };

  const buildCartProduct = (quantity: number, price = product.price): CartProduct => ({
    product: { ...product, price },
    quantity,
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialise with an empty cart and zero total when localStorage has no cart', () => {
    localStorage.removeItem('cart-products');

    fixture.detectChanges(); // triggers ngOnInit

    expect(component.cartProducts).toEqual([]);
    expect(component.total).toBe(0);
  });

  it('should load cart products from localStorage on init', () => {
    const stored = [buildCartProduct(2, 50)];
    localStorage.setItem('cart-products', JSON.stringify(stored));

    fixture.detectChanges();

    expect(component.cartProducts).toEqual(stored);
  });

  it('should compute the total as the sum of price * quantity for every product', () => {
    const stored = [buildCartProduct(2, 50), buildCartProduct(3, 10)];
    localStorage.setItem('cart-products', JSON.stringify(stored));

    fixture.detectChanges();

    expect(component.total).toBe(2 * 50 + 3 * 10);
  });

  it('should leave the total at 0 when the cart is empty', () => {
    localStorage.setItem('cart-products', JSON.stringify([]));

    fixture.detectChanges();

    expect(component.total).toBe(0);
  });

  it('updateCart should refresh cartProducts and total when called directly', () => {
    localStorage.removeItem('cart-products');
    fixture.detectChanges();
    expect(component.cartProducts).toEqual([]);

    const stored = [buildCartProduct(1, 25)];
    localStorage.setItem('cart-products', JSON.stringify(stored));
    component.updateCart();

    expect(component.cartProducts).toEqual(stored);
    expect(component.total).toBe(25);
  });
});
