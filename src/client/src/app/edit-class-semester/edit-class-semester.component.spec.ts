import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditClassSemesterComponent } from './edit-class-semester.component';

describe('EditClassSemesterComponent', () => {
  let component: EditClassSemesterComponent;
  let fixture: ComponentFixture<EditClassSemesterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditClassSemesterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditClassSemesterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
