import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './authentication/login/login.component';
import { SignupComponent } from './authentication/signup/signup.component';
import { PageComponent } from './storyboard/page/page.component';
import { StoryboardComponent } from './storyboard/storyboard.component';
import { StownryComponent } from './stownry/stownry.component';

const routes: Routes = [
  {path: 'storyboard', component: StoryboardComponent},
  {path:'stownry', component:StownryComponent},
  {path: ':story/:page', component: PageComponent},
  {path:'signup', component: SignupComponent},
  {path:'login', component: LoginComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
