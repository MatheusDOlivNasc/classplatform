import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { parse } from 'path';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/auth.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ClassComponent } from '../class/class.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profile: any | {
    group: FormGroup,
    controls: any
  }
  password: any | {
    group: FormGroup,
    controls: any
  }
  user: any
  controls: any

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private app: AppService,
    private classes: ClassComponent,
    private data: FirebaseService
  ) {
    this.profile = {
      group: fb.group({}),
      controls: [
        {
          name: 'id',
          value: '',
          type: 'text',
          input: false,
          hide: false,
          validators: {
            required: false
          }
        },
        {
          name: 'email',
          label: 'E-mail: ',
          value: '',
          type: 'email',
          input: true,
          hide: false,
          validators: {
            required: true,
            email: true
          }
        },
        {
          name: 'name',
          label: $localize`:@@Profile.name:Name: `,
          value: '',
          type: 'text',
          input: true,
          hide: false,
          validators: {
            required: true
          }
        },
        {
          name: 'lastname',
          label: $localize`:@@Profile.lastname:Lastname: `,
          value: '',
          type: 'text',
          input: true,
          hide: false,
          validators: {
            required: true
          }
        },
        {
          name: 'displayname',
          value: '',
          type: 'text',
          input: false,
          hide: false,
          validators: {
            required: false
          }
        }
      ]
    }
    this.password = {
      group: fb.group({}),
      controls: [
        {
          name: 'password',
          label: $localize`:@@Profile.newpassword:New password: `,
          value: '',
          type: 'password',
          input: true,
          hide: true,
          autocomplete: 'new-password',
          validators: {
            required: true
          }
        },
        {
          name: 'repassword',
          label: $localize`:@@Profile.rewrite:Rewrite: `,
          value: '',
          type: 'password',
          input: true,
          hide: true,
          autocomplete: 'new-password',
          validators: {
            required: true
          }
        }
      ]
    }
  }

  ngOnInit(): void {
    let user: any = localStorage.getItem('user') 
    this.user = JSON.parse(user)

    for (const control of this.profile.controls) {
      let validatorsToAdd = this.app.setValidators(control.validators);

      this.profile.group.addControl(
        control.name,
        this.fb.control(control.value, validatorsToAdd)
      );
    }

    for (const control of this.password.controls) {
      let validatorsToAdd = this.app.setValidators(control.validators);

      this.password.group.addControl(
        control.name,
        this.fb.control(control.value, validatorsToAdd)
      );
    }

    this.setValue(this.profile.group, this.user);
  }
  setValue(form: any, user: any) {
    for (const [key, value] of Object.entries(user)) {
      form.patchValue({[key]: value})
    }
  }
  setControls(controls: any) {
    return controls.filter((item: any) => {
      if (item.input == true) {
        return item
      }
    })
  }
  updateEmail(email: string) {
    this.classes.setLoading(true, $localize`:@@Profile.loading.1:Changing name`)
    return this.auth.updateEmail(this.user.uid, email)
  }

  updatePassword() {
    if(!this.password.group.invalid &&
      this.password.group.value.password == this.password.group.value.repassword) {
      this.classes.setLoading(true, $localize`:@@Profile.loading.2:Changing password`)
      let password = this.auth.updatePassword(this.user.uid, this.password.group.value.password)
        .subscribe((res: any) => {
          this.password.group.reset()
          this.classes.setLoading(false)
          password.unsubscribe()
        }, (error: any) => {
          this.password.group.reset()
          this.classes.setLoading(false)
          password.unsubscribe()
        })
    }
  }
  updateProfile() {
    if(!this.profile.group.invalid) {
      this.classes.setLoading(true, $localize`:@@Profile.loading.3:Updating profile`)
      this.user.name = this.profile.group.value.name
      this.user.lastname = this.profile.group.value.lastname
      this.user.displayname = this.user.name + ' ' + this.user.lastname
      
      this.data.save('User', this.user)
        .then((res: any) => {
          localStorage.setItem('user', JSON.stringify(this.user))

          if(this.user.email != this.profile.group.value.email) {
            this.classes.setLoading(true, $localize`:@@Profile.loading.4:Updanting email`)
            console.log(this.profile.group.value.email)
            let email = this.updateEmail(this.profile.group.value.email)
              .subscribe((res: any) => {
                this.user.email = this.profile.group.value.email
                localStorage.setItem('user', JSON.stringify(this.user))
                this.classes.setLoading(false)
                window.location.reload()
                email.unsubscribe()
              }, (error: any) => {
                console.log(error)
                this.classes.setLoading(true, 'Error')
                this.classes.setLoading(false)
                email.unsubscribe()
              })
            
            setTimeout(()=>{
              this.ngOnInit()
              this.classes.setLoading(false)
            }, 1000)
          } else {
            this.ngOnInit()
            this.classes.setLoading(false)
          }
        })
        .catch((error: any) => {
          this.classes.setLoading(true, 'Error')
          setTimeout(()=>{
            this.ngOnInit()
            this.classes.setLoading(false)
          }, 1000)
        })
    }
  }
}
