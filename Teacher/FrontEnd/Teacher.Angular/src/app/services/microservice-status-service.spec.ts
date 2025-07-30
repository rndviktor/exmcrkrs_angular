import { TestBed } from '@angular/core/testing';

import { MicroserviceStatusService } from './microservice-status-service';

describe('MicroserviceStatusService', () => {
  let service: MicroserviceStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MicroserviceStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
