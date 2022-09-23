import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  formLogin: FormGroup;
  hide: boolean;
  error: any;

  constructor(
    private auth: AuthService,
    private data: FirebaseService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.formLogin = formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(15)])],
    })
    this.hide = true;
    this.error = {
      value: true,
      text: ''
    }
  }

  ngOnInit(): void {}

  login() {
    if(this.formLogin.valid) {
      this.auth.login(this.formLogin.value)
      .then((user)=>{
        this.router.navigateByUrl('', {skipLocationChange: true})
          .then(() => {
            let user = this.data.setUser(this.formLogin.value.email).subscribe(
              (res: any)=>{
                if(res[0]) {
                  this.formLogin.reset();
                  console.log(res[0])
                  localStorage.setItem('user', JSON.stringify(res[0]))
                  this.router.navigate(['/c'])
                }
                user.unsubscribe()
              }
            )
          })
          /* .catch(() => {
            let user = this.data.setUser(this.formLogin.value.email).subscribe(
              (res: any)=>{
                if(res[0]) {
                  this.formLogin.reset();
                  localStorage.setItem('user', JSON.stringify(res[0]))
                  this.router.navigate(['/class'])
                }
                user.unsubscribe()
              }
            )
          }) */
      })
      .catch((error)=>{
        let desc = error.code
        if(this.auth.language == 'pt-BR') {
          switch(desc) {
            case 'auth/invalid-email': 
              this.errors(("Erro: e-mail inválido"));
              break;
            case 'auth/user-disabled': 
              this.errors(("Erro: usuário desativado"));
              break;
            case 'auth/user-not-found': 
              this.errors(("Erro: usuário não encontrado"));
              break;
            case 'auth/wrong-password': 
              this.errors(("Erro: senha incorreta"));
              break;
            default:
              this.errors(("Erro: " + error));
              break
          }
        } else {
          this.errors(("Error: " + desc));
        }
      })
    }
  }

  errors(text: string) {
    this.error.value = true;
    this.error.text = text;
    setTimeout(() => {
      this.error.value = false;
      this.error.text = '';
    }, 4000)
  }
}
