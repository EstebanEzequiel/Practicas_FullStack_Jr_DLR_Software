import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccesomainComponent } from './accesomain.component';

describe('AccesomainComponent', () => {
  let component: AccesomainComponent;
  let fixture: ComponentFixture<AccesomainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccesomainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccesomainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
