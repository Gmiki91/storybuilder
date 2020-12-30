import { Component, OnInit } from '@angular/core';

import { Story } from '../models/story.model';
import { StoryService } from '../services/story.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Language } from '../models/language.enum';

@Component({
  selector: 'app-storyboard',
  templateUrl: './storyboard.component.html',
  styleUrls: ['./storyboard.component.css']
})
export class StoryboardComponent implements OnInit {
  languages: string[];
  levels:Object[];
  levelf;
  languagef;
  storySubscription: Subscription = Subscription.EMPTY;
  story: Story;
  stories: Story[][];
  noStory: boolean;

  constructor(private storyService: StoryService, private router: Router) { }

  ngOnInit(): void {
    this.languages = Object.values(Language);
    this.levels = [
      { value: "A", desc: "Beginner" },
      { value: "B", desc: "Intermediate" },
      { value: "C", desc: "Fluent" },
    ]
    this.storyService.pushStories();
    this.subscribeToStories();

  }

  levelFilterChanged(event) {
    console.log(event);
  }

  languageFilterChanged(event) {
    console.log(event);
  }

  onClick(story: Story): void {
    this.router.navigate([story.title.toLowerCase() + "/1"]);
  }


  private subscribeToStories(): void {
    if (this.storySubscription)
      this.storySubscription.unsubscribe();

    this.storySubscription = this.storyService.getStories()
      .subscribe((result) => {
        if (result.length != 0) {
          this.stories = result;
          this.noStory = false;
        } else {
          this.noStory = true;
        }
      })
  }
}
