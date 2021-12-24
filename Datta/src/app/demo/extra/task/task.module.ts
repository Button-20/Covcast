import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaskRoutingModule } from './task-routing.module';
import {SharedModule} from '../../../theme/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TaskComponent } from './task.component';
import {NgbButtonsModule, NgbDropdownModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import { TaskFilterPipe } from './task-filter.pipe';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    NgbButtonsModule,
    NgbDropdownModule,
    NgbTooltipModule,
    TaskRoutingModule
  ],
  declarations: [TaskComponent, TaskFilterPipe]
})
export class TaskModule { }
