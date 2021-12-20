import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { MembersService } from 'src/app/theme/shared/members.service';
import { Payment } from 'src/app/theme/shared/payment.model';
import { PaymentService } from 'src/app/theme/shared/payment.service';
import { UserService } from 'src/app/theme/shared/user.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  serverErrorMessages = '';
  paymentForm = new FormGroup({
    _id: new FormControl('', Validators.required),
    userid: new FormControl('', Validators.required),
    modeOfPayment: new FormControl('', Validators.required),
    subscription_plan: new FormControl('', Validators.required),
    currencyCode: new FormControl('', [Validators.required, Validators.minLength(1)]),
    amount: new FormControl(null, Validators.required),
    description: new FormControl(''),
    status: new FormControl('', Validators.required)
  })
  search: string;
  space: string = " ";
  model = {
    startdate: '',
    enddate: ''
  };
  tempSearch;

  constructor(public memberService: MembersService, private toastr: ToastrService, private userService: UserService, private modalService: NgbModal, public paymentService: PaymentService) { }

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
      })
    } else {
      this.paymentService.getPaymentsListByUser(payLoad._id).subscribe(res => {
          this.paymentService.payment = res as Payment[];
      })

      // this.memberService.getMembersClassname(payLoad.classname).subscribe(res => {
      //   this.memberService.members = res as Members[];
      // }) 
    }
  }


  paymentFormSubmit(){
      this.memberService.postSms(this.paymentForm.value).subscribe(
        res => {
          this.paymentForm.reset();
          this.toastr.success('Payment has been received successfully', 'Payment Sent');
        },
        err => {
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
