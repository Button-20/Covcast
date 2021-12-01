import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceMgtComponent } from './finance-mgt.component';

describe('FinanceMgtComponent', () => {
  let component: FinanceMgtComponent;
  let fixture: ComponentFixture<FinanceMgtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinanceMgtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinanceMgtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
