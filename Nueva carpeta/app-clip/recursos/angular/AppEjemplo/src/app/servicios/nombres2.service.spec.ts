import { TestBed } from '@angular/core/testing';

import { Nombres2Service } from './nombres2.service';

describe('Nombres2Service', () => {
  let service: Nombres2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Nombres2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
