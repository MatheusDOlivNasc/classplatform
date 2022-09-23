import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  formEmail: FormGroup;
  error: any;
  sendEmail: any;

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
  ) {
    this.formEmail = formBuilder.group({
      email: ['', Validators.required]
    })
    this.error = {
      value: false,
      text: '',
    }
    this.sendEmail = false
  }

  ngOnInit(): void {}

  send() {
    if (this.formEmail.valid) {
      this.auth.resetPassword(this.formEmail.value.email)
        .then((user) => {
          this.sendEmail = true
        })
        .catch((error) => {
          let desc = error.code
          if (this.auth.language == 'pt-BR') {
            switch (desc) {
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
