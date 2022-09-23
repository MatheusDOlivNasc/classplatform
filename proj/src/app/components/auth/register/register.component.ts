import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  hide: Boolean;
  error: any;

  formRegister: FormGroup

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private data: FirebaseService,
    private router: Router,
  ) {
    this.formRegister = formBuilder.group({
      id: [''],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      name: ['', Validators.compose([Validators.required])],
      lastname: ['', Validators.compose([Validators.required])],
      displayname: [''],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(15)])],
      admin: [false],
      alert: [false],
      uid: [""],
    })
    this.hide = true;
    this.error = {
      value: false,
      text: ''
    }
  }

  ngOnInit(): void {}
  
  register() {
    if (this.formRegister.valid) {
      let user = this.formRegister.value
      this.auth.register(user)
        .then((res: any) => {
          res.user.uid ? user.uid = res.user.uid : user.uid = ""
          user.displayname = user.name + " " + user.lastname
          delete user.password
          this.data.save(this.auth.module, user)
            .then((res: any) => {
              this.formRegister.reset()
              this.router.navigate(['/login']).then(()=> {
                setTimeout(()=>{
                  window.location.reload()
                }, 1)
              })
            })
            .catch((error: any) => {
              if (this.auth.language == 'pt-BR') this.errors(("Erro: " + error))
              else this.errors(("Error: " + error.code))
            })
        })
        .catch((error: any) => {
          let desc = error.code
          if (this.auth.language == 'pt-BR') {
            switch (desc) {
              case 'auth/email-already-in-use':
                this.errors(("Erro: e-mail já foi usado por outro usuário"));
                break;
              case 'auth/invalid-email':
                this.errors(("Erro: e-mail inválido"));
                break;
              case 'auth/operation-not-allowed':
                this.errors(("Erro: e-mail e senha não permitidos"));
                break;
              case 'auth/weak-password':
                this.errors(("Erro: senha fraca"));
                break;
              default:
                this.errors(("Erro: " + desc));
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
