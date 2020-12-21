import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'storybuilder';
  loggedIn:boolean;

  constructor(private router: Router, private authService: AuthService) {
    this.authService.getUserLoggedIn().subscribe(user => {this.loggedIn=true})
  }
}
