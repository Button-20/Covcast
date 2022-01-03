import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthConfirmPasswordComponent } from './auth-confirm-password.component';

const routes: Routes = [
  {
    path: '',
    component: AuthConfirmPasswordComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthConfirmPasswordRoutingModule { }
