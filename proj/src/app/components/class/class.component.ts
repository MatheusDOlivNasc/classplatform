import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.scss']
})
export class ClassComponent implements OnInit {
  loading: any | {
    value: boolean,
    text: string
  }
  loadText: any | []
  class: boolean

  constructor(
    private pay: PaymentService,
    private router: Router,
    private auth: AuthService
  ) {
    this.loadText = [
      '',
      $localize`:@@Loading.1.0.0:Loading class`
    ]
    this.loading = {
      value: false,
      text: this.loadText[0]
    }
    this.class = false
  }

  ngOnInit(): void {
    this.checkPayment()  
  }

  checkPayment() {
    let user: any | []
    user = localStorage.getItem('user')
    user = JSON.parse(user)
    this.setLoading(true, this.loadText[1])
    let pay = this.pay.checkStripe(user.uid, user.pay)
      .subscribe(
        (res: any) => {
          if(res.status == "ok") {
            this.classInit()
          } else {
            localStorage.removeItem('user')
            this.setLoading(false)
            this.router.navigate(['login'])          
          }
          pay.unsubscribe()
        },
        (error: any) => {
          localStorage.removeItem('user')
          this.router.navigate(['login']).then(() => {
            setTimeout(()=>{
              window.location.reload()
            }, 1)          
          })
          pay.unsubscribe()
        }
      )
  }

  classInit() {
    this.setLoading(false)
    this.class = true
  }

  setLoading(result: boolean, text?: string) {
    if(result == true) {
      this.loading.value = result
      text ? this.loading.text = text : this.loading.text = this.loadText[0]
    } else {
      this.loading.value = result
      this.loading.text = this.loadText[0]
    }
  }
}
