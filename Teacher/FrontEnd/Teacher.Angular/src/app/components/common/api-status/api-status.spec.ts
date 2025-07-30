import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiStatus } from './api-status';

describe('ApiStatus', () => {
  let component: ApiStatus;
  let fixture: ComponentFixture<ApiStatus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApiStatus]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApiStatus);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
