import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentComponent } from './payment.component';
import {SharedModule} from '../../../theme/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PaymentRoutingModule } from './payment-routing.module';
import { NgbButtonsModule, NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { PaymentFilterPipe } from './payment-filter.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { Angular4PaystackModule } from 'angular4-paystack';

@NgModule({
  imports: [
    CommonModule,
    PaymentRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    NgbButtonsModule,
    NgbDropdownModule,
    NgbTooltipModule,
    NgxPaginationModule,
    Angular4PaystackModule.forRoot('pk_test_02eeec488ebae76eb4d4d5ade993b1ceb9068a91'),
  ],
  declarations: [PaymentComponent, PaymentFilterPipe]
})
export class PaymentModule { }
