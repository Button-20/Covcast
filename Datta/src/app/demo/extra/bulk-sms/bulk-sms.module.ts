import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BulksmsRoutingModule } from './bulk-sms-routing.module';
import { BulksmsComponent } from './bulk-sms.component';
import {SharedModule} from '../../../theme/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    BulksmsRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ],
  declarations: [BulksmsComponent]
})
export class BulksmsModule { }
