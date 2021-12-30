import { Component, OnInit, ViewChild } from '@angular/core';
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
import { ExcelService } from 'src/app/theme/shared/excel.service';
import jsPDF from 'jspdf';
import jsPDFInvoiceTemplate, { OutputType } from 'jspdf-invoice-template';


@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {
  @ViewChild('')
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
  columns: any[] = ['User Name', 'Plan Type', 'Subscription Start', 'Subscription End', 'Status'];
  data: any[] = [];
  page: number = 1;
  totalRecords: number;


  constructor(public subscriptionService: SubscriptionService, private toastr: ToastrService, public userService: UserService, private modalService: NgbModal, public paymentService: PaymentService, public planService: PlanService, public excelService: ExcelService) { }

  ngOnInit() {
    this.refreshSubscriptionList();
  }

  refreshSubscriptionList(){
    this.subscriptionService.getSubscriptionList().subscribe((res) => {
      this.subscriptionService.subscription = res as Subscription[];
      this.totalRecords = this.subscriptionService.subscription.length;
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

  // onEdit(content, subscription: Subscription) {
  //   this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'})
  //   console.log(subscription);
  //   this.subscriptionForm.setValue({
  //     _id: subscription._id,
  //     userid: subscription.userid,
  //     plan_id: subscription.plan_id,
  //     subscription_start: this.formattedDate(subscription.subscription_start),
  //     subscription_end: this.formattedDate(subscription.subscription_end)
  //   })
  // }

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

  downloadExcel(){
    this.subscriptionService.getSubscriptionList().subscribe((res: any) => {
      res.forEach(subscription => {
        let data = {
          UserName: subscription.userid.fullname,
          PlanType: subscription.plan_id.name,
          SubscriptionStart: this.formattedDate(subscription.subscription_start),
          SubscriptionEnd: this.formattedDate(subscription.subscription_end),
          Status: subscription.status
        }
        this.data.push(data);
      })
      this.excelService.exportAsExcelFile('Subscription Record', '', this.columns, this.data, [], 'Subscriptions__Exports', 'Subscriptions')
    })
  }

  downloadPDF(){
    this.subscriptionService.getSubscriptionList().subscribe((res: any) => {
      res.forEach(subscription => {
        let data = {
          UserName: subscription.userid.fullname,
          PlanType: subscription.plan_id.name,
          SubscriptionStart: this.formattedDate(subscription.subscription_start),
          SubscriptionEnd: this.formattedDate(subscription.subscription_end),
          Status: subscription.status
        }
        this.data.push(data);
      })
    var props =  {
        outputType: OutputType.Save,
        returnJsPDFDocObject: true,
        fileName: Date.now() + "__Subscriptions__Exports",
        orientationLandscape: false,
        logo: {
            src: "https://raw.githubusercontent.com/edisonneza/jspdf-invoice-template/demo/images/logo.png",
            width: 53.33, //aspect ratio = width/height
            height: 26.66,
            margin: {
                top: 0, //negative or positive num, from the current position
                left: 0 //negative or positive num, from the current position
            }
        },
        business: {
            name: "Business Name",
            address: "Albania, Tirane ish-Dogana, Durres 2001",
            phone: "(+233) 55 065 3404",
            email: "jasonaddy51@gmail.com",
            email_1: "info@example.al",
            website: "www.example.al",
        },
        contact: {
            label: "Invoice issued for:",
            name: "Client Name",
            address: "Albania, Tirane, Astir",
            phone: "(+355) 069 22 22 222",
            email: "client@website.al",
            otherInfo: "www.website.al",
        },
        invoice: {
            label: "Invoice #: ",
            num: 19,
            invDate: "Payment Date: 01/01/2021 18:12",
            invGenDate: "Invoice Date: 02/02/2021 10:17",
            headerBorder: false,
            tableBodyBorder: false,
            header: this.columns,
              table: Array.from(this.data, (item, index)=>([
                // index + 1,
                item.UserName,
                item.PlanType,
                item.SubscriptionStart,
                item.SubscriptionEnd,
                item.Status
            ])),
            invTotalLabel: "Total:",
            invTotal: "145,250.50",
            invCurrency: "ALL",
            row1: {
                col1: 'VAT:',
                col2: '20',
                col3: '%',
                style: {
                    fontSize: 10 //optional, default 12
                }
            },
            row2: {
                col1: 'SubTotal:',
                col2: '116,199.90',
                col3: 'ALL',
                style: {
                    fontSize: 10 //optional, default 12
                }
            },
            invDescLabel: "Invoice Note",
            invDesc: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary.",
        },
        footer: {
            text: "The invoice is created on a computer and is valid without the signature and stamp.",
        },
        pageEnable: true,
        pageLabel: "Page ",
    }
    const pdfObject = jsPDFInvoiceTemplate(props);

    })

  }

}
