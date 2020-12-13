import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators'
import { Page } from 'src/app/models/page.model';
import { PageService } from 'src/app/services/page.service';
import { StoryService } from 'src/app/services/story.service';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})
export class PageComponent implements OnInit {

  storyTitle: string;
  page: Page;
  pageSubscription = Subscription.EMPTY;
  addRoute: boolean;
  contentEdit:boolean;
  routes = [];

  constructor(private route: ActivatedRoute, private router:Router, private pageService: PageService, private storyService: StoryService) { }

  ngOnInit(): void {
    this.contentEdit=false;
    this.route.paramMap.subscribe(params => {
      this.storyTitle = params.get("story");
      this.pageService.findPageById(params.get("story") +'/'+ params.get("page"));
      this.subscribePage();
    })
  }

  onAddNewRoute(): void {
    this.addRoute = true;
  }

  onRoute(indexOfRoute):void{
    const newRoute = this.page.routes[indexOfRoute*2+1];
    console.log(newRoute);
    this.router.navigate([newRoute]);
  }

  onEditContent():void{
    this.contentEdit=true;
  }

  onSaveContent(content):void{
    this.pageService.updateContent(
      {pageId:this.page._id,
      content:content
    });
  }

  async onAddRoute(inputValue) {
    let number = await this.storyService.getPagesLength(this.storyTitle).pipe(first()).toPromise();
    number++;
    this.pageService.addPage({
      _id: this.storyTitle +'/'+ number,
      content: null,
      routes: [],
      status: 0,
    }).subscribe(pageId => {
      this.storyService.addPageToStory(pageId, this.storyTitle)
    });
    this.pageService.addRoute({
      pageId: this.page._id,
      routeName: inputValue,
      routeId: this.storyTitle +'/'+ number
    });
  }

  private subscribePage() {
    if (this.pageSubscription) {
      this.pageSubscription.unsubscribe();
    }
    this.pageSubscription = this.pageService.getPageById().subscribe(page => {
      this.page = page;
      this.routes = page.routes.filter((x, i) => i % 2 == 0);
    })
  }
}