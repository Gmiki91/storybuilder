import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  onSignUp(form: NgForm): void {
    this.authService.createUser({
      email: form.value.email,
      password: form.value.password,
      name:form.value.name,
      points: 0,
      storyId:null,
      votedFor: [''],
      unlocked:[''],
      favorite:[''],
      routeAdvised:['']
    });
  }
}
