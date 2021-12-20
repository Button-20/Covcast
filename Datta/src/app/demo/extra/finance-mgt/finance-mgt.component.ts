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
  serverErrorMessages = '';
  search: string;
  space: string = " ";
  totalRecords: Number;
  model = {
    startdate: '',
    enddate: ''
  }
  tempSearch;
  
  constructor(public duesService: DuesService, private userService: UserService, public memberService: MembersService, private modalService: NgbModal, private toastr: ToastrService) { }

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

}
