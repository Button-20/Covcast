import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import {SharedModule} from '../../../theme/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SearchFilterPipe } from './search-filter.pipe';

@NgModule({
  imports: [
    CommonModule,
    UsersRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ],
  declarations: [UsersComponent, SearchFilterPipe]
})
export class UsersModule { }
