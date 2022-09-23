import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  url: string;

  constructor(
    private http: HttpClient
  ) {
    this.url = environment.BASE_API;
  }

  checkoutStripe(currency: string, uid: string) {
    let headers = new HttpHeaders();
    headers = headers.set('content-type', 'application/json');
    let body = {
      currency: currency,
      uid: uid
    }
    return this.http.post<any>(this.url + "/stripe-checkout", body, {headers})
  }
  retrieveStripe(uid: string) {
    let headers = new HttpHeaders();
    headers = headers.set('content-type', 'application/json');
    let body = {
      uid: uid
    }
    return this.http.post<any>(this.url + "/stripe-retrive", body, {headers})
  }
  paymentStripe(uid: string, session: string) {
    let headers = new HttpHeaders();
    headers = headers.set('content-type', 'application/json');
    let body = {
      uid: uid,
      session: session
    }
    return this.http.post<any>(this.url + "/stripe-payment", body, {headers})
  }
  checkStripe(uid: string, session: string) {
    let headers = new HttpHeaders();
    headers = headers.set('content-type', 'application/json');
    let body = {
      uid: uid,
      session: session
    }
    return this.http.post<any>(this.url + "/stripe-check", body, {headers})
  }
}
