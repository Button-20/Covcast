import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentComponent } from './payment.component';
import {SharedModule} from '../../../theme/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PaymentRoutingModule } from './payment-routing.module';
import { NgbButtonsModule, NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    PaymentRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    NgbButtonsModule,
    NgbDropdownModule,
    NgbTooltipModule

  ],
  declarations: [PaymentComponent]
})
export class PaymentModule { }
