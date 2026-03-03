import { TestBed } from '@angular/core/testing';

import { Writer } from './writer';

describe('Writer', () => {
  let service: Writer;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Writer);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
