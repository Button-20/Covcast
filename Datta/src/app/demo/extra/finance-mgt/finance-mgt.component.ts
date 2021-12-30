import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Members } from '../../../theme/shared/members.model';
import { MembersService } from 'src/app/theme/shared/members.service';
import * as moment from 'moment';
import { DuesService } from 'src/app/theme/shared/dues.service';
import { Dues } from 'src/app/theme/shared/dues.model';
import { UserService } from 'src/app/theme/shared/user.service';
import { ExcelService } from 'src/app/theme/shared/excel.service';
import jsPDFInvoiceTemplate, { OutputType } from 'jspdf-invoice-template';


@Component({
  selector: 'app-finance-mgt',
  templateUrl: './finance-mgt.component.html',
  styleUrls: ['./finance-mgt.component.scss']
})
export class FinanceMgtComponent implements OnInit {
  duesForm = new FormGroup({
    _id: new FormControl('', Validators.required),
    classname: new FormControl('', Validators.required),
    userid: new FormControl('', Validators.required),
    membername: new FormControl('', Validators.required),
    amount: new FormControl('', Validators.required),
    dateofpayment: new FormControl('', Validators.required),
    description: new FormControl(''),
  })
  uploadForm = new FormGroup({
    source: new FormControl('', Validators.required),
    file: new FormControl(null),
    userid: new FormControl('', Validators.required)
  })
  serverServerMessages: any;
  serverErrorMessages = '';
  search: string;
  space: string = " ";
  totalRecords: Number;
  model = {
    startdate: '',
    enddate: ''
  }
  tempSearch;
  columns: any[] = ['Member Name', 'Amount', 'Date Of Payment', 'Description'];
  data: any[] = [];
  totalAmount = 0;
  footerData: any[][] = [];
  
  constructor(
    public duesService: DuesService,
    private userService: UserService,
    public memberService: MembersService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    public excelService: ExcelService) { }

  ngOnInit() {
    this.refreshDuesList();
  }

  refreshDuesList(){
    var payLoad = this.userService.getUserPayload();
    if (payLoad.classname == 'Admin') {
      this.duesService.getDuesList().subscribe((res) => {
        this.duesService.dues = res as Dues[];
        // this.totalRecords = this.userService.users.length;
        // this.spinner.hide();
      })
    } else {
      this.duesService.getDuesWithClassName(payLoad.classname).subscribe((res) => {
        this.duesService.dues = res as Dues[];
        this.totalRecords = this.duesService.dues.length;
      })

      this.memberService.getMembersClassname(payLoad.classname).subscribe(res => {
        this.memberService.members = res as Members[];
      }) 
    }
  }


  dueFormSubmit(){
    console.log(this.duesForm.value)
    if(this.duesForm.value._id == null){
      this.duesService.postDues(this.duesForm.value).subscribe(
        res => {
          this.refreshDuesList();
          this.modalService.dismissAll();
          this.toastr.success('Due has been created successfully', 'Due Posted');
        },
        err => {
          if (err.status === 422) {
            this.toastr.warning( this.serverErrorMessages = err.error.join('<br/>'), 'Due Post Failed')
          }
          else
            this.toastr.error( this.serverErrorMessages = 'Something went wrong. Please contact admin.', 'Error 422')
        }
      )
    }
    else{
      this.duesService.putDues(this.duesForm.value).subscribe(
        res => {
          this.refreshDuesList();
          this.modalService.dismissAll();
          this.toastr.success('Due has been updated successfully', 'Due Updated');
        },
        err => {
          if (err.status === 422) {
            this.toastr.warning( this.serverErrorMessages = err.error.join('<br/>'), 'Due Update Failed')
          }
          else
            this.toastr.error( this.serverErrorMessages = 'Something went wrong.Please contact admin.', 'Error 422')
        }
      )
    }
  }

  open(content) {
    this.duesForm.reset();
    var payload = this.userService.getUserPayload();
    if (payload) {
      this.duesForm.patchValue({
        classname: payload.classname,
        userid: payload._id
      })   
    }
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'})
  }

  onDelete(_id: string){
		if(confirm('Are you sure you want to delete this record?') == true){
			this.duesService.deleteDues(_id).subscribe((res => {
				this.refreshDuesList();
        this.toastr.success('Due has been deleted successfully', 'Due Deleted');
			}));
	  }
	}

  onEdit(content, due: Dues) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'})
    this.duesForm.setValue({
      _id: due._id,
      classname: due.classname,
      userid: due.userid,
      membername: due.membername,
      amount: due.amount,
      dateofpayment: this.formattedDate(due.dateofpayment),
      description: due.description,
    })
  }

  formattedDate(date) {
    return moment(date).format("YYYY-MM-DD")
  }

  startSearch(startdate, enddate){
    this.duesService.getDateRangeFilter(startdate, enddate).subscribe((res) => {
      this.duesService.dues = res as Dues[];
    })
  }

  clearSearch(){
    this.tempSearch = '';
    this.search = '';

      this.model = {
        startdate: '',
        enddate: ''
      }
      
      this.refreshDuesList();
  }

  openUpload(content) {
    this.uploadForm.reset();
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'})
  }

  onFileChange(event){
    var payload = this.userService.getUserPayload();
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.uploadForm.patchValue({
        file: file,
        userid: payload._id
      });
    }
  }

  uploadExcel(){
    const formData = new FormData();
    formData.append('file', this.uploadForm.get('file').value);
    formData.append('userid', this.uploadForm.get('userid').value);
    this.duesService.postDuesExcel(formData).subscribe(
    res => {
      this.serverServerMessages = res as any
      this.toastr.success(this.serverServerMessages.message, 'File Uploaded');
      this.refreshDuesList();
      this.modalService.dismissAll();
    },
    err => {
      console.log(err)
      if (err.status === 400 || 500) {
        this.toastr.warning( this.serverErrorMessages = err.error, 'Excel Upload Failed')
      }
      else
        this.toastr.error( this.serverErrorMessages = 'Something went wrong. Please contact admin.', 'Error 422')
    })
  }

  downloadExcel(){
    this.duesService.dues.forEach(due => {
      let data = {
        MemberName: due.membername,
        Amount: due.amount,
        DateOfPayment: this.formattedDate(due.dateofpayment),
        Description: due.description
      }
      this.data.push(data);
    })
    this.totalAmount = this.data.reduce((sum, item) => sum + item.Amount, 0);
    this.footerData.push(['Total', this.totalAmount]);
    this.excelService.exportAsExcelFile('Dues/Finance Details', '', this.columns, this.data, this.footerData, 'Finances__Exports', 'Dues or Finances')
  }

  downloadPDF(){
    this.duesService.dues.forEach(due => {
      let data = {
        MemberName: due.membername,
        Amount: due.amount,
        DateOfPayment: this.formattedDate(due.dateofpayment),
        Description: due.description
      }
      this.data.push(data);
    })
    this.totalAmount = this.data.reduce((sum, item) => sum + item.Amount, 0);

    var props =  {
        outputType: OutputType.Save,
        returnJsPDFDocObject: true,
        fileName: Date.now() + "__Finances__Exports",
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
            header: ['Member Name', 'Amount', 'Date Of Payment', 'Description'],
              table: Array.from(this.data, (item, index)=>([
                // index + 1,
                item.MemberName,
                item.Amount,
                this.formattedDate(item.DateOfPayment),
                item.Description
            ])),
            invTotalLabel: "Total:",
            invTotal: this.totalAmount.toString(),
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
