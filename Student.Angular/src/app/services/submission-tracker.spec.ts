import { TestBed } from '@angular/core/testing';

import { SubmissionTracker } from './submission-tracker';

describe('SubmissionTracker', () => {
  let service: SubmissionTracker;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubmissionTracker);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
