import { TestBed } from '@angular/core/testing';

import { StoreSetsService } from './store-sets.service';

describe('StoreSetsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StoreSetsService = TestBed.get(StoreSetsService);
    expect(service).toBeTruthy();
  });
});
