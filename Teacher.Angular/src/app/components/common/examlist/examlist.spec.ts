import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Examlist } from './examlist';

describe('Examlist', () => {
  let component: Examlist;
  let fixture: ComponentFixture<Examlist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Examlist]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Examlist);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
