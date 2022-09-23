import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { map } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {
  class: any
  baseRef: string
  file: any
  extension: string
  options: string

  constructor(
    private route: ActivatedRoute,
    private data: FirebaseService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {
    this.baseRef = 'files/'
    this.extension = ''
    this.options = 'classlist'
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((param: ParamMap) => {
      let id = param.get('url')
      this.getClass(id)
    })
  }

  getClass(id: any) {
    let classes = this.data.read('Class')
      .pipe(map((d: any) => {
        d.filter((c: any) => {
          if (c.id == id) {
            this.class = c
            this.extension = c.file.split('.').pop()
            let file = this.data.getImage(this.baseRef + c.file).subscribe(
              (res: any) => {
                this.file = res
                file.unsubscribe()
              }
            )
            return c
          }
        })
      }))
      .subscribe((res: any) => {
        if(!this.class) {
          this.router.navigate(['**'])
        }
        classes.unsubscribe()
      })


  }

  getPDF(url: any) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url + '#toolbar=0')
  }
}
