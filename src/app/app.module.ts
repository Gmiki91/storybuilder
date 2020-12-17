import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
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

@NgModule({
  declarations: [
    AppComponent,
    StoryboardComponent,
    SignupComponent,
    LoginComponent,
    PageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule 
  ],
  providers: [StoryService, PageService, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
