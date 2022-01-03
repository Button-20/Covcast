import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Members } from '../../../theme/shared/members.model';
import { MembersService } from 'src/app/theme/shared/members.service';
import * as moment from 'moment';
import { UserService } from 'src/app/theme/shared/user.service';
import { ExcelService } from 'src/app/theme/shared/excel.service';
import jsPDFInvoiceTemplate, { OutputType } from "jspdf-invoice-template";


@Component({
  selector: 'app-members-list',
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.scss']
})
export class MembersListComponent implements OnInit {

  model = {gender: true}
  memberForm = new FormGroup({
    classname: new FormControl('', Validators.required),
    _id: new FormControl('', Validators.required),
    firstname: new FormControl('', [Validators.required, Validators.minLength(4)]),
    lastname: new FormControl('', [Validators.required, Validators.minLength(4)]),
    othername: new FormControl('', []),
    gender: new FormControl(this.model.gender),
    email: new FormControl('', [Validators.required, Validators.email]),
    digitaladdress: new FormControl('', [Validators.required, Validators.minLength(4)]),
    phonenumber: new FormControl('', [Validators.required, Validators.minLength(10)]),
    dateofbirth: new FormControl('', Validators.required),
  })

  smsForm = new FormGroup({
    destination: new FormControl('', Validators.required),
    source: new FormControl(null, Validators.required),
    message: new FormControl('', Validators.required),
  })

  uploadForm = new FormGroup({
    source: new FormControl('', Validators.required),
    file: new FormControl(null)
  })

  serverErrorMessages = '';
  serverServerMessages: any;
  search: string;
  premiumPlan = false;
  columns: any[] = ['Class Name', 'First Name', 'Last Name', 'Other Name', 'Gender', 'Email', 'Digital Address', 'Phone Number', 'Date of Birth'];
  data: any[] = [];
  Admin: any;
  page: number = 1;
  totalRecords: number;

  constructor(
    private userService: UserService,
    public memberService: MembersService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    public excelService: ExcelService) { }

  ngOnInit() {
    this.refreshMemberList();
    this.checkSubscription();
    this.Admin = this.userService.getUserPayload();
  }

  refreshMemberList(){
    var payLoad = this.userService.getUserPayload();
    if (payLoad.classname == 'Admin') {
      this.memberService.getMembersList().subscribe((res) => {
        this.memberService.members = res as Members[];
        this.totalRecords = this.memberService.members.length;
        // this.spinner.hide();
      })
    } else {
      this.memberService.getMembersClassname(payLoad.classname).subscribe(res => {
          this.memberService.members = res as Members[];
          this.totalRecords = this.memberService.members.length;
      })    
    }
  }

  memberFormSubmit(){
    if(this.memberForm.value._id == null){
      this.memberService.postMember(this.memberForm.value).subscribe(
        res => {
          this.refreshMemberList();
          this.modalService.dismissAll();
          this.toastr.success('Member has been created successfully', 'Member Posted');
        },
        err => {
          if (err.status === 422) {
            this.toastr.warning( this.serverErrorMessages = err.error.join('<br/>'), 'Member Post Failed')
          }
          else
            this.toastr.error( this.serverErrorMessages = 'Something went wrong. Please contact admin.', 'Error 422')
        }
      )
    }
    else{
      this.memberService.putMember(this.memberForm.value).subscribe(
        res => {
          this.refreshMemberList();
          this.modalService.dismissAll();
          this.toastr.success('Member has been updated successfully', 'Member Updated');
        },
        err => {
          if (err.status === 422) {
            this.toastr.warning( this.serverErrorMessages = err.error.join('<br/>'), 'Member Update Failed')
          }
          else
            this.toastr.error( this.serverErrorMessages = 'Something went wrong.Please contact admin.', 'Error 422')
        }
      )
    }
  }

  open(content) {
    this.memberForm.reset();
    var payload = this.userService.getUserPayload();
    if (payload) {
      this.memberForm.patchValue({
        classname: payload.classname,
        gender: this.model.gender
      })   
    }
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'})
  }

