import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'signup',
        loadChildren: () => import('./auth-signup/auth-signup.module').then(m => m.AuthSignupModule)
      },
      {
        path: 'signin',
        loadChildren: () => import('./auth-signin/auth-signin.module').then(m => m.AuthSigninModule)
      },
      {
        path: 'reset-password',
        loadChildren: () => import('./auth-reset-password/auth-reset-password.module').then(m => m.AuthResetPasswordModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
