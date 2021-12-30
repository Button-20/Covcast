import { HttpHeaders } from '@angular/common/http';
import { Members } from './members.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Sms } from './sms.model';


@Injectable({
  providedIn: 'root'
})
export class MembersService {

  selectedMember : Members;
  members: Members[];
  Count: any;
  maleCount: any;
  femaleCount: any;

  // noAuthHeader = {headers: new HttpHeaders({'NoAuth' : 'True'})};

  constructor(private http: HttpClient) { }

  postMember(member: Members){
    return this.http.post(environment.apiBaseUrl+'/user/members/register', member);
  }

  postMemberExcel(excel){
    return this.http.post(environment.apiBaseUrl+'/user/members/uploadExcel', excel);
  }

  getMembersList(){
    return this.http.get(environment.apiBaseUrl+'/user/members');
  }

  getAllMembersCount(){
    return this.http.get(environment.apiBaseUrl + '/user/memberscountall');
  }

  getAllMaleCount(){
    return this.http.get(environment.apiBaseUrl+'/user/malememberscountall');
  }
  
  getAllFemaleCount(){
    return this.http.get(environment.apiBaseUrl + '/user/femalememberscountall');
  }

  getMembersCount(classname: string){
    return this.http.get(environment.apiBaseUrl + `/user/memberscount/${classname}`);
  }

  getMembersMaleCount(classname: string){
    return this.http.get(environment.apiBaseUrl + `/user/malemembers/${classname}`);
  }

  getMembersFemaleCount(classname: string){
    return this.http.get(environment.apiBaseUrl + `/user/femalemembers/${classname}`);
  }

  getMembersClassname(classname: string){
    return this.http.get(environment.apiBaseUrl + `/user/members/classname/${classname}`);
  }

  putMember(mem: Members){
    return this.http.put(environment.apiBaseUrl+ `/user/members/${mem._id}`, mem);
  }

  deleteMember(_id: string){
    return this.http.delete(environment.apiBaseUrl + `/user/members/${_id}`);
  }

  postSms(sms: Sms){
    return this.http.post(environment.apiBaseUrl + `/user/members/sms`, sms);
  }


  getToken(){
    return localStorage.getItem('token');
  }

  getUserPayload(){
    var token = this.getToken();
    if(token){
      var userPayload = atob(token.split('.')[1]);
      return JSON.parse(userPayload);
    }
    else
      return null;
  }
}
