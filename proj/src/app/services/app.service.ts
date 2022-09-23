import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private url: string

  constructor(
    private sanitizer: DomSanitizer,
    private http: HttpClient
  ) {
    this.url = environment.BASE_API;
  }

  sendAlert(user: string) {
    let headers = new HttpHeaders();
    headers = headers.set('content-type', 'application/json');
    let body = {
      user: user
    }
    return this.http.post<any>(this.url + "/send-alert", body, { headers })
  }
  setValidators(validators: any) {
    let validatorsToAdd = []
    let v: any
    for (const [key, value] of Object.entries(validators)) {
      switch (key) {
        case 'min':
          v = value
          validatorsToAdd.push(Validators.min(parseInt(v)));
          break;
        case 'max':
          v = value
          validatorsToAdd.push(Validators.max(v));
          break;
        case 'required':
          if (value == true) {
            validatorsToAdd.push(Validators.required);
          }
          break;
        case 'requiredTrue':
          if (value) {
            validatorsToAdd.push(Validators.requiredTrue);
          }
          break;
        case 'email':
          if (value == true) {
            validatorsToAdd.push(Validators.email);
          }
          break;
        case 'minLength':
          v = value
          validatorsToAdd.push(Validators.minLength(v));
          break;
        case 'maxLength':
          v = value
          validatorsToAdd.push(Validators.maxLength(v));
          break;
        case 'pattern':
          v = value
          validatorsToAdd.push(Validators.pattern(v));
          break;
        case 'nullValidator':
          if (value) {
            validatorsToAdd.push(Validators.nullValidator);
          }
          break;
        default:
          break;
      }
    }
    return validatorsToAdd
  }

  
}
