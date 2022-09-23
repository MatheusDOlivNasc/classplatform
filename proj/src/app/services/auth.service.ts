import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import * as auth from 'firebase/auth';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public module: string
  private url: string
  public language: string

  constructor(
    private afa: AngularFireAuth,
    private http: HttpClient
  ) {
    this.module = "User";
    this.url = environment.BASE_API;
    this.language = $localize`:@@Language:en-US`
  }

  login(login: any) {
    return this.afa.signInWithEmailAndPassword(login.email, login.password)
  }
  logout() {
    return this.afa.signOut()
  }
  register(usuario: any) {
    return this.afa.createUserWithEmailAndPassword(usuario.email, usuario.password)
  }
  resetPassword(email: string) {
    /* this.afa.applyActionCode('')
    var actionCodeSettings = {
      url: 'localhost:4205/redefinirsenha?email=' + email + '?token=' + token,
      handleCodeInApp: true
    }; */
    return this.afa.sendPasswordResetEmail(email)
  }
  authState() {
    return this.afa.authState
  }
  getUserUid() {
    const userData = auth.getAuth()
    if(userData.currentUser) {
      return userData.currentUser.uid
    } else {
      return 'nolog'
    }
  }
  updateEmail(uid: string, email: string) {
    let headers = new HttpHeaders();
    headers = headers.set('content-type', 'application/json');
    let body = {
      uid: uid,
      email: email
    }
    return this.http.post<any>(this.url + "/update-email", body, {headers})
  }
  updatePassword(uid: string, password: any) {
    let headers = new HttpHeaders();
    headers = headers.set('content-type', 'application/json');
    let body = {
      uid: uid,
      password: password
    }
    return this.http.post<any>(this.url + "/update-password", body, {headers})
  }
}
