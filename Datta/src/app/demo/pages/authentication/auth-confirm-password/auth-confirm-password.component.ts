import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/theme/shared/user.service';
import { MustMatch } from './MustMatch';

@Component({
  selector: 'app-auth-confirm-password',
  templateUrl: './auth-confirm-password.component.html',
  styleUrls: ['./auth-confirm-password.component.scss']
})
export class AuthConfirmPasswordComponent implements OnInit {
  passwordForm: FormGroup;
  serverErrorMessages = '';

  constructor(public userService: UserService, public toastr: ToastrService, private activatedRoute: ActivatedRoute, private router: Router, private formBuilder: FormBuilder) {
    this.passwordForm = this.formBuilder.group({
      password: new FormControl('', [Validators.required, Validators.minLength(4)]),
      confirmpassword: new FormControl('', [Validators.required], )
    }, { validators: MustMatch('password', 'confirmpassword') })
  }

  ngOnInit() {

  }

  passwordFormSubmit(){
    if (!this.passwordForm.valid) {
      let token = this.activatedRoute.snapshot.params.token;
      this.userService.confirmNewPassword(token, this.passwordForm.value).subscribe(
        async (res: any) => {
          this.passwordForm.reset();
          await this.toastr.success(res.message, 'Password Reset Successful');
          this.router.navigate(['auth/signin']);
        },
        err => {
          if (err.status === 422) {
            this.toastr.warning( this.serverErrorMessages = err.error.message, 'Password Reset Failed')
          }
          else
            this.toastr.error( this.serverErrorMessages = 'Something went wrong. Please contact admin.', 'Error 422')
        })
      } else
      return null;
  }


}
