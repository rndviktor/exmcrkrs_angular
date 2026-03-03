import { TestBed } from '@angular/core/testing';

import { Evaluator } from './evaluator';

describe('Evaluator', () => {
  let service: Evaluator;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Evaluator);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
