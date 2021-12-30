import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AttendanceRoutingModule} from './attendance-routing.module';
import {SharedModule} from '../../../theme/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AttendanceComponent } from './attendance.component';
import {NgbButtonsModule, NgbDropdownModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import { AttendanceFilterPipe } from './filters/attendance-filter.pipe';
import { AttenmemPipe } from './filters/attenmem.pipe';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    NgbButtonsModule,
    NgbDropdownModule,
    NgbTooltipModule,
    AttendanceRoutingModule,
    NgxPaginationModule
  ],
  declarations: [AttendanceComponent, AttendanceFilterPipe, AttenmemPipe]
})
export class AttendanceModule { }
