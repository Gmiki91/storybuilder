import { Component, OnInit } from '@angular/core';
import { Story } from '../models/story.model';
import { StoryService } from '../services/story.service';

@Component({
  selector: 'app-storyboard',
  templateUrl: './storyboard.component.html',
  styleUrls: ['./storyboard.component.css']
})
export class StoryboardComponent implements OnInit {

  stories: Story[][];
  constructor(private storyService: StoryService) { }

  ngOnInit(): void {
    this.storyService.getStories().subscribe((result)=>{
      console.log(result)
      this.stories=result;
    })
  }
  onClick(story:Story):void{
    console.log(story.title);
  }

}
     /*let story1: Story = {
      "language": "german",
      "level": 4,
      "title": "Hallo4"
    }
    let story2: Story = {
      "language": "german",
      "level": 3,
      "title": "Hallo3"
    }
    let story3: Story = {
      "language": "german",
      "level": 6,
      "title": "Hallo6"
    }
    let story4: Story = {
      "language": "english",
      "level": 1,
      "title": "Hello1"
    }
    let story5: Story = {
      "language": "english",
      "level": 2,
      "title": "Hello2"
    }
   this.storyService.addStory(story1);
    this.storyService.addStory(story2);
    this.storyService.addStory(story3);
    this.storyService.addStory(story4);
    this.storyService.addStory(story5);*/