import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { PaymentService } from 'src/app/theme/shared/payment.service';
import { Plan } from 'src/app/theme/shared/plan.model';
import { PlanService } from 'src/app/theme/shared/plan.service';
import { Subscription } from 'src/app/theme/shared/subscription.model';
import { SubscriptionService } from 'src/app/theme/shared/subscription.service';
import { User } from 'src/app/theme/shared/user.model';
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
    type: new FormControl('', Validators.required),
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

  constructor(public subscriptionService: SubscriptionService, private toastr: ToastrService, public userService: UserService, private modalService: NgbModal, public paymentService: PaymentService, public planService: PlanService) { }

  ngOnInit() {
    this.refreshSubscriptionList();
  }

  refreshSubscriptionList(){
    this.subscriptionService.getSubscriptionList().subscribe((res) => {
      this.subscriptionService.subscription = res as Subscription[];
    })

    this.userService.getUserList().subscribe((res) => {
      this.userService.users = res as User[];
    })

    this.planService.getPlanList().subscribe((res) => {
      this.planService.plan = res as Plan[];
    })
  }


  subscriptionFormSubmit(){
    if(this.subscriptionForm.value._id == null){
      this.subscriptionService.postSubscription(this.subscriptionForm.value).subscribe(
        res => {
          this.subscriptionForm.reset();
          this.refreshSubscriptionList();
          this.modalService.dismissAll();
          this.toastr.success('Subscription has been created successfully', 'Subscription Added');
        },
        err => {
          if (err.status === 422) {
            this.toastr.warning( this.serverErrorMessages = err.error.join('<br/>'), 'Subscription Post Failed')
          }
          else
            this.toastr.error( this.serverErrorMessages = 'Something went wrong. Please contact admin.', 'Error 422')
        }
      )
    }else{
      this.subscriptionService.updateSubscription(this.subscriptionForm.value).subscribe(
        res => {
          this.subscriptionForm.reset();
          this.refreshSubscriptionList();
          this.modalService.dismissAll();
          this.toastr.success('Subscription has been updated successfully', 'Subscription Updated');
        },
        err => {
          if (err.status === 422) {
            this.toastr.warning( this.serverErrorMessages = err.error.join('<br/>'), 'Subscription Post Failed')
          }
          else
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

  startSearch(startdate, enddate){
    this.subscriptionService.getDateRangeFilter(startdate, enddate).subscribe((res) => {
      this.subscriptionService.subscription = res as Subscription[];
    })
  }

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

  clearSearch(){
    this.tempSearch = '';
    this.search = '';

      this.model = {
        startdate: '',
        enddate: ''
      }
      
      this.refreshSubscriptionList();
  }

}
