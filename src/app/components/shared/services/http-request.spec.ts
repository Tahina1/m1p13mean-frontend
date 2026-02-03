import { TestBed } from '@angular/core/testing';

import { HttpRequestService } from './http-request';

describe('HttpRequestService', () => {
  let service: HttpRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
