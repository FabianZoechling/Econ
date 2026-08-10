import { routes } from './app.routes';
import { HomeComponent } from './home/home.component';
import { CartComponent } from './cart/cart.component';
import { ProductComponent } from './product/product.component';
import { PaymentSuccessComponent } from './payment/payment-success/payment-success.component';

describe('app.routes', () => {
  it('should define exactly 4 routes', () => {
    expect(routes.length).toBe(4);
  });

  it('should map the root path to HomeComponent', () => {
    const route = routes.find((r) => r.path === '');
    expect(route?.component).toBe(HomeComponent);
  });

  it('should map "cart" to CartComponent', () => {
    const route = routes.find((r) => r.path === 'cart');
    expect(route?.component).toBe(CartComponent);
  });

  it('should map "products/:id" to ProductComponent', () => {
    const route = routes.find((r) => r.path === 'products/:id');
    expect(route?.component).toBe(ProductComponent);
  });

  it('should map "PaymentSuccess" to PaymentSuccessComponent', () => {
    const route = routes.find((r) => r.path === 'PaymentSuccess');
    expect(route?.component).toBe(PaymentSuccessComponent);
  });
});
