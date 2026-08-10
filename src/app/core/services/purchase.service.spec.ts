import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { PurchaseService } from './purchase.service';
import { SavePurchaseDto } from '../../shared/models/save-purchase';

describe('PurchaseService', () => {
  let service: PurchaseService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(PurchaseService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should POST the purchase dto to the base url', () => {
    const dto: SavePurchaseDto = {
      total: 150,
      products: [{ id: '1', quantity: 3 }],
    };
    const mockResponse = { message: 'Purchase saved' };

    service.save(dto).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(dto);
    req.flush(mockResponse);
  });

  it('should propagate errors from the http layer', () => {
    const dto: SavePurchaseDto = { total: 0, products: [] };
    let errorCaught = false;

    service.save(dto).subscribe({
      next: () => fail('expected an error, not a success response'),
      error: () => (errorCaught = true),
    });

    const req = httpMock.expectOne('');
    req.flush('failure', { status: 500, statusText: 'Server Error' });

    expect(errorCaught).toBeTrue();
  });
});
