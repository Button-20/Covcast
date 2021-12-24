import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Plan } from './plan.model';

@Injectable({
  providedIn: 'root'
})
export class PlanService {
  selectedPlan : Plan;
  plan: Plan[];

  constructor(private http: HttpClient) { }

  postSubscription(plan: Plan){
    return this.http.post(environment.apiBaseUrl+'/plan/register', plan)
  }

  getPlanList(){
    return this.http.get(environment.apiBaseUrl +'/plan');
  }

  getPlanById(id: string){
    return this.http.get(environment.apiBaseUrl + `/plan/${id}`);
  }

  getPlanByName(name: string){
    return this.http.get(environment.apiBaseUrl + `/plan/doc/${name}`);
  }

  getPlanCount(){
    return this.http.get(environment.apiBaseUrl + '/allplancount');
  }

  putPlan(plan: Plan){
    return this.http.put(environment.apiBaseUrl + `/plan/${plan._id}`, plan);
  }

  deletePlan(_id: string){
    return this.http.delete(environment.apiBaseUrl + `/plan/${_id}`);
  }


}
