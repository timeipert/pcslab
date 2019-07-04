import { TestBed } from '@angular/core/testing';

import { VerovioService } from './verovio.service';

describe('VerovioService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VerovioService = TestBed.get(VerovioService);
    expect(service).toBeTruthy();
  });
});
