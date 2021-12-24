import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubscriptionComponent } from './subscription.component';
import {SharedModule} from '../../../theme/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SubscriptionRoutingModule } from './subscription-routing.module';
import { NgbButtonsModule, NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SubscriptionFilterPipe } from './subscription-filter.pipe';

@NgModule({
  imports: [
    CommonModule,
    SubscriptionRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    NgbButtonsModule,
    NgbDropdownModule,
    NgbTooltipModule

  ],
  declarations: [SubscriptionComponent, SubscriptionFilterPipe]
})
export class SubscriptionModule { }
