import { TestBed } from '@angular/core/testing';

import { NotLogGuard } from './not-log.guard';

describe('NotLogGuard', () => {
  let guard: NotLogGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(NotLogGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
