import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { PaymentService } from './payment.service';
import { PaymentDto } from '../../shared/models/payment';
import { Product } from '../../shared/models/product';

describe('PaymentService', () => {
  let service: PaymentService;
  let httpMock: HttpTestingController;

  const product: Product = {
    id: '1',
    name: 'Test Product',
    description: 'desc',
    urlImg: 'img.png',
    reviews: 10,
    price: 100,
    previousPrice: 150,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(PaymentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should POST to /checkout with the payment dto and return the checkout url', () => {
    const paymentDto: PaymentDto = {
      products: [{ product, quantity: 2 }],
      total: 200,
    };
    const mockResponse = { checkoutUrl: 'https://checkout.example.com/abc' };

    service.checkout(paymentDto).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('/checkout');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(paymentDto);
    req.flush(mockResponse);
  });

  it('should propagate errors from the http layer', () => {
    const paymentDto: PaymentDto = { products: [], total: 0 };
    let errorCaught = false;

    service.checkout(paymentDto).subscribe({
      next: () => fail('expected an error, not a success response'),
      error: () => (errorCaught = true),
    });

    const req = httpMock.expectOne('/checkout');
    req.flush('failure', { status: 500, statusText: 'Server Error' });

    expect(errorCaught).toBeTrue();
  });
});
