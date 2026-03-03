import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswerEdit } from './answer-edit';

describe('AnswerEdit', () => {
  let component: AnswerEdit;
  let fixture: ComponentFixture<AnswerEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnswerEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnswerEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
