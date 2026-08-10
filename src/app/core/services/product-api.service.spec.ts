import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { ProductApiService } from './product-api.service';

describe('ProductApiService', () => {
  let service: ProductApiService;
  let httpMock: HttpTestingController;

  const apiUrl = 'https://fakestoreapi.com/products';

  const apiProduct = {
    id: 1,
    title: 'Fjallraven Backpack',
    price: 109.95,
    description: 'A durable backpack.',
    category: "men's clothing",
    image: 'https://fakestoreapi.com/img/backpack.jpg',
    rating: { rate: 3.9, count: 120 },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ProductApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getProducts', () => {
    it('should GET the product list and map every item to the internal Product shape', () => {
      let result: any;

      service.getProducts().subscribe((res) => (result = res));

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush([apiProduct]);

      expect(result).toEqual([
        {
          id: '1',
          name: 'Fjallraven Backpack',
          description: 'A durable backpack.',
          urlImg: 'https://fakestoreapi.com/img/backpack.jpg',
          reviews: 120,
          price: 109.95,
          previousPrice: null,
        },
      ]);
    });

    it('should return an empty array when the API returns no products', () => {
      let result: any;

      service.getProducts().subscribe((res) => (result = res));

      const req = httpMock.expectOne(apiUrl);
      req.flush([]);

      expect(result).toEqual([]);
    });
  });

  describe('getProduct', () => {
    it('should GET a single product by id and map it to the internal Product shape', () => {
      let result: any;

      service.getProduct('1').subscribe((res) => (result = res));

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(apiProduct);

      expect(result).toEqual({
        id: '1',
        name: 'Fjallraven Backpack',
        description: 'A durable backpack.',
        urlImg: 'https://fakestoreapi.com/img/backpack.jpg',
        reviews: 120,
        price: 109.95,
        previousPrice: null,
      });
    });

    it('should return undefined when the API responds with a falsy body', () => {
      let result: any = 'not-set';

      service.getProduct('999').subscribe((res) => (result = res));

      const req = httpMock.expectOne(`${apiUrl}/999`);
      req.flush(null as any);

      expect(result).toBeUndefined();
    });
  });
});
