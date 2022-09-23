import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {
  response: any
  comments: any
  classes: any | []
  formComment: FormGroup

  @Input() select: any;

  constructor(
    private fb: FormBuilder,
    private data: FirebaseService,
    private app: AppService,
    private router: Router
  ) {
    this.formComment = fb.group({
      comment: ['', [Validators.required, Validators.minLength(3)]]
    })
    this.response = {}
  }

  ngOnInit(): void {
    let search
    
    if (this.select) {
      search = { order: 'date', search: { 'data': 'class', 'value': this.select } }
    } else {
      search = { order: 'date' }
      let classes = this.data.read('Class', {order: 'order'})
        .subscribe((res: any) => {
          this.classes = res
          classes.unsubscribe()
        })
      this.removeAlert()
    }
    let comments = this.data.read('Comments', search)
      .subscribe((res: any) => {
        if(this.select) {
          this.comments = [
            {comments: this.getResponses(this.initComments(res), res)}
          ]
          comments.unsubscribe();
        } else {
          this.comments = this.setClasses(this.getResponses(this.getComments(res), res))
          comments.unsubscribe();
        }
      })
  }
  initComments(comments: any) {
    return comments.filter((res: any) => {
      if (!res.response) return res
    })
  }
  getComments(comments: any) {
    let user: any | {} = localStorage.getItem('user')
    user = JSON.parse(user)
    let comment = []
    let responses: any = comments.filter((res: any) => {
      if (res.response && res.user == user.id) {
        return res
      }
    })
    for (let i = 0; i < comments.length; i++) {
      if (
        !comments[i].response &&
        (comments[i].user == user.id || 
        responses.find((e: any) => e.response == comments[i].id))
        ) {
        comment[comment.length] = comments[i]
        comment[comment.length - 1].classes = comments[i].class
      }
    }
    return comment
  }
  getResponses(comments: any, responses: any) {
    let complete: any | {}
    complete = comments
    for (let i = 0; i < complete.length; i++) {
      complete[i].responses = responses.filter(
        (c: any) => {
          if (complete[i].id == c.response) {
            return c
          }
        }
      )
    }
    return complete
  }
  setResponse(id?: string, user?: string, name?: string, classroom?: string) {
    if (id || user || name || classroom) {
      this.response = {
        id: id,
        user: user,
        name: name,
        class: classroom
      }
    } else {
      this.response = {}
    }
  }
  setClasses(comments: any) {
    let classes: any = []
    for (let i = 0; i < this.classes.length; i++) {
      if(comments.find((e: any) => e.classes == this.classes[i].id)) {
        this.classes[i].comments = comments.filter((c: any) => {
          if (c.classes == this.classes[i].id) {
            return c
          }
        })
        classes[classes.length] = this.classes[i]
      } 
    }
    return classes
  }

  send() {
    if (!this.formComment.invalid && this.select) {
      let user: any = localStorage.getItem('user')
      user = JSON.parse(user)
      let comment = {
        id: '',
        user: user.id,
        name: user.displayname,
        class: this.select ? this.select : this.response.class ? this.response.class : '',
        comment: this.formComment.value.comment,
        response: this.response.id ? this.response.id : '',
        date: Date.now()
      }
      if (this.response.user) {
        this.app.sendAlert(this.response.user)
      }

      this.data.save('Comments', comment)
        .then((res: any) => {
          this.ngOnInit()
          this.setResponse()
          this.formComment.reset()
        })
        .catch((res: any) => {
          this.ngOnInit()
        })
    }
  }
  removeAlert() {
    let user: any = localStorage.getItem('user')
    user = JSON.parse(user)
    let alert = this.data.read('User', {
      'search': {'data': 'uid', 'value': user.uid}
    }).subscribe((res: any) => {
      if(res[0]) {
        if(res[0].alert == true) {
          let save = res[0]
          save.alert = false
          this.data.save('User', save)
          setTimeout(()=>{
            window.location.reload()
            alert.unsubscribe()
          }, 100)
          
        } else {
          alert.unsubscribe()
        }
      } else {
        alert.unsubscribe()
      }
    })
  }
}
