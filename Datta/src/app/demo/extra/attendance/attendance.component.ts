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

  serverErrorMessages = '';
  search: string;
  space: string = " ";
  model = {
    startdate: '',
    enddate: ''
  };
  tempSearch;

  constructor(private userService: UserService, public memberService: MembersService, private modalService: NgbModal, private toastr: ToastrService, public attendanceService: AttendanceService) { }

  ngOnInit() {
    this.refreshAttendanceList();
  }

  refreshAttendanceList(){
    var payLoad = this.userService.getUserPayload();
    if (payLoad.classname == 'Admin') {
      this.attendanceService.getAttendanceList().subscribe((res) => {
        this.attendanceService.attendance = res as Attendance[];
        // this.totalRecords = this.userService.users.length;
        // this.spinner.hide();
      })
    } else {
      this.attendanceService.getAttendanceClassname(payLoad.classname).subscribe(res => {
          this.attendanceService.attendance = res as Attendance[];
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
    return moment(date).format("yyyy-MM-DD")
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

}