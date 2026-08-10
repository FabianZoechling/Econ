import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { ProductService } from './product.service';
import { ProductApiService } from './product-api.service';
import { Product } from '../../shared/models/product';

describe('ProductService', () => {
  let service: ProductService;
  let productApiServiceSpy: jasmine.SpyObj<ProductApiService>;

  const products: Product[] = [
    {
      id: '1',
      name: 'Product 1',
      description: 'desc 1',
      urlImg: 'img1.png',
      reviews: 10,
      price: 100,
      previousPrice: 150,
    },
    {
      id: '2',
      name: 'Product 2',
      description: 'desc 2',
      urlImg: 'img2.png',
      reviews: 20,
      price: 200,
      previousPrice: null,
    },
    {
      id: '3',
      name: 'Product 3',
      description: 'desc 3',
      urlImg: 'img3.png',
      reviews: 30,
      price: 300,
      previousPrice: null,
    },
    {
      id: '4',
      name: 'Product 4',
      description: 'desc 4',
      urlImg: 'img4.png',
      reviews: 40,
      price: 400,
      previousPrice: null,
    },
    {
      id: '5',
      name: 'Product 5',
      description: 'desc 5',
      urlImg: 'img5.png',
      reviews: 50,
      price: 500,
      previousPrice: null,
    },
    {
      id: '6',
      name: 'Product 6',
      description: 'desc 6',
      urlImg: 'img6.png',
      reviews: 60,
      price: 600,
      previousPrice: null,
    },
  ];

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ProductApiService', [
      'getProducts',
      'getProduct',
    ]);

    TestBed.configureTestingModule({
      providers: [
        ProductService,
        { provide: ProductApiService, useValue: spy },
      ],
    });

    service = TestBed.inject(ProductService);
    productApiServiceSpy = TestBed.inject(
      ProductApiService
    ) as jasmine.SpyObj<ProductApiService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should fetch products from the API on first call', () => {
      productApiServiceSpy.getProducts.and.returnValue(of(products));

      let result: Product[] | undefined;
      service.getAll().subscribe((res) => (result = res));

      expect(productApiServiceSpy.getProducts).toHaveBeenCalledTimes(1);
      expect(result).toEqual(products);
    });

    it('should cache the results and not hit the API again on subsequent calls', () => {
      productApiServiceSpy.getProducts.and.returnValue(of(products));

      service.getAll().subscribe();
      service.getAll().subscribe();
      let result: Product[] | undefined;
      service.getAll().subscribe((res) => (result = res));

      expect(productApiServiceSpy.getProducts).toHaveBeenCalledTimes(1);
      expect(result).toEqual(products);
    });

    it('should emit the fetched products on the products$ stream', () => {
      productApiServiceSpy.getProducts.and.returnValue(of(products));

      const emitted: Product[][] = [];
      service.products$.subscribe((res) => emitted.push(res));

      service.getAll().subscribe();

      expect(emitted[emitted.length - 1]).toEqual(products);
    });
  });

  describe('getOffers', () => {
    it('should return at most the first 5 products', () => {
      productApiServiceSpy.getProducts.and.returnValue(of(products));

      let result: Product[] | undefined;
      service.getOffers().subscribe((res) => (result = res));

      expect(result?.length).toBe(5);
      expect(result).toEqual(products.slice(0, 5));
    });

    it('should return fewer than 5 items when fewer products are available', () => {
      const shortList = products.slice(0, 2);
      productApiServiceSpy.getProducts.and.returnValue(of(shortList));

      let result: Product[] | undefined;
      service.getOffers().subscribe((res) => (result = res));

      expect(result).toEqual(shortList);
    });
  });

  describe('getById', () => {
    it('should fetch from the API when the cache is empty', () => {
      productApiServiceSpy.getProduct.and.returnValue(of(products[0]));

      let result: Product | undefined;
      service.getById('1').subscribe((res) => (result = res));

      expect(productApiServiceSpy.getProduct).toHaveBeenCalledWith('1');
      expect(result).toEqual(products[0]);
    });

    it('should return the cached product without calling the API when the cache is warm', () => {
      productApiServiceSpy.getProducts.and.returnValue(of(products));
      service.getAll().subscribe();

      let result: Product | undefined;
      service.getById('3').subscribe((res) => (result = res));

      expect(productApiServiceSpy.getProduct).not.toHaveBeenCalled();
      expect(result).toEqual(products[2]);
    });

    it('should fall back to the API when the id is not present in a warm cache', () => {
      productApiServiceSpy.getProducts.and.returnValue(of(products));
      service.getAll().subscribe();

      productApiServiceSpy.getProduct.and.returnValue(of(undefined));

      let result: Product | undefined = products[0];
      service.getById('does-not-exist').subscribe((res) => (result = res));

      expect(productApiServiceSpy.getProduct).toHaveBeenCalledWith(
        'does-not-exist'
      );
      expect(result).toBeUndefined();
    });
  });
});
