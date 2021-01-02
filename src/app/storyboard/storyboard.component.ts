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
  languagefList: string[];
  languagef;
  levels: string[];
  levelfList: string[];
  storySubscription: Subscription = Subscription.EMPTY;
  story: Story;
  stories: Story[];
  filteredStories: Story[];
  noStory: boolean;

  constructor(private storyService: StoryService, private router: Router) { }

  ngOnInit(): void {
    this.languages = Object.values(Language);
    this.languagefList = [];
    this.levelfList = [];
    this.levels = [
      "Beginner",
      "Intermediate",
      "Fluent",
    ];
    this.storyService.pushStories();
    this.subscribeToStories();
  }

  sortBy(button){
    if(button.value=="popularity")
    this.filteredStories.sort((a,b)=>(a.popularity > b.popularity) ? -1 : 1);
    if(button.value=="newest")
    this.filteredStories.sort((a,b)=>(a.lastUpdated > b.lastUpdated) ? -1 : 1);
  }

  levelFilterChanged(checked, box) {
    if (checked)
      this.levelfList.push(box);
    else
      this.levelfList.splice(this.levelfList.indexOf(box), 1);

      this.filterStories();
  }

  languageFilterChanged(event) {
    this.languagefList.push(event);
    this.filterStories();
  }
  removeLanguageFromFilter(language: string) {
    this.languagefList.splice(this.languagefList.indexOf(language), 1);
    this.filterStories();
  }

  filterStories() {
    if (this.languagefList.length != 0)
      this.filteredStories = this.stories.filter(story => {
        return this.languagefList.indexOf(story.language) > -1;
      })

    if (this.levelfList.length != 0)
      this.filteredStories = this.filteredStories.filter(story => {
        return this.levelfList.indexOf(story.level) > -1;
      })

    if (this.languagefList.length === 0 && this.levelfList.length === 0)
      this.filteredStories = this.stories;
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
          this.filteredStories = result;
          this.noStory = false;
        } else {
          this.noStory = true;
        }
      })
  }
}
