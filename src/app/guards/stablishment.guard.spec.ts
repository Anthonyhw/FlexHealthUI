import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { stablishmentGuard } from './stablishment.guard';

describe('stablishmentGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => stablishmentGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
