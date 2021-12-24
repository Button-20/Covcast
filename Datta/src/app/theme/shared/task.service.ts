import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Task } from './task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  selectedTask : Task;
  task: Task[];

  constructor(private http: HttpClient) { }

  postTask(task: Task){
    return this.http.post(environment.apiBaseUrl+'/user/task/register', task)
  }

  getTaskList(){
    return this.http.get(environment.apiBaseUrl +'/user/task');
  }

  getTaskById(id: string){
    return this.http.get(environment.apiBaseUrl + `/user/task/${id}`);
  }

  getTaskCountByClassname(classname: string){
    return this.http.get(environment.apiBaseUrl + `/user/taskcount/${classname}`);

  }
  getTaskByClassname(classname: string){
    return this.http.get(environment.apiBaseUrl + `/user/task/classname/${classname}`);
  }

  getTaskCount(){
    return this.http.get(environment.apiBaseUrl + '/user/alltaskcount');
  }

  getDateRangeFilter(startdate: string, enddate: string){
    return this.http.get(environment.apiBaseUrl + `/user/task/${startdate}/${enddate}`);
  }

  putTask(task: Task){
    return this.http.put(environment.apiBaseUrl + `/user/task/${task._id}`, task);
  }

  deletePlan(_id: string){
    return this.http.delete(environment.apiBaseUrl + `/user/task/${_id}`);
  }

}
