import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BulksmsComponent} from './bulk-sms.component';

const routes: Routes = [
  {
    path: '',
    component: BulksmsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BulksmsRoutingModule { }
