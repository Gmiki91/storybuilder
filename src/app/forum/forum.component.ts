import { Component, Input, OnInit } from '@angular/core';
import { Post } from '../models/post.model';
import { ForumService } from '../services/forum.service';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css']
})
export class ForumComponent implements OnInit {


  @Input() storyTitle: string;
  @Input() pageNumber:string;
  pageId:string;
  posts: Post[];
  constructor(private forumService: ForumService) { }

  ngOnInit(): void {
    this.pageId=this.storyTitle+"/"+this.pageNumber;
    this.forumService.getPosts(this.storyTitle, this.pageNumber).subscribe((posts: Post[]) =>
      this.posts = posts);
  }

  postPost() {
    this.forumService.postPost(this.pageId);
  }
}
