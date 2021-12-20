import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { AuthComponent } from './theme/layout/auth/auth.component';
import { AuthGuard } from './theme/layout/auth/auth.guard';
import { RestrictGuard } from './theme/layout/auth/restrict.guard';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate:[AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard/default',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./demo/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'basic',
        loadChildren: () => import('./demo/ui-elements/ui-basic/ui-basic.module').then(m => m.UiBasicModule)
      },
      {
        path: 'forms',
        loadChildren: () => import('./demo/pages/form-elements/form-elements.module').then(m => m.FormElementsModule)
      },
      {
        path: 'tables',
        loadChildren: () => import('./demo/pages/tables/tables.module').then(m => m.TablesModule)
      },
      {
        path: 'charts',
        loadChildren: () => import('./demo/pages/core-chart/core-chart.module').then(m => m.CoreChartModule)
      },
      {
        path: 'users',
        loadChildren: () => import('./demo/extra/users/users.module').then(m => m.UsersModule),
        canActivate:[RestrictGuard],
      },
      {
        path: 'members-list',
        loadChildren: () => import('./demo/extra/members-list/members-list.module').then(m => m.MembersListModule)
      },
      {
        path: 'finance-mgt',
        loadChildren: () => import('./demo/extra/finance-mgt/finance-mgt.module').then(m => m.FinanceMgtModule)
      },
      {
        path: 'attendance',
        loadChildren: () => import('./demo/extra/attendance/attendance.module').then(m => m.AttendanceModule)
      },
      {
        path: 'bulk-sms',
        loadChildren: () => import('./demo/extra/bulk-sms/bulk-sms.module').then(m => m.BulksmsModule)
      },
      {
        path: 'payment',
        loadChildren: () => import('./demo/extra/payment/payment.module').then(m => m.PaymentModule)
      }
    ]
  },
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: 'auth',
        loadChildren: () => import('./demo/pages/authentication/authentication.module').then(m => m.AuthenticationModule)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'auth/signin'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
