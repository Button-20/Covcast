import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/theme/shared/user.service';

@Component({
  selector: 'app-auth-signin',
  templateUrl: './auth-signin.component.html',
  styleUrls: ['./auth-signin.component.scss']
})
export class AuthSigninComponent implements OnInit {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(4)])
  })
  serverErrorMessages = '';
  // permission: any;

  constructor(private userService: UserService, private router: Router, private toastr: ToastrService) { }

  ngOnInit() {
    if(this.userService.isLoggedIn())
      this.router.navigate(['dashboard/default']);
  }

  loginUser(){
    this.userService.login(this.loginForm.value).subscribe(
      res => {
        this.userService.setToken(res['token']);
        this.startPermissionCheck();
      },
      err => {
        if (err.status === 422) {
          this.toastr.warning( this.serverErrorMessages = err.error.message, 'User Post Failed')
        }
        else
          this.toastr.error( this.serverErrorMessages = 'Something went wrong. Please contact admin.', 'Error 422')
      }
    )
  }

  get email(){
    return this.loginForm.get('email')
  }

  get password(){
    return this.loginForm.get('password')
  }

  startPermissionCheck(){
    var payLoad = this.userService.getUserPayload();
    if(payLoad && payLoad.loginPermission.toString() == "false")
    {
      this.toastr.warning( this.serverErrorMessages = 'Your account has been deactivated. Please contact Admin', 'User Account Disabled');
      this.userService.deleteToken();
    }
    else
    {
      this.toastr.success('Logged in successfully', 'User Logged In');
      this.router.navigate(['/dashboard/default']);
    }
  }

}
