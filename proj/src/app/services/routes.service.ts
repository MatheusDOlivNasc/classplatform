import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class RoutesService implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
    ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.auth.authState().pipe(map((res: any) => {
      let user: any = localStorage.getItem('user')
      user = JSON.parse(user)
      switch (route.url[0].path) {
        case 'c':
          if(!res || !user) {
            this.router.navigate(['/login'])
            return false
          } else if (!user.pay) {
            this.router.navigate(['/payment'])
            return false
          }
          break
        case 'login':
        case 'register': 
        case 'forgotpassword':
          if(res && user) {
            this.router.navigate(['/c']);
            return false
          } else {
            this.auth.logout();
            localStorage.removeItem('user');
          }
          break          
      }
      return true
    }))
  }
}