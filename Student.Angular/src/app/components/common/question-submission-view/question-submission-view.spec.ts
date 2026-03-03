import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionSubmissionView } from './question-submission-view';

describe('QuestionSubmissionView', () => {
  let component: QuestionSubmissionView;
  let fixture: ComponentFixture<QuestionSubmissionView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionSubmissionView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionSubmissionView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
