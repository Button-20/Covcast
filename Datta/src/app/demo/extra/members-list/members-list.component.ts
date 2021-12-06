import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Members } from '../../../theme/shared/members.model';
import { MembersService } from 'src/app/theme/shared/members.service';
import * as moment from 'moment';
import { UserService } from 'src/app/theme/shared/user.service';


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
    othername: new FormControl('', [Validators.required, Validators.minLength(4)]),
    gender: new FormControl(this.model.gender),
    email: new FormControl('', [Validators.required, Validators.email]),
    digitaladdress: new FormControl('', [Validators.required, Validators.minLength(4)]),
    phonenumber: new FormControl('', [Validators.required, Validators.minLength(10)]),
    dateofbirth: new FormControl('', Validators.required),
  })

  smsForm = new FormGroup({
    destination: new FormControl('', Validators.required),
    source: new FormControl('', Validators.required),
    message: new FormControl('', Validators.required),
  })

  serverErrorMessages = '';
  search: string;


  constructor(private userService: UserService,public memberService: MembersService, private modalService: NgbModal, private toastr: ToastrService) { }

  ngOnInit() {
    this.refreshMemberList();
  }

  refreshMemberList(){
    var payLoad = this.userService.getUserPayload();
    if (payLoad.classname == 'Admin') {
      this.memberService.getMembersList().subscribe((res) => {
        this.memberService.members = res as Members[];
        // this.totalRecords = this.userService.users.length;
        // this.spinner.hide();
      })
    } else {
      this.memberService.getMembersClassname(payLoad.classname).subscribe(res => {
          this.memberService.members = res as Members[];
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
    return moment(date).format("yyyy-MM-DD")
  }

  sendSms(){
    this.memberService.postSms(this.smsForm.value).subscribe(
      res => {
        // console.log(res)
        this.toastr.success('Sms delivered successfully', 'Sms Sent');
        this.modalService.dismissAll();
      },
      err => {
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
  
}
