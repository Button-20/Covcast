import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Attendance } from './attendance.model';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  selectedAttendance : Attendance;
  attendance: Attendance[];
  count: any;
  present = 0;
  absent = 0;

  noAuthHeader = {headers: new HttpHeaders({'NoAuth' : 'True'})};

  constructor(private http: HttpClient) { }

  postAttendance(attendance: Attendance){
    return this.http.post(environment.apiBaseUrl+'/attendance/register', attendance);
  }

  postAttendanceExcel(excel){
    return this.http.post(environment.apiBaseUrl+'/attendance/uploadExcel', excel);
  }

  getAttendanceList(){
    return this.http.get(environment.apiBaseUrl + '/attendance');
  }

  getAttendanceCount(classname: string){
    return this.http.get(environment.apiBaseUrl + `/attendancecount/${classname}`);
  }

  getAllAttendanceCount(){
    return this.http.get(environment.apiBaseUrl + '/allattendancecount');
  }
  
  getClassnamePresentCount(classname: string){
    return this.http.get(environment.apiBaseUrl + `/allattendance/present/${classname}`);
  }

  getClassnameAbsentCount(classname: string){
    return this.http.get(environment.apiBaseUrl + `/allattendance/absent/${classname}`);
  }

  getDateRangeFilter(startdate: string, enddate: string){
    return this.http.get(environment.apiBaseUrl + `/allattendancedatefilter/${startdate}/${enddate}`);
  }

  getAttendanceClassname(classname: string){
    return this.http.get(environment.apiBaseUrl + `/attendance/classname/${classname}`);
  }

  putAttendance(attendance: Attendance){
    return this.http.put(environment.apiBaseUrl+ `/attendance/${attendance._id}`, attendance);
  }

  deleteAttendance(_id: string){
    return this.http.delete(environment.apiBaseUrl + `/attendance/${_id}`);
  }

}
