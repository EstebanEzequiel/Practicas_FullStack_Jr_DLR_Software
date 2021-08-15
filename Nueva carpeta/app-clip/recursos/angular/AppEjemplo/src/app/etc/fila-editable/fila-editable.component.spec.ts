import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilaEditableComponent } from './fila-editable.component';

describe('FilaEditableComponent', () => {
  let component: FilaEditableComponent;
  let fixture: ComponentFixture<FilaEditableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilaEditableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilaEditableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
