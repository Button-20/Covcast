import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MembersListRoutingModule } from './members-list-routing.module';
import {SharedModule} from '../../../theme/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MembersListComponent } from './members-list.component';
import { MemFilterPipe } from './mem-filter.pipe';
import {NgbButtonsModule, NgbDropdownModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  imports: [
    CommonModule,
    MembersListRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    NgbButtonsModule,
    NgbDropdownModule,
    NgbTooltipModule,
    NgxPaginationModule
  ],
  declarations: [MembersListComponent, MemFilterPipe]
})
export class MembersListModule { }
