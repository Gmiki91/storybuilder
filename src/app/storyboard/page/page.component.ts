import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
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
  routes: string[] = [];
  emptyRoute: boolean;

  constructor(private route: ActivatedRoute, private router: Router, private pageService: PageService, private storyService: StoryService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.storyTitle = params.get("story");
      this.pageService.findPageById(params.get("story") + '/' + params.get("page"));
      this.subscribePage();
    })
  }

  onRoute(indexOfRoute): void {
    const newRoute = this.page.routes[indexOfRoute * 2 + 1];
    this.router.navigate([newRoute]);
  }

  updateRoutes(route) {
    this.routes[route.target.id] = route.target.value;
  }

  onAddNewRoute(): void {
    this.routes.push('');
  }

  onRemoveRoute(): void {
    this.routes.pop();
  }

  async onPublish(form: NgForm) {
    this.pageService.publishContent(
      {
        pageId: this.page._id,
        content: form.value.content
      });

     let number = await this.storyService.getPagesLength(this.page.storyId).pipe(first()).toPromise();
    this.routes.forEach( inputValue => {
      number++;
      this.pageService.addRoute({
        pageId: this.page._id,
        routeName: inputValue,
        routeId: this.storyTitle + '/' + number
      });
      this.pageService.addPage({
        _id: this.storyTitle + '/' + number,
        storyId: this.page.storyId,
        content: null,
        routes: [],
        status: 0,
      }).subscribe(pageId => {
        this.storyService.addPageToStory(pageId, this.page.storyId)
      });
      
    })
  }

  onAddRoute(inputValue) {
    this.routes.push(inputValue);

  }

  private subscribePage() {
    if (this.pageSubscription) {
      this.pageSubscription.unsubscribe();
    }
    this.pageSubscription = this.pageService.getPageById().subscribe(page => {
      console.log(page);
      this.page = page;
      if (page.status == 0)
        this.routes = ['', ''];

      else
        this.routes = page.routes.filter((x, i) => i % 2 == 0);

    })
  }
  identify(index, item) {
    return item.id;
  }
}