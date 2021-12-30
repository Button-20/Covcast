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

  noAuthHeader = {headers: new HttpHeaders({'NoAuth' : 'True'})};

  constructor(private http: HttpClient) { }

  postAttendance(attendance: Attendance){
    return this.http.post(environment.apiBaseUrl+'/user/attendance/register', attendance);
  }

  postAttendanceExcel(excel){
    return this.http.post(environment.apiBaseUrl+'/user/attendance/uploadExcel', excel);
  }

  getAttendanceList(){
    return this.http.get(environment.apiBaseUrl + '/user/attendance');
  }

  getAttendanceCount(classname: string){
    return this.http.get(environment.apiBaseUrl + `/user/attendancecount/${classname}`);
  }

  getAllAttendanceCount(){
    return this.http.get(environment.apiBaseUrl + '/user/allattendancecount');
  }

  getDateRangeFilter(startdate: string, enddate: string){
    return this.http.get(environment.apiBaseUrl + `/user/allattendancedatefilter/${startdate}/${enddate}`);
  }

  getAttendanceClassname(classname: string){
    return this.http.get(environment.apiBaseUrl + `/user/attendance/classname/${classname}`);
  }

  putAttendance(attendance: Attendance){
    return this.http.put(environment.apiBaseUrl+ `/user/attendance/${attendance._id}`, attendance);
  }

  deleteAttendance(_id: string){
    return this.http.delete(environment.apiBaseUrl + `/user/attendance/${_id}`);
  }

}
