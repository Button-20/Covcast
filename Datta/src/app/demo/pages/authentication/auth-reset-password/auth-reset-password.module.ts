import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthResetPasswordRoutingModule } from './auth-reset-password-routing.module';
import { AuthResetPasswordComponent } from './auth-reset-password.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AuthResetPasswordRoutingModule
  ],
  declarations: [AuthResetPasswordComponent]
})
export class AuthResetPasswordModule { }
