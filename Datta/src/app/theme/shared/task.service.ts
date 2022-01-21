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
    return this.http.post(environment.apiBaseUrl+'/task/register', task)
  }

  getTaskList(){
    return this.http.get(environment.apiBaseUrl +'/task');
  }

  getTaskById(id: string){
    return this.http.get(environment.apiBaseUrl + `/task/${id}`);
  }

  getTaskCountByClassname(classname: string){
    return this.http.get(environment.apiBaseUrl + `/taskcount/${classname}`);

  }
  getTaskByClassname(classname: string){
    return this.http.get(environment.apiBaseUrl + `/task/classname/${classname}`);
  }

  getTaskCount(){
    return this.http.get(environment.apiBaseUrl + '/alltaskcount');
  }

  getDateRangeFilter(startdate: string, enddate: string){
    return this.http.get(environment.apiBaseUrl + `/task/${startdate}/${enddate}`);
  }

  putTask(task: Task){
    return this.http.put(environment.apiBaseUrl + `/task/${task._id}`, task);
  }

  deletePlan(_id: string){
    return this.http.delete(environment.apiBaseUrl + `/task/${_id}`);
  }

}
