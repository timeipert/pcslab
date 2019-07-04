import { TestBed } from '@angular/core/testing';

import { NoteSelectService } from './note-select.service';

describe('NoteSelectService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NoteSelectService = TestBed.get(NoteSelectService);
    expect(service).toBeTruthy();
  });
});
