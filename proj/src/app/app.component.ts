import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AppService } from './services/app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Claudia Giuberti';

  constructor(
    private titleService: Title
  ) {
    titleService.setTitle(this.title)
  }

}
