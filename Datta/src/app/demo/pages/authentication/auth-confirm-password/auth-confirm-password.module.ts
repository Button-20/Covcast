import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthConfirmPasswordRoutingModule } from './auth-confirm-password-routing.module';
import { AuthConfirmPasswordComponent } from './auth-confirm-password.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AuthConfirmPasswordRoutingModule
  ],
  declarations: [AuthConfirmPasswordComponent]
})
export class AuthConfirmPasswordModule { }
