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
      { value: "A1", desc: "A1 (300-600 words)" },
      { value: "A2", desc: "A2 (600-1200 words)" },
      { value: "B1", desc: "B1 (1200-2500 words)" },
      { value: "B2", desc: "B2 (2500-5000 words)" },
      { value: "C1", desc: "C1 (5000-10000 words)" },
      { value: "C2", desc: "C2 (10000-20000 words)" },
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
