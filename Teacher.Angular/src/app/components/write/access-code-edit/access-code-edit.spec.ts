import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessCodeEdit } from './access-code-edit';

describe('AccessCodeEdit', () => {
  let component: AccessCodeEdit;
  let fixture: ComponentFixture<AccessCodeEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccessCodeEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccessCodeEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
