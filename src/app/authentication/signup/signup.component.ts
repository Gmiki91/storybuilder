import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Language } from 'src/app/models/language.enum';
import { Proficiency } from 'src/app/models/proficiency.enum';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  addLanguage: boolean;
  languages: string[];
  proficiencies: string[];
  userLanguages: [Object] = [{}];
  languageAddedToList: boolean;
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.languages = Object.values(Language);
    this.proficiencies = Object.keys(Proficiency);
  }

  onSignUp(form: NgForm): void {
    this.authService.createUser({
      email: form.value.email,
      password: form.value.password,
      languages: this.userLanguages,
      points: 0,
      votedFor: null
    });
  }

  onAddLanguage(form: NgForm): void {
    console.log(form.value);
    this.userLanguages.push(form.value);
    if (!this.languageAddedToList)
      this.userLanguages.shift();
    this.languageAddedToList = true;
    this.addLanguage = false;
  }
  onAddNewLanguage(): void {
    this.addLanguage = true;
  }
  onCancelLanguage(): void {
    this.addLanguage = false;
  }
}
