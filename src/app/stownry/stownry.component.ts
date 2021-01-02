import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { StoryService } from '../services/story.service';
import { first } from 'rxjs/operators'
import { Story } from '../models/story.model';
import { PageService } from '../services/page.service';
import { Language } from '../models/language.enum';

@Component({
  selector: 'app-stownry',
  templateUrl: './stownry.component.html',
  styleUrls: ['./stownry.component.css']
})
export class StownryComponent implements OnInit {

  languages: string[];
  levels: Object[];
  types: Object[];
  story: Story;
  constructor(private authService: AuthService, private storyService: StoryService, private pageService: PageService) { }

  ngOnInit(): void {
    this.languages = Object.values(Language);
    this.levels = [
      "Beginner",
      "Intermediate",
      "Fluent",
    ];


    this.authService.getOwnStory().subscribe(story => {
      if (story)
        this.story = story;
    })

  }
  onDelete() {
    this.storyService.deleteStory(this.story);
    this.authService.deleteOwnStory();
    this.authService.removeSavedPageIds(this.story.pages);
  }

  async onSubmit(form: NgForm) {
    let titles = await this.storyService.getAllStoryTitles().pipe(first()).toPromise();
    if (titles.indexOf(form.value.title) > -1) {
      console.log("title taken");
    } else {
      this.storyService.addStory({
        "title": form.value.title,
        "level": form.value.level,
        "pages": [form.value.title.toLowerCase() + "/1"],
        "language": form.value.language,
        "lastUpdated": new Date(),
        "popularity": 0
      }).subscribe((story: Story) => {
        this.authService.addStory(story._id);
        this.pageService.addEmptyPage({
          "_id": story.title.toLowerCase() + "/1",
          "storyId": story._id
        }).subscribe(() => { this.storyService.pushStories() });
      })
    }
  }

}
