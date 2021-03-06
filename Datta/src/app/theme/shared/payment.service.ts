import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Payment } from './payment.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  selectedPayment : Payment;
  payment: Payment[];

  constructor(private http: HttpClient) { }

  postPayment(payment: Payment){
    return this.http.post(environment.apiBaseUrl+'/payment/register', payment)
  }

  getPaymentsList(){
    return this.http.get(environment.apiBaseUrl+'/payment');
  }

  getPaymentsListByUser(id: string){
    return this.http.get(environment.apiBaseUrl+`/payment/user/${id}`);
  }

  getDateRangeFilter(startdate: string, enddate: string){
    return this.http.get(environment.apiBaseUrl + `/filter/payment/${startdate}/${enddate}`);
  }

  getDailySummary(){
    return this.http.get(environment.apiBaseUrl+'/payments/summary/daily');
  }

  getMonthlySummary(){
    return this.http.get(environment.apiBaseUrl+'/payments/summary/monthly');
  }

  getYearlySummary(){
    return this.http.get(environment.apiBaseUrl+'/payments/summary/yearly');
  }
}
