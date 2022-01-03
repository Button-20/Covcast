import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/theme/shared/user.service';

@Component({
  selector: 'app-auth-reset-password',
  templateUrl: './auth-reset-password.component.html',
  styleUrls: ['./auth-reset-password.component.scss']
})
export class AuthResetPasswordComponent implements OnInit {

  resetForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  })
  serverErrorMessages = '';

  constructor(public userService: UserService, public toastr: ToastrService) { }

  ngOnInit() {
    
  }

  resetFormSubmit(){
    this.userService.resetPassword(this.resetForm.value.email).subscribe(
      async (res: any) => {
        this.resetForm.reset();
        await this.toastr.success(res.message, 'Email Sent');
      },
      err => {
        if (err.status === 422) {
          this.toastr.warning( this.serverErrorMessages = err.error.join('<br/>'), 'Member Post Failed')
        }
        else
          this.toastr.error( this.serverErrorMessages = 'Something went wrong. Please contact admin.', 'Error 422')
      })
  }
}
