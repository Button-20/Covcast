import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/theme/shared/user.model';
import { UserService } from 'src/app/theme/shared/user.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  model = {loginPermission: true}
  closeResult = '';
  userForm = new FormGroup({
    _id: new FormControl(''),
    classname: new FormControl('', [Validators.required, Validators.minLength(4)]),
    fullname: new FormControl('', [Validators.required, Validators.minLength(4)]),
    phonenumber: new FormControl('', [Validators.required, Validators.maxLength(10)]),
    address: new FormControl('', [Validators.required, Validators.minLength(4)]),
    occupation: new FormControl('', [Validators.required, Validators.minLength(4)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(4)]),
    role: new FormControl(''),
    loginPermission: new FormControl(this.model.loginPermission),
  })
  showPass = true;
  search: string;
  serverErrorMessages = '';

  constructor(public userService: UserService, private modalService: NgbModal, private toastr: ToastrService) { }

  ngOnInit() {
    this.refreshUserList();
  }

  refreshUserList(){
    this.userService.getuserList().subscribe((res) => {
      this.userService.users = res as User[];
      // this.totalRecords = this.userService.users.length;
      // this.spinner.hide();
    })
  }

  userFormSubmit(){
    if(this.userForm.value._id == null){
      this.userService.postUser(this.userForm.value).subscribe(
        res => {
          this.refreshUserList();
          this.modalService.dismissAll();
          this.toastr.success('User has been created successfully', 'User Posted');
        },
        err => {
          if (err.status === 422) {
            this.toastr.warning( this.serverErrorMessages = err.error.join('<br/>'), 'User Post Failed')
          }
          else
            this.toastr.error( this.serverErrorMessages = 'Something went wrong. Please contact admin.', 'Error 422')
        }
      )
    }
    else{
      this.userService.putUser(this.userForm.value).subscribe(
        res => {
          this.refreshUserList();
          this.modalService.dismissAll();
          this.toastr.success('User has been updated successfully', 'User Updated');
        },
        err => {
          if (err.status === 422) {
            this.toastr.warning( this.serverErrorMessages = err.error.join('<br/>'), 'User Update Failed')
          }
          else
            this.toastr.error( this.serverErrorMessages = 'Something went wrong.Please contact admin.', 'Error 422')
        }
      )
    }
  }

  open(content) {
    this.userForm.reset();
    this.userForm.patchValue({
      loginPermission: this.model.loginPermission
    })
    this.showPass = true;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'})
  }

  onDelete(_id: string){
		if(confirm('Are you sure you want to delete this record?') == true){
			this.userService.deleteUser(_id).subscribe((res => {
				this.refreshUserList();
        this.toastr.success('User has been deleted successfully', 'User Deleted');
			}));
	  }
	}

  onEdit(content, user: User) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'})
    this.showPass = false;
    this.userForm.setValue({
      _id: user._id,
      classname: user.classname,
      fullname: user.fullname,
      phonenumber: user.phonenumber,
      address: user.address,
      occupation: user.occupation,
      email: user.email = user.email,
      password: user.password,
      role: user.role,
      loginPermission: user.loginPermission
    })
  }
}
