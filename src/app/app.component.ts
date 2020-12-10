import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'storybuilder';
  loggedIn:boolean;

  constructor(private router: Router) {}

  einloggen():void{
    this.loggedIn = true;
    this.router.navigate(['storyboard']);

  }
}
