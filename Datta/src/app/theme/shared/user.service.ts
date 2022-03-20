import { Injectable } from '@angular/core';
import { User } from "./user.model";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public isOnline: boolean = false;

  users: User[];
  selectedUser : User;

  
  noAuthHeader = {headers: new HttpHeaders({'NoAuth' : 'True'})};
  
  constructor(private http: HttpClient, private router: Router) { }
  
  
  // Actions that can be done to user
  login(authCredentials){
    return this.http.post(environment.apiBaseUrl + '/authenticate', authCredentials, this.noAuthHeader);
  }

  resetPassword(email){
    return this.http.get(environment.apiBaseUrl + `/reset-password/${email}`, this.noAuthHeader);
  }

  confirmNewPassword(token: string, passwordForm){
    return this.http.post(environment.apiBaseUrl + `/password-reset/confirm/${token}`, passwordForm, this.noAuthHeader);
  }

  postUser(user: User){
    return this.http.post(environment.apiBaseUrl + '/register', user);
  }

  getUserList(){
    return this.http.get(environment.apiBaseUrl + '/users');
  }
  
  getUserByID(_id: string){
    return this.http.get(environment.apiBaseUrl + `/users/${_id}`);
  }
  
  putUser(user: User){
    return this.http.put(environment.apiBaseUrl + `/users/${user._id}`, user);
  }

  putUserLoginPermission(user: User){
    return this.http.put(environment.apiBaseUrl + `/userspermission/${user._id}`, user);
  }
  
  deleteUser(_id: string){
    return this.http.delete(environment.apiBaseUrl + `/users/${_id}`);
  }
  

  // End of Actions
  
  getToken(){
    return localStorage.getItem('token');
  }

  setToken(token: string){
    localStorage.setItem('token', token);
  }

  deleteToken(){
    localStorage.removeItem('token');
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

  isLoggedIn(){
    var userPayload = this.getUserPayload();
    if(userPayload)
      return userPayload.exp > Date.now() / 1000;
    else
      return false;
  }
}

// async login(authCredentials){
//   return await new Promise(async (resolve, reject) => {
//     try {
//       const resp: any = await this.http.post(environment.apiBaseUrl + '/authenticate', authCredentials, this.noAuthHeader);
//       if (resp.error) throw new Error(resp.error || resp);

//       // console.log(resp)
//       resolve(resp)
//     } catch (ex: any) {
//         console.log(ex)
//         reject({ error: ex.error || ex.message || ex })
//     }
//   })
// }
