import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { PaymentService } from 'src/app/services/payment.service';
import { environment } from 'src/environments/environment';

declare var Stripe: any

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  user: any
  payment: any
  values: any
  selectedPay: any
  title: string
  currencyList: any = []
  loading: {
    value: boolean,
    text: string
  }
  loadText: any

  constructor(
    private data: FirebaseService,
    private pay: PaymentService,
    private router: Router,
    private auth: AuthService
  ) {
    this.loadText = [
      '',
      $localize`:@@Loading.payment.1:Loading payment method`,
      $localize`:@@Loading.payment.2:Loading payment`,
      $localize`:@@Loading.payment.3:Verify payments`
    ]
    this.loading = {
      value: false,
      text: this.loadText[0]
    }
    this.title = ''
  }

  ngOnInit(): void {
    this.auth.authState().subscribe((res: any) => {
      if (res) {
        let user: any = localStorage.getItem('user')
        this.user = JSON.parse(user)
        this.checkSessions()
        this.title = $localize`:@@Payment.title.1:Choose payment method`
      } else {
        this.loadPayments(true)
        this.title = $localize`:@@Payment.title.2:Payment methods`
      }
    })
  }
  
  loadPayments(values?: boolean) {
    this.setLoading(true, this.loadText[1]);
    let payment = this.data.read('Payment')
    .pipe(map((d: any) => d.filter((p: any) => {
      if(values == true) {
        return p
      } else {
        this.currencyList[this.currencyList.length] = p.currency
        return p
      }
    })))
    .subscribe(
      (res: any) => {
        if(values == true) {
          this.values = res;
        } else {
          this.payment = res;
        }
        this.setLoading(false);
        payment.unsubscribe();
      }
    )
  }

  selectPay(currency: string) {
    this.setLoading(true, this.loadText[2])
    
    let payment = this.pay.checkoutStripe(currency, this.user.uid)
    .subscribe(
      (res: any) => {
        if(res) {
          Stripe(environment.STRIPE_KEY).redirectToCheckout({sessionId: res.session.id})
          .then((result: any)=>{
            result
            payment.unsubscribe()
          })
          .catch((error: any)=>{
            error
            payment.unsubscribe()
          })
        }
      },
      (error: any) => {
        window.alert('erro' + error)
        this.setLoading(false)
        payment.unsubscribe()
      }
    )
  }
  checkSessions() {
    this.setLoading(true, this.loadText[3])
    let pay = this.pay.retrieveStripe(this.user.uid)
    .subscribe(
      (res: any) => {
        let payments = res.sessions
        let check = false
        if (payments[0]) {
          for (let i = 0; i < payments.length; i++) {
            if(payments[i].payment_status == 'paid') {
              check = true
              this.userPayment(payments[i])
            }
            if(check == false && i == payments.length - 1) {
              this.loadPayments()
              pay.unsubscribe()
            }
            if(check == true && i == payments.length - 1) {
              this.setLoading(false);
              pay.unsubscribe();
            }
          }
        } else {
          this.loadPayments()
          pay.unsubscribe()
        }
      },
      (error: any) => {
        console.log('error')
        console.log(error)
        this.setLoading(false)
        pay.unsubscribe()
      }
    )
  }
  userPayment(session: any) {

    let pay = this.pay.paymentStripe(this.user.uid, session.id)
    .subscribe(
      (res: any) => {
        localStorage.removeItem('user')
        localStorage.setItem('user', JSON.stringify(res.result))
        setTimeout(() => {
          this.router.navigate([''])
          pay.unsubscribe()
        }, 10);
      },
      (error: any) => {
        console.log('error')
        console.log(error)
        pay.unsubscribe()
      }
    )
  }
  selectCurrency(currency: any) {
    this.payment.filter(
      (pay: any) => {
        if(pay.currency == currency) {
          this.selectedPay = pay
        }
      }
    )
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
