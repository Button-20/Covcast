import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { MembersService } from 'src/app/theme/shared/members.service';
import * as moment from 'moment';
import { UserService } from 'src/app/theme/shared/user.service';
import { TaskService } from 'src/app/theme/shared/task.service';
import { Task } from 'src/app/theme/shared/task.model';


@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {
  modelForm = {present: true}
  taskForm = new FormGroup({
    _id: new FormControl('', Validators.required),
    userid: new FormControl('', Validators.required),
    classname: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    description: new FormControl(''),
    status: new FormControl(null, Validators.required),
    startdate: new FormControl('', Validators.required),
    enddate: new FormControl('', Validators.required),
  })
  color: string;
  serverErrorMessages = '';
  search: string;
  space: string = " ";
  model = {
    startdate: '',
    enddate: ''
  };
  tempSearch;

  constructor(private userService: UserService, public memberService: MembersService, private modalService: NgbModal, private toastr: ToastrService, public taskService: TaskService) { }

  ngOnInit() {
    this.refreshTaskList();
  }

  refreshTaskList(){
    var payLoad = this.userService.getUserPayload();
    if (payLoad.classname == 'Admin') {
      this.taskService.getTaskList().subscribe((res) => {
        this.taskService.task = res as Task[];
        // this.totalRecords = this.userService.users.length;
        // this.spinner.hide();
      })
    } else {
      this.taskService.getTaskByClassname(payLoad.classname).subscribe(res => {
          this.taskService.task = res as Task[];
      })
    }
  }

  taskFormSubmit(){
    if(this.taskForm.value._id == null){
      this.taskService.postTask(this.taskForm.value).subscribe(
        res => {
          this.refreshTaskList();
          this.modalService.dismissAll();
          this.toastr.success('Task has been created successfully', 'Task Posted');
        },
        err => {
          if (err.status === 422) {
            this.toastr.warning( this.serverErrorMessages = err.error.join('<br/>'), 'Task Post Failed')
          }
          else
            this.toastr.error( this.serverErrorMessages = 'Something went wrong. Please contact admin.', 'Error 422')
        }
      )
    }
    else{
      this.taskService.putTask(this.taskForm.value).subscribe(
        res => {
          this.refreshTaskList();
          this.modalService.dismissAll();
          this.toastr.success('Task has been updated successfully', 'Task Updated');
        },
        err => {
          if (err.status === 422) {
            this.toastr.warning( this.serverErrorMessages = err.error.join('<br/>'), 'Task Update Failed')
          }
          else
            this.toastr.error( this.serverErrorMessages = 'Something went wrong.Please contact admin.', 'Error 422')
        }
      )
    }
  }

  open(content) {
    this.taskForm.reset();
    var payload = this.userService.getUserPayload();
    if (payload) {
      this.taskForm.patchValue({
        classname: payload.classname,
        userid: payload._id,
      })   
    }
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'})
  }

  onDelete(_id: string){
		if(confirm('Are you sure you want to delete this record?') == true){
			this.taskService.deletePlan(_id).subscribe((res => {
				this.refreshTaskList();
        this.toastr.success('Task has been deleted successfully', 'Task Deleted');
			}));
	  }
	}

  onEdit(content, task: Task) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'})
    this.taskForm.setValue({
      _id: task._id,
      userid: task.userid,
      classname: task.classname,
      name: task.name,
      description: task.description,
      status: task.status,
      startdate: this.formattedDate(task.startdate),
      enddate: this.formattedDate(task.enddate),
    })
  }

  formattedDate(date) {
    return moment(date).format("YYYY-MM-DD")
  }
  
  startSearch(startdate, enddate){
    this.taskService.getDateRangeFilter(startdate, enddate).subscribe((res) => {
      this.taskService.task = res as Task[];
    })
  }

  clearSearch(){
    this.tempSearch = '';
    this.search = '';

      this.model = {
        startdate: '',
        enddate: ''
      }
      
      this.refreshTaskList();
  }

}
