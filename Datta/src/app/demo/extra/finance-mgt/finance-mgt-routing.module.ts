import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FinanceMgtComponent } from './finance-mgt.component';

const routes: Routes = [
  {
    path: '',
    component: FinanceMgtComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinanceMgtRoutingModule { }
