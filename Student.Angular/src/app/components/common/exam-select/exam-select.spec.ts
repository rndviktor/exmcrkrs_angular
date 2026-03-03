import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamSelect } from './exam-select';

describe('ExamSelect', () => {
  let component: ExamSelect;
  let fixture: ComponentFixture<ExamSelect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamSelect]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamSelect);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
