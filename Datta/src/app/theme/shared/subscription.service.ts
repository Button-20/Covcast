import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Subscription } from './subscription.model';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  selectedSubscription : Subscription;
  subscription: Subscription[];

  constructor(private http: HttpClient) { }

  postSubscription(subscription: Subscription){
    return this.http.post(environment.apiBaseUrl+'/subscription/register', subscription)
  }

  getSubscriptionList(){
    return this.http.get(environment.apiBaseUrl +'/user/payment');
  }

  getSubscriptionById(id: string){
    return this.http.get(environment.apiBaseUrl + `/subscription/${id}`);
  }

  getSubscriptionCount(){
    return this.http.get(environment.apiBaseUrl + '/allsubscriptioncount');
  }

  updateSubscription(subscription: Subscription){
    return this.http.put(environment.apiBaseUrl + `/subscription/${subscription._id}`, subscription);
  }

}
