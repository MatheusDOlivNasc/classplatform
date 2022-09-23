import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  user: any

  constructor(
    private auth: AuthService,
    private data: FirebaseService,
    private router: Router
  ) { }

  ngOnInit(): void {
    let uid = this.auth.authState().subscribe((res: any) => {
      if(res) {
        this.loadUser(res.uid)
        uid.unsubscribe()
      }
    })
  }

  loadUser(uid: string) {
    const search = { 'search': { 'data': 'uid', 'value': uid } }
    const user = this.data.read(this.auth.module, search)
      .subscribe((res: any) => {
        if (res[0]) {
          this.user = res[0];
        } else {
          this.logout();
        }
        user.unsubscribe()
      })
  }

  logout() {
    this.auth.logout()
    localStorage.removeItem('user')
    
    this.router.navigate(['login'])
      .then((res: any) => {
        this.user = undefined
        this.ngOnInit()
      })
  }
}
