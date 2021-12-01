import { DuesStatementComponent } from './pages/members-list/dues/dues-statement/dues-statement.component';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from "./app.component";
import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { AppRoutingModule } from "./app-routing.module";
import { ComponentsModule } from "./components/components.module";
import { UserListComponent } from './pages/user/user-management/user-list/user-list.component';
import { MembersListComponent } from './pages/members-list/members-list.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { SearchFilterPipe } from './pages/search-filter.pipe';
import { MemFilterPipe } from './pages/members-list/filter/mem-filter.pipe';
import { UsersmemPipe } from './pages/members-list/filter/usersmem.pipe';
import { DuesListComponent } from './pages/members-list/dues/dues-list/dues-list.component';
import { AttendanceComponent } from './pages/members-list/attendance/attendance/attendance.component';
import { DuesFilterPipe } from './pages/members-list/filter/dues-filter.pipe';
import { AttendanceFilterPipe } from './pages/members-list/filter/attendance-filter.pipe';
import { StatementFilterPipe } from './pages/members-list/filter/statement-filter.pipe';
import { AttendanceStatementComponent } from './pages/members-list/attendance/attendance-statement/attendance-statement.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { AuthInterceptor } from './pages/auth/auth.interceptor';
import { NgxSpinner, NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ComponentsModule,
    NgbModule,
    RouterModule,
    AppRoutingModule,
    NgxSpinnerModule,
    NgxPaginationModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      progressBar: true
    })
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
    UserListComponent,
    MembersListComponent,
    LoginComponent,
    SearchFilterPipe,
    MemFilterPipe,
    UsersmemPipe,
    DuesListComponent,
    AttendanceComponent,
    DuesFilterPipe,
    AttendanceFilterPipe,
    DuesStatementComponent,
    StatementFilterPipe,
    AttendanceStatementComponent
],
  providers: [
   {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
