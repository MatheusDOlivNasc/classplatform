import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {
  @Input() text: any;

  constructor() {
    !this.text ? this.text = "" : this.text
  }

  ngOnInit(): void {
  }

}
