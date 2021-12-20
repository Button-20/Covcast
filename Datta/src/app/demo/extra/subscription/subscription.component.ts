import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { MembersService } from 'src/app/theme/shared/members.service';
import { Payment } from 'src/app/theme/shared/payment.model';
import { PaymentService } from 'src/app/theme/shared/payment.service';
import { Subscription } from 'src/app/theme/shared/subscription.model';
import { SubscriptionService } from 'src/app/theme/shared/subscription.service';
import { UserService } from 'src/app/theme/shared/user.service';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {
  serverErrorMessages = '';
  subscriptionForm = new FormGroup({
    _id: new FormControl('', Validators.required),
    userid: new FormControl('', Validators.required),
    plan_id: new FormControl('', Validators.required),
    subscription_start: new FormControl('', Validators.required),
    subscription_end: new FormControl('', Validators.required)
  })
  search: string;
  space: string = " ";
  model = {
    startdate: '',
    enddate: ''
  };
  tempSearch;

  constructor(public subscriptionService: SubscriptionService, private toastr: ToastrService, private userService: UserService, private modalService: NgbModal, public paymentService: PaymentService) { }

  ngOnInit() {
    this.refreshSubscriptionList();
  }

  refreshSubscriptionList(){
    this.subscriptionService.getSubscriptionList().subscribe((res) => {
      this.subscriptionService.subscription = res as Subscription[];
    })
  }


  subscriptionFormSubmit(){
    if(this.subscriptionForm.value._id == null){
      this.subscriptionService.postSubscription(this.subscriptionForm.value).subscribe(
        res => {
          this.subscriptionForm.reset();
          this.toastr.success('Subscription has been created successfully', 'Subscription Added');
        },
        err => {
            this.toastr.error( this.serverErrorMessages = 'Something went wrong. Please contact admin.', 'Error 422')
        }
      )
    }else{
      this.subscriptionService.updateSubscription(this.subscriptionForm.value).subscribe(
        res => {
          this.subscriptionForm.reset();
          this.toastr.success('Subscription has been updated successfully', 'Subscription Updated');
        },
        err => {
            this.toastr.error( this.serverErrorMessages = 'Something went wrong. Please contact admin.', 'Error 422')
        }
      )
    }
  }
  
  resetForm(){
    this.subscriptionForm.reset();
  }

  open(content) {
    this.subscriptionForm.reset();
    var payload = this.userService.getUserPayload();
    if (payload) {
      this.subscriptionForm.patchValue({
        classname: payload.classname,
        userid: payload._id,
      })   
    }
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'})
  }

  // startSearch(startdate, enddate){
  //   this.paymentService.getDateRangeFilter(startdate, enddate).subscribe((res) => {
  //     this.paymentService.payment = res as Payment[];
  //   })
  // }

  onEdit(content, subscription: Subscription) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'})
    this.subscriptionForm.setValue({
      _id: subscription._id,
      userid: subscription.userid,
      plan_id: subscription.plan_id,
      subscription_start: this.formattedDate(subscription.subscription_start),
      subscription_end: this.formattedDate(subscription.subscription_end)
    })
  }

  formattedDate(date) {
    return moment(date).format("YYYY-MM-DD")
  }

  // clearSearch(){
  //   this.tempSearch = '';
  //   this.search = '';

  //     this.model = {
  //       startdate: '',
  //       enddate: ''
  //     }
      
  //     this.refreshAttendanceList();
  // }

}
