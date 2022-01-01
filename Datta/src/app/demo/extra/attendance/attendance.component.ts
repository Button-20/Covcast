import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { MembersService } from 'src/app/theme/shared/members.service';
import * as moment from 'moment';
import { UserService } from 'src/app/theme/shared/user.service';
import { AttendanceService } from 'src/app/theme/shared/attendance.service';
import { Attendance } from 'src/app/theme/shared/attendance.model';
import { Members } from 'src/app/theme/shared/members.model';
import { ExcelService } from 'src/app/theme/shared/excel.service';
import jsPDFInvoiceTemplate, { OutputType } from 'jspdf-invoice-template';


@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent implements OnInit {
  modelForm = {present: true}
  attendanceForm = new FormGroup({
    _id: new FormControl('', Validators.required),
    userid: new FormControl('', Validators.required),
    classname: new FormControl('', Validators.required),
    membername: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required),
    temperature: new FormControl(null, Validators.required),
    event: new FormControl('', [Validators.required, Validators.minLength(4)]),
    present: new FormControl(this.modelForm.present),
  })
  uploadForm = new FormGroup({
    source: new FormControl('', Validators.required),
    file: new FormControl(null),
    userid: new FormControl('', Validators.required)
  })
  serverErrorMessages = '';
  serverServerMessages: any;
  search: string;
  space: string = " ";
  model = {
    startdate: '',
    enddate: ''
  };
  tempSearch;
  columns: any[] = ['Class Name', 'Member Name', 'Date', 'Temperature', 'Event', 'Present'];
  data: any[] = [];
  page: number = 1;
  totalRecords: number;
  Admin: any;


  constructor(private userService: UserService, public memberService: MembersService, private modalService: NgbModal, private toastr: ToastrService, public attendanceService: AttendanceService, public excelService: ExcelService) { }

  ngOnInit() {
    this.refreshAttendanceList();
    this.Admin = this.userService.getUserPayload();
  }

  refreshAttendanceList(){
    var payLoad = this.userService.getUserPayload();
    if (payLoad.classname == 'Admin') {
      this.attendanceService.getAttendanceList().subscribe((res) => {
        this.attendanceService.attendance = res as Attendance[];
        this.totalRecords = this.attendanceService.attendance.length;
        // this.spinner.hide();
      })
    } else {
      this.attendanceService.getAttendanceClassname(payLoad.classname).subscribe(res => {
          this.attendanceService.attendance = res as Attendance[];
          this.totalRecords = this.attendanceService.attendance.length;
        })

      this.memberService.getMembersClassname(payLoad.classname).subscribe(res => {
        this.memberService.members = res as Members[];
      }) 
    }
  }

  attendanceFormSubmit(){
    if(this.attendanceForm.value._id == null){
      this.attendanceService.postAttendance(this.attendanceForm.value).subscribe(
        res => {
          this.refreshAttendanceList();
          this.modalService.dismissAll();
          this.toastr.success('Attendance has been created successfully', 'Attendace Posted');
        },
        err => {
          if (err.status === 422) {
            this.toastr.warning( this.serverErrorMessages = err.error.join('<br/>'), 'Attendance Post Failed')
          }
          else
            this.toastr.error( this.serverErrorMessages = 'Something went wrong. Please contact admin.', 'Error 422')
        }
      )
    }
    else{
      this.attendanceService.putAttendance(this.attendanceForm.value).subscribe(
        res => {
          this.refreshAttendanceList();
          this.modalService.dismissAll();
          this.toastr.success('Attendance has been updated successfully', 'Attendance Updated');
        },
        err => {
          if (err.status === 422) {
            this.toastr.warning( this.serverErrorMessages = err.error.join('<br/>'), 'Attendance Update Failed')
          }
          else
            this.toastr.error( this.serverErrorMessages = 'Something went wrong.Please contact admin.', 'Error 422')
        }
      )
    }
  }

  open(content) {
    this.attendanceForm.reset();
    var payload = this.userService.getUserPayload();
    if (payload) {
      this.attendanceForm.patchValue({
        classname: payload.classname,
        userid: payload._id,
        present: this.modelForm.present
      })   
    }
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'})
  }

  onDelete(_id: string){
		if(confirm('Are you sure you want to delete this record?') == true){
			this.attendanceService.deleteAttendance(_id).subscribe((res => {
				this.refreshAttendanceList();
        this.toastr.success('Attendance has been deleted successfully', 'Attendance Deleted');
			}));
	  }
	}

  onEdit(content, attendance: Attendance) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'})
    this.attendanceForm.setValue({
      _id: attendance._id,
      userid: attendance.userid,
      classname: attendance.classname,
      membername: attendance.membername,
      date: this.formattedDate(attendance.date),
      temperature: attendance.temperature,
      event: attendance.event,
      present: attendance.present,
      })
  }

  formattedDate(date) {
    return moment(date).format("YYYY-MM-DD")
  }
  
  startSearch(startdate, enddate){
    this.attendanceService.getDateRangeFilter(startdate, enddate).subscribe((res) => {
      this.attendanceService.attendance = res as Attendance[];
    })
  }

  clearSearch(){
    this.tempSearch = '';
    this.search = '';

      this.model = {
        startdate: '',
        enddate: ''
      }
      
      this.refreshAttendanceList();
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
    this.attendanceService.postAttendanceExcel(formData).subscribe(
    res => {
      this.serverServerMessages = res as any
      this.toastr.success(this.serverServerMessages.message, 'File Uploaded');
      this.refreshAttendanceList();
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
    this.attendanceService.attendance.forEach(attendance => {
      let data = {
        ClassName: attendance.classname,
        MemberName: attendance.membername,
        Date: this.formattedDate(attendance.date),
        Temperature: attendance.temperature,
        Event: attendance.event,
        Present: (attendance.present ? 'Yes' : 'No'),
      }
      this.data.push(data);
    })
    this.excelService.exportAsExcelFile('Attendance Details', '', this.columns, this.data, [], 'Attendance__Exports', 'Attendances')
  }

  downloadPDF(){
    this.attendanceService.attendance.forEach(attendance => {
      let data = {
        ClassName: attendance.classname,
        MemberName: attendance.membername,
        Date: this.formattedDate(attendance.date),
        Temperature: attendance.temperature,
        Event: attendance.event,
        Present: (attendance.present ? 'Yes' : 'No'),
      }
      this.data.push(data);
    })

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
            header: this.columns,
              table: Array.from(this.data, (item, index)=>([
                // index + 1,
                item.ClassName,
                item.MemberName,
                this.formattedDate(item.Date),
                item.Temperature,
                item.Event,
                (item.Present ? 'Yes' : 'No')
        
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
