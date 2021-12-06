import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MembersService } from 'src/app/theme/shared/members.service';

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
  })

  constructor(public memberService: MembersService, private toastr: ToastrService) { }

  ngOnInit() {
    this.bulkSmsForm.patchValue({
      source: 'COVSYSTEM'
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

}