  onDelete(_id: string){
		if(confirm('Are you sure you want to delete this record?') == true){
			this.memberService.deleteMember(_id).subscribe((res => {
				this.refreshMemberList();
        this.toastr.success('Member has been deleted successfully', 'Member Deleted');
			}));
	  }
	}

  onEdit(content, member: Members) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'})
    this.memberForm.setValue({
      classname: member.classname,
      _id: member._id,
      firstname: member.firstname,
      lastname: member.lastname,
      othername: member.othername,
      gender: member.gender,
      email: member.email,
      digitaladdress: member.digitaladdress,
      phonenumber: member.phonenumber,
      dateofbirth: this.formattedDate(member.dateofbirth)
    })
  }

  formattedDate(date) {
    return moment(date).format("YYYY-MM-DD")
  }

  sendSms(){
    this.memberService.postSms(this.smsForm.value).subscribe(
      res => {
        // console.log(res)
        this.toastr.success('Sms delivered successfully', 'Sms Sent');
        this.modalService.dismissAll();
      },
      err => {
        if (err.status === 422) {
          this.toastr.warning( this.serverErrorMessages = err.error.join('<br/>'), 'Sms Post Failed')
        }
        else
          this.toastr.error( this.serverErrorMessages = 'Something went wrong. Please contact admin.', 'Error 422')
      }
    )
    // alert(JSON.stringify(this.smsForm.value));
  }

  openSmsForm(smscontent, e){
    // console.log(e.target.innerText)
    this.smsForm.reset();
    this.smsForm.patchValue({
      destination: e.target.innerText,
      source: 'COVSYSTEM'
    })
    this.modalService.open(smscontent, {ariaLabelledBy: 'modal-basic-title'})
  }
  
  checkSubscription(){
    var payLoad = this.userService.getUserPayload();
    if (payLoad.subscription !== 'Premium Plan')
      this.premiumPlan = false
    else
    this.premiumPlan = true
  }

  openUpload(content) {
    this.uploadForm.reset();
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'})
  }
  
  onFileChange(event){
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.uploadForm.patchValue({
        file: file
      });
    }
  }

  uploadExcel(){
    const formData = new FormData();
    formData.append('file', this.uploadForm.get('file').value);
    this.memberService.postMemberExcel(formData).subscribe(
    res => {
      this.serverServerMessages = res as any
      this.toastr.success(this.serverServerMessages.message, 'File Uploaded');
      this.refreshMemberList();
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
    this.memberService.members.forEach(member => {
      let data = {
        ClassName: member.classname,
        FirstName: member.firstname,
        LastName: member.lastname,
        OtherName: member.othername,
        Gender: member.gender,
        Email: member.email,
        DigitalAddress: member.digitaladdress,
        PhoneNumber: member.phonenumber,
        DateOfBirth: this.formattedDate(member.dateofbirth)
      }
      this.data.push(data);
    })
    this.excelService.exportAsExcelFile('Member\'s Details', '', this.columns, this.data, [], 'Members__Exports', 'Members')
  }

  downloadPDF(){
    this.memberService.members.forEach(member => {
      let data = {
        ClassName: member.classname,
        FirstName: member.firstname,
        LastName: member.lastname,
        OtherName: member.othername,
        Gender: member.gender,
        Email: member.email,
        DigitalAddress: member.digitaladdress,
        PhoneNumber: member.phonenumber,
        DateOfBirth: this.formattedDate(member.dateofbirth)
      }
      this.data.push(data);
    })

    var props =  {
        outputType: OutputType.Save,
        returnJsPDFDocObject: true,
        fileName: Date.now() + "__Members__Exports",
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
            header: ['Class Name', 'First Name', 'Last Name', 'Other Name', 'Gender', 'Email', 'D. A.', 'Phone', 'D. O. B.'],
              table: Array.from(this.data, (item, index)=>([
                // index + 1,
                item.ClassName,
                item.FirstName,
                item.LastName,
                item.OtherName,
                item.Gender,
                item.Email,
                item.DigitalAddress,
                item.PhoneNumber,
                this.formattedDate(item.DateOfBirth)
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

  downloadUploadTemplate(){
  }
}
