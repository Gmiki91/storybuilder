import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { first } from 'rxjs/operators'
import { Story } from '../models/story.model';
import { StoryService } from '../services/story.service';
import { DateTime } from "luxon";
import { Language } from '../models/language.enum';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { PageService } from '../services/page.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-storyboard',
  templateUrl: './storyboard.component.html',
  styleUrls: ['./storyboard.component.css']
})
export class StoryboardComponent implements OnInit {

  storySubscription: Subscription = Subscription.EMPTY;
  story: Story;
  stories: Story[][];
  noStory: boolean;
  newStory: boolean;
  languages: string[];
  levels;
  constructor(private storyService: StoryService, private pageService: PageService, private router: Router, private authService: AuthService) { }

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

  onClick(story: Story): void {
    this.router.navigate([story.title + "/1"])
  }

  onNewStory(): void {
    this.newStory = true;
  }

  async onSubmit(form: NgForm) {
    let titles = await this.storyService.getAllStoryTitles().pipe(first()).toPromise();
    if (titles.indexOf(form.value.title) > -1) {
      console.log("title taken");
    } else {
      this.pageService.addPage({
        "_id": form.value.title + "1",
        "content": null
      });
      this.storyService.addStory({
        "title": form.value.title,
        "level": form.value.level,
        "pages": null,
        "language": form.value.language,
        "lastUpdated": new Date(),
        "popularity": 0
      });

      this.newStory = false;
    }
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
