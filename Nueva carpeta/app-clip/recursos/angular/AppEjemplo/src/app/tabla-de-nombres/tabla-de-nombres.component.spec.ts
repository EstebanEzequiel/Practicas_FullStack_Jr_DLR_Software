import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaDeNombresComponent } from './tabla-de-nombres.component';

describe('TablaDeNombresComponent', () => {
  let component: TablaDeNombresComponent;
  let fixture: ComponentFixture<TablaDeNombresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaDeNombresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaDeNombresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
