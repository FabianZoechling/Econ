import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get', () => {
    it('should issue a GET request to the correct URL', () => {
      const mockResponse = { id: 1 };

      service.get<{ id: number }>('products').subscribe((res) => {
        expect(res).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(
        (r) => r.method === 'GET' && r.url === `${environment.apiUrl}/products`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should forward params to the request', () => {
      service.get('products', { category: 'shoes' }).subscribe();

      const req = httpMock.expectOne(
        (r) => r.url === `${environment.apiUrl}/products`
      );
      expect(req.request.params.get('category')).toBe('shoes');
      req.flush({});
    });
  });

  describe('post', () => {
    it('should issue a POST request with the given body', () => {
      const body = { name: 'test' };
      const mockResponse = { id: 1, name: 'test' };

      service.post<any>('products', body).subscribe((res) => {
        expect(res).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/products`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(body);
      req.flush(mockResponse);
    });
  });

  describe('put', () => {
    it('should issue a PUT request with the given body', () => {
      const body = { name: 'updated' };

      service.put<any>('products/1', body).subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/products/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(body);
      req.flush({});
    });
  });

  describe('delete', () => {
    it('should issue a DELETE request to the correct URL', () => {
      service.delete('products/1').subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/products/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });
  });
});
