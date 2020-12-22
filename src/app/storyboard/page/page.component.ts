import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, NgForm } from '@angular/forms';
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
  routes: FormArray;
  routes2: string[];
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

  onAddRoute(): void {
    this.routes.push(new FormControl(''));
  }

  onRemoveRoute(): void {
    this.routes.removeAt(this.routes.controls.length - 1);
  }

  routesNotFilled(): boolean {
    for (const route of this.routes.controls) {
      if (route.value == '') {
        return true;
      }
    }
    return false;
  }


  async onPublish(form: NgForm) {
    let number = await this.storyService.getPagesLength(this.page.storyId).pipe(first()).toPromise();
    let routeNamesAndIds = [];
    let pages :Page[] = [];

    for (const routeName of this.routes.controls) {
      number++;
      routeNamesAndIds.push(routeName.value);
      routeNamesAndIds.push(this.storyTitle + '/' + number);
      pages.push({
        _id: this.storyTitle + '/' + number,
        storyId: this.page.storyId,
        content: "You arrived at an empty page.",
        routes: [],
        status: 0,
        author:null,
        votes:null,
        dateOfCreation:null
      });
    }
    this.pageService.addPages(pages).subscribe(ops => {
      let result = ops.map(op => op._id);
      this.storyService.addPagesToStory(result, this.page.storyId);
    });

    this.pageService.addRoutes({
      pageId: this.page._id,
      routes: routeNamesAndIds
    }).subscribe(() => {
      this.pageService.publishContent(
        {
          pageId: this.page._id,
          content: form.value.content
        });
    })
  }


  private subscribePage() {
    if (this.pageSubscription) {
      this.pageSubscription.unsubscribe();
    }
    this.pageSubscription = this.pageService.getPageById().subscribe(page => {
      this.page = page;
      if (page.status == 0) {
        this.routes = new FormArray([new FormControl(''), new FormControl('')])
      }
      else {
        this.routes2 = (page.routes.filter((x, i) => i % 2 == 0)).sort((a, b) => {

          return page.routes.indexOf(a) - page.routes.indexOf(b)
        });
      }

    })
  }
}