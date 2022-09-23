import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
/* import { CommonModule } from '@angular/common'; */
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { provideAnalytics,getAnalytics,ScreenTrackingService,UserTrackingService } from '@angular/fire/analytics';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { provideFunctions,getFunctions } from '@angular/fire/functions';
import { provideRemoteConfig,getRemoteConfig } from '@angular/fire/remote-config';
import { provideStorage,getStorage } from '@angular/fire/storage';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';

import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { ClassComponent } from './components/class/class.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { CoreComponent } from './components/core/core.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { ForgotPasswordComponent } from './components/auth/forgot-password/forgot-password.component';
import { PaymentComponent } from './components/payment/payment.component';
import { LoadingComponent } from './components/loading/loading.component';
import { SumaryComponent } from './components/sumary/sumary.component';
import { ContentComponent } from './components/content/content.component';
import { VideoComponent } from './components/video/video.component';
import { CommentsComponent } from './components/comments/comments.component';
import { ProfileComponent } from './components/profile/profile.component';

import { RoutesService } from './services/routes.service';

import { VideoTimePipe } from './components/video/video-time.pipe';

@NgModule({
  declarations: [
    AppComponent,
    ClassComponent,
    HeaderComponent,
    FooterComponent,
    CoreComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    PaymentComponent,
    LoadingComponent,
    SumaryComponent,
    ContentComponent,
    VideoComponent,
    CommentsComponent,
    ProfileComponent,

    VideoTimePipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAnalytics(() => getAnalytics()),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideFunctions(() => getFunctions()),
    provideRemoteConfig(() => getRemoteConfig()),
    provideStorage(() => getStorage()),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,

    FormsModule,
    ReactiveFormsModule,

    HttpClientModule
  ],
  providers: [
    ScreenTrackingService,UserTrackingService,
    RoutesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
