import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { first } from 'rxjs/operators'
import { Story } from '../models/story.model';
import { StoryService } from '../services/story.service';
import { DateTime } from "luxon";
import { Language } from '../models/language.enum';
import { Proficiency } from '../models/proficiency.enum';

@Component({
  selector: 'app-storyboard',
  templateUrl: './storyboard.component.html',
  styleUrls: ['./storyboard.component.css']
})
export class StoryboardComponent implements OnInit {

  story: Story;
  stories: Story[][];
  noStory: boolean;
  languages:string[];
  proficiencies:string[];
  constructor(private storyService: StoryService) { }

  ngOnInit(): void {
    this.languages=Object.values(Language);
    this.proficiencies=Object.keys(Proficiency);
    this.getStories();

  }

  onClick(story: Story): void {
    console.log(story.title);
  }

  async onSubmit(form: NgForm) {
    let titles = await this.storyService.getAllStoryTitles().pipe(first()).toPromise();
    if (titles.indexOf(form.value.title) > -1) {
      console.log("title taken");
    } else {
      this.storyService.addStory({
        "title": form.value.title,
        "level": form.value.level,
        "language": form.value.language,
        "lastUpdated":new Date(),
        "popularity":0
      });
      this.getStories();
    }
  }

  private getStories(): void {
    this.storyService.getStories().subscribe((result) => {
      if (result.length != 0) {
        this.stories = result;
        this.noStory = false;
      } else {
        this.noStory = true;
      }
    })
  }
}