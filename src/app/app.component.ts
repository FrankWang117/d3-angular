import { Component, ApplicationRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'd3-angular';
  public logoSrc = '';
  constructor(appRef: ApplicationRef) {
    console.log(appRef);
  }
}
