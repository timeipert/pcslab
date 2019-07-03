import { TestBed } from '@angular/core/testing';

import { PcsetService } from './pcset.service';

describe('PcsetService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PcsetService = TestBed.get(PcsetService);
    expect(service).toBeTruthy();
  });
});
