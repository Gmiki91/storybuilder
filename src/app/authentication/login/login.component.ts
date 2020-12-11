import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }
  login(form:NgForm):void{
    this.authService.login({
      email:form.value.email,
      password: form.value.password
    });
    this.authService.getUserLoggedIn().subscribe(user => {console.log(user)});
  }

}
