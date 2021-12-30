import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import jsPDFInvoiceTemplate, { OutputType } from 'jspdf-invoice-template';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ExcelService } from 'src/app/theme/shared/excel.service';
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
  columns: any[] = ['User Name', 'Transaction Code', 'Mode Of Payment', 'Subscription Plan', 'Currency Code', 'Amount', 'Digital Address', 'Description', 'Date of Payment', 'Status'];
  data: any[] = [];
  totalAmount = 0;
  footerData: any[][] = [];
  page: number = 1;
  totalRecords: number;

  constructor(private toastr: ToastrService, private userService: UserService, private modalService: NgbModal, public paymentService: PaymentService, public planService: PlanService, public excelService: ExcelService) { }

  ngOnInit() {
    this.refreshPaymentList();
  }

  refreshPaymentList(){
    var payLoad = this.userService.getUserPayload();
    if (payLoad.classname == 'Admin') {
      this.paymentService.getPaymentsList().subscribe((res) => {
        this.paymentService.payment = res as Payment[];
        this.totalRecords = this.paymentService.payment.length;
        // this.spinner.hide();
        this.planService.getPlanList().subscribe(res => {
          this.planService.plan = res as Plan[];
        })   
      })
    } else {
      this.paymentService.getPaymentsListByUser(payLoad._id).subscribe(res => {
          this.paymentService.payment = res as Payment[];
          this.totalRecords = this.paymentService.payment.length;
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

  formattedDate(date) {
    return moment(date).format("YYYY-MM-DD")
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

  downloadExcel(){
    this.paymentService.payment.forEach((payment: any) => {
      let data = {
        UserName: payment.userid.fullname,
        TransactionCode: payment.transaction_Code,
        ModeOfPayment	: payment.modeOfPayment,
        SubscriptionPlan: payment.subscription_plan.name,
        CurrencyCode	: payment.currencyCode,
        Amount: payment.amount,
        DigitalAddress: payment.digitaladdress,
        Description: payment.description,
        DateofPayment: this.formattedDate(payment.createdAt),
        Status: payment.status
      }
      this.data.push(data);
    })
    this.totalAmount = this.data.reduce((sum, item) => sum + item.Amount, 0);
    this.footerData.push(['Total', '', '', '', '', this.totalAmount]);
    this.excelService.exportAsExcelFile('Payment Records', '', this.columns, this.data, this.footerData, 'Payments__Exports', 'Payments')    

  }

  downloadPDF(){
    this.paymentService.payment.forEach((payment: any) => {
      let data = {
        UserName: payment.userid.fullname,
        TransactionCode: payment.transaction_Code,
        ModeOfPayment	: payment.modeOfPayment,
        SubscriptionPlan: payment.subscription_plan.name,
        CurrencyCode	: payment.currencyCode,
        Amount: payment.amount,
        Description: payment.description,
        DateofPayment: this.formattedDate(payment.createdAt),
        Status: payment.status
      }
      this.data.push(data);
    })

    var props =  {
        outputType: OutputType.Save,
        returnJsPDFDocObject: true,
        fileName: Date.now() + "__Payments__Exports",
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
                item.TransactionCode,
                item.ModeOfPayment,
                item.SubscriptionPlan,
                item.CurrencyCode,
                item.Amount,
                item.DigitalAddress,
                item.Description,
                item.DateofPayment,
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
  }

}
