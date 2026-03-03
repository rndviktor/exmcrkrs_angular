import { TestBed } from '@angular/core/testing';

import { Publisher } from './publisher';

describe('Publisher', () => {
  let service: Publisher;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Publisher);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
