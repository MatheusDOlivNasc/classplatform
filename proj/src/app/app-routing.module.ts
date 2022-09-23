import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotPasswordComponent } from './components/auth/forgot-password/forgot-password.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { ClassComponent } from './components/class/class.component';
import { CommentsComponent } from './components/comments/comments.component';
import { ContentComponent } from './components/content/content.component';
import { CoreComponent } from './components/core/core.component';
import { PaymentComponent } from './components/payment/payment.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SumaryComponent } from './components/sumary/sumary.component';
import { RoutesService } from './services/routes.service';

const routes: Routes = [
  {path: '', redirectTo: 'class', pathMatch: 'full'},
  {
    path: '',
    component: CoreComponent,
    children: [
      { 
        path: 'c',
        component: ClassComponent,
        canActivate: [RoutesService],
        children: [
          {path: '', component: SumaryComponent},
          {path: 'content/:url', component: ContentComponent},
          {path: 'comments', component: CommentsComponent},
          {path: 'profile', component: ProfileComponent},
          {path: '**', redirectTo: '', pathMatch: 'full'}
        ]
      },
      {
        path: 'login',
        component: LoginComponent,
        canActivate: [RoutesService]
      },
      {
        path: 'register',
        component: RegisterComponent,
        canActivate: [RoutesService]
      },
      {
        path: 'forgotpassword',
        component: ForgotPasswordComponent,
        canActivate: [RoutesService]
      },
      {
        path: 'payment',
        component: PaymentComponent
      },
      {
        path: '**',
        redirectTo: 'c',
        pathMatch: 'full'
      }
    ]
  }/* ,
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  } */
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
