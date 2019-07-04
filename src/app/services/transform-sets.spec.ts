import { TestBed } from '@angular/core/testing';

import { TransformSets } from './transform-sets';

describe('TransformSets', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TransformSets = TestBed.get(TransformSets);
    expect(service).toBeTruthy();
  });
});
