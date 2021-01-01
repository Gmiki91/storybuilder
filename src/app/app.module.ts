import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoryboardComponent } from './storyboard/storyboard.component';
import { StoryService } from './services/story.service';
import { SignupComponent } from './authentication/signup/signup.component';
import { LoginComponent } from './authentication/login/login.component';
import { AuthService } from './services/auth.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PageComponent } from './storyboard/page/page.component';
import { PageService } from './services/page.service';
import { StownryComponent } from './stownry/stownry.component';


@NgModule({
  declarations: [
    AppComponent,
    StoryboardComponent,
    SignupComponent,
    LoginComponent,
    PageComponent,
    StownryComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule ,
    MatChipsModule,
    MatIconModule,
    MatCheckboxModule,
    MatRadioModule
  ],
  providers: [StoryService, PageService, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
