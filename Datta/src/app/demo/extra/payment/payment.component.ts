import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { MembersService } from 'src/app/theme/shared/members.service';
import { Payment } from 'src/app/theme/shared/payment.model';
import { PaymentService } from 'src/app/theme/shared/payment.service';
import { Plan } from 'src/app/theme/shared/plan.model';
import { PlanService } from 'src/app/theme/shared/plan.service';
import { UserService } from 'src/app/theme/shared/user.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  serverErrorMessages = '';
  resamount = null;
  paymentForm = new FormGroup({
    _id: new FormControl('', Validators.required),
    userid: new FormControl('', Validators.required),
    modeOfPayment: new FormControl('', Validators.required),
    subscription_plan: new FormControl('', Validators.required),
    currencyCode: new FormControl('', [Validators.required, Validators.minLength(1)]),
    phonenumber: new FormControl('', [Validators.required, Validators.minLength(10)]),
    type: new FormControl('', Validators.required),
    description: new FormControl(''),
  })
  search: string;
  space: string = " ";
  model = {
    startdate: '',
    enddate: ''
  };
  tempSearch;
  response: any;

  constructor(private toastr: ToastrService, private userService: UserService, private modalService: NgbModal, public paymentService: PaymentService, public planService: PlanService) { }

  ngOnInit() {
    this.refreshPaymentList();
  }

  refreshPaymentList(){
    var payLoad = this.userService.getUserPayload();
    if (payLoad.classname == 'Admin') {
      this.paymentService.getPaymentsList().subscribe((res) => {
        this.paymentService.payment = res as Payment[];
        // this.totalRecords = this.userService.users.length;
        // this.spinner.hide();
        this.planService.getPlanList().subscribe(res => {
          this.planService.plan = res as Plan[];
        })   
      })
    } else {
      this.paymentService.getPaymentsListByUser(payLoad._id).subscribe(res => {
          this.paymentService.payment = res as Payment[];
      })
      this.planService.getPlanList().subscribe(res => {
        this.planService.plan = res as Plan[];
      }) 
    }
  }


  paymentFormSubmit(){
      this.paymentService.postPayment(this.paymentForm.value).subscribe(
        res => {
          this.paymentForm.reset();
          this.modalService.dismissAll();
          this.refreshPaymentList();
          this.toastr.success('Payment has been received successfully', 'Payment Sent');
        },
        err => {
          if (err.status === 422) {
            this.toastr.warning( this.serverErrorMessages = err.error.join('<br/>'), 'Payment Post Failed')
          }
          else
            this.toastr.error( this.serverErrorMessages = 'Something went wrong. Please contact admin.', 'Error 422')
        }
      )
  }
  
  resetForm(){
    this.paymentForm.reset();
  }

  open(content) {
    this.paymentForm.reset();
    var payload = this.userService.getUserPayload();
    if (payload) {
      this.paymentForm.patchValue({
        currencyCode: '¢',
        userid: payload._id,
      })   
    }
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'})
  }

  startSearch(startdate, enddate){
    this.paymentService.getDateRangeFilter(startdate, enddate).subscribe((res) => {
      this.paymentService.payment = res as Payment[];
    })
  }

  clearSearch(){
    this.tempSearch = '';
    this.search = '';

      this.model = {
        startdate: '',
        enddate: ''
      }
      
      this.refreshPaymentList();
  }

}
