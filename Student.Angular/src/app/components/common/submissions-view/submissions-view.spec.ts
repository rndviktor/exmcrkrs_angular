import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmissionsView } from './submissions-view';

describe('SubmissionView', () => {
  let component: SubmissionsView;
  let fixture: ComponentFixture<SubmissionsView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmissionsView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmissionsView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
