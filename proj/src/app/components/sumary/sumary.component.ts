import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-sumary',
  templateUrl: './sumary.component.html',
  styleUrls: ['./sumary.component.scss']
})
export class SumaryComponent implements OnInit {
  public modules: any
  private classes: any

  @Input() select: any;

  constructor(
    private data: FirebaseService,
    private auth: AuthService
  ) {
    this.modules = []
    this.classes = []
    !this.select ? this.select = '' : this.select
  }

  ngOnInit(): void {
    let classes = this.data.read("Class", {'order': 'order'})
      .subscribe((res: any) => {
        this.classes = res
        classes.unsubscribe()
      })
    let modules = this.data.read("Modules", {
      'order': 'order', 
      'search': {
        'data': 'language',
        'value': this.auth.language
      }
    })
      .subscribe((res: any) => {
        this.setModules(res)
        modules.unsubscribe()
      })
  }

  setModules(modules: any) {
    for (let i = 0; i < modules.length; i++) {
      modules[i].classes = this.getClasses(modules[i].id)
    }
    this.modules = modules
  }

  getClasses(moduleId: string) {
    return this.classes.filter((c: any) => {
      if (c.module == moduleId) {
        return c
      }
    })
  }
}
