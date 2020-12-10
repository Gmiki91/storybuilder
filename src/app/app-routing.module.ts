import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StoryboardComponent } from './storyboard/storyboard.component';

const routes: Routes = [{
  path: 'storyboard', component: StoryboardComponent
},];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
