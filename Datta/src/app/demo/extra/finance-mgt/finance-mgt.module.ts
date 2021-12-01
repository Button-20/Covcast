import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FinanceMgtRoutingModule } from './finance-mgt-routing.module';
import {SharedModule} from '../../../theme/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FinanceMgtComponent } from './finance-mgt.component';
import { UsersmemPipe } from './filters/usersmem.pipe';
import { DuesFilterPipe } from './filters/dues-filter.pipe';
import {NgbButtonsModule, NgbDropdownModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  imports: [
    CommonModule,
    FinanceMgtRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    NgbButtonsModule,
    NgbDropdownModule,
    NgbTooltipModule
  ],
  declarations: [FinanceMgtComponent, DuesFilterPipe, UsersmemPipe]
})
export class FinanceMgtModule { }
