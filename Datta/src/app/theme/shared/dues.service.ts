import { DuesTotal } from './duesTotal.model';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Dues } from './dues.model';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DuesService {

  selectedDues : Dues;
  dues: Dues[];
  Total = 0;

  // noAuthHeader = {headers: new HttpHeaders({'NoAuth' : 'True'})};

  constructor(private http: HttpClient) { }

  postDues(dues: Dues){
    return this.http.post(environment.apiBaseUrl+'/user/dues/register', dues);
  }

  postDuesExcel(excel){
    return this.http.post(environment.apiBaseUrl+'/user/dues/uploadExcel', excel);
  }

  getDuesList(){
    return this.http.get(environment.apiBaseUrl+'/user/dues');
  }

  getDuesCount(){
    return this.http.get(environment.apiBaseUrl + '/user/duescount');
  }

  getDateRangeFilter(startdate: string, enddate: string){
    return this.http.get(environment.apiBaseUrl + `/user/alldatafilter/${startdate}/${enddate}`);
  }

  getTotalDues(classname: string){
    return this.http.get(environment.apiBaseUrl + `/user/dues/total/${classname}`);
  }
  
  getDuesWithClassName(classname: string){
    return this.http.get(environment.apiBaseUrl + `/user/dues/classname/${classname}`);
  }
  
  getAllTotalDues(){
    return this.http.get(environment.apiBaseUrl + '/user/duesalltotal');
  }

  putDues(dues: Dues){
    return this.http.put(environment.apiBaseUrl+ `/user/dues/${dues._id}`, dues);
  }

  deleteDues(_id: string){
    return this.http.delete(environment.apiBaseUrl + `/user/dues/${_id}`);
  }

}
