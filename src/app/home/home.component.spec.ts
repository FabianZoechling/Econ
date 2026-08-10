import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { HomeComponent } from './home.component';
import { ProductService } from '../core/services/product.service';
import { Product } from '../shared/models/product';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;

  const products: Product[] = [
    {
      id: '1',
      name: 'Product 1',
      description: 'desc',
      urlImg: 'img.png',
      reviews: 5,
      price: 50,
      previousPrice: null,
    },
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ProductService', ['getAll', 'getOffers']);
    spy.getAll.and.returnValue(of(products));
    spy.getOffers.and.returnValue(of(products));

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        provideRouter([]),
        { provide: ProductService, useValue: spy },
      ],
    }).compileComponents();

    productServiceSpy = TestBed.inject(
      ProductService
    ) as jasmine.SpyObj<ProductService>;
  });

  it('should create and expose products$ / productOffers$', () => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;

    expect(component).toBeTruthy();
    expect(productServiceSpy.getAll).toHaveBeenCalled();
    expect(productServiceSpy.getOffers).toHaveBeenCalled();
  });

  it('should emit the products returned by ProductService.getAll on products$', (done) => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;

    component.products$.subscribe((res) => {
      expect(res).toEqual(products);
      done();
    });
  });

  it('should emit the offers returned by ProductService.getOffers on productOffers$', (done) => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;

    component.productOffers$.subscribe((res) => {
      expect(res).toEqual(products);
      done();
    });
  });

  it('should initialise flowbite once offers are loaded', (done) => {
    // The flowbite module is imported as an ES namespace object, which the
    // build compiles to a read-only export, so it can't be spied on directly.
    // The component logs right before calling initFlowbite(), so we assert
    // on that instead to confirm the deferred init path actually runs.
    const logSpy = spyOn(console, 'log');

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;

    component.productOffers$.subscribe(() => {
      setTimeout(() => {
        expect(logSpy).toHaveBeenCalledWith('Initializing Flowbite...');
        done();
      }, 0);
    });
  });

  it('should not throw when offers are empty', () => {
    productServiceSpy.getOffers.and.returnValue(of([]));

    expect(() => {
      fixture = TestBed.createComponent(HomeComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    }).not.toThrow();
  });
});
