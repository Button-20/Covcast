import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Members } from 'src/app/theme/shared/members.model';
import { MembersService } from 'src/app/theme/shared/members.service';
import { User } from 'src/app/theme/shared/user.model';
import { UserService } from 'src/app/theme/shared/user.service';

@Component({
  selector: 'app-bulk-sms',
  templateUrl: './bulk-sms.component.html',
  styleUrls: ['./bulk-sms.component.scss']
})
export class BulksmsComponent implements OnInit {
  model = {loginPermission: true}
  serverErrorMessages = '';
  bulkSmsForm = new FormGroup({
    destination: new FormControl('', [Validators.required, Validators.minLength(11)]),
    source: new FormControl('', Validators.required),
    message: new FormControl('', Validators.required),
    userid: new FormControl('', Validators.required)
  })
  data: any;
  IsAdmin = false;

  constructor(public memberService: MembersService, private toastr: ToastrService, public userService: UserService,) { }

  ngOnInit() {
    this.checkPermissions();
    var payload = this.userService.getUserPayload();
    this.bulkSmsForm.patchValue({
      source: 'COVSYSTEM',
      userid: payload._id
    })
  }

  bulkSmsFormSubmit(){
      this.memberService.postSms(this.bulkSmsForm.value).subscribe(
        res => {
          this.bulkSmsForm.reset();
          this.toastr.success('Sms has been sent successfully', 'Sms Sent');
        },
        err => {
            this.toastr.error( this.serverErrorMessages = 'Something went wrong. Please contact admin.', 'Error 422')
        }
      )
  }
  
  resetForm(){
    this.bulkSmsForm.reset();
  }

  addAllMembers(){
    var payLoad = this.userService.getUserPayload();
    this.memberService.getMembersClassname(payLoad.classname).subscribe((res) => {
      this.memberService.members = res as Members[];
      this.data =  this.memberService.members.map(member => member.phonenumber).join(",");
      this.bulkSmsForm.patchValue({
        destination: this.data
      })
    })
  }

  addAllUsers(){
    this.userService.getUserList().subscribe((res) => {
      this.userService.users = res as User[];
      this.data =  this.userService.users.map(user => user.phonenumber).join(",");
      this.bulkSmsForm.patchValue({
        destination: this.data
      })
    })
  }

  checkPermissions(){
    var payLoad = this.userService.getUserPayload();
    if (payLoad.role != "Admin") {
      this.IsAdmin = false
    } else {
      this.IsAdmin = true
    }
  }

}
