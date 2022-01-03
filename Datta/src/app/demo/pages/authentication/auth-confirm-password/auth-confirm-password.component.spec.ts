import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthConfirmPasswordComponent } from './auth-confirm-password.component';

describe('AuthConfirmPasswordComponent', () => {
  let component: AuthConfirmPasswordComponent;
  let fixture: ComponentFixture<AuthConfirmPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthConfirmPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthConfirmPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
