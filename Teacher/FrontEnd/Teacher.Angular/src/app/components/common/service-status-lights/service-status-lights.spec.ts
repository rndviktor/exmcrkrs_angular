import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceStatusLights } from './service-status-lights';

describe('ServiceStatusLights', () => {
  let component: ServiceStatusLights;
  let fixture: ComponentFixture<ServiceStatusLights>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceStatusLights]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceStatusLights);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
