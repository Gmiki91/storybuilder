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
  levels;
  story: Story;
  constructor(private authService: AuthService, private storyService: StoryService, private pageService: PageService) { }

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
    this.authService.getOwnStory().subscribe(story => {
      if (story)
        this.story = story;
    })

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
      }).subscribe((story:Story)=>{
        this.authService.addStory(story._id);
        this.pageService.addPage({
          "_id": story.title.toLowerCase() + "/1",
          "storyId":story._id,
          "status": 0,
          "routes": [],
          "content": null
        }).subscribe(() => {this.storyService.pushStories()});
      })
    }
  }

}
