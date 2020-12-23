import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators'
import { Page } from 'src/app/models/page.model';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
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
  userSubscription = Subscription.EMPTY;
  routes: FormArray;
  routes2: string[];
  emptyRoute: boolean;
  user: User;
  voted: boolean;
  typeOfPublication: number;
  ownStory: boolean;
  constructor(private route: ActivatedRoute, private router: Router, private pageService: PageService, private storyService: StoryService, private authService: AuthService) { }

  ngOnInit(): void {
    this.ownStory=false;
    this.route.paramMap.subscribe(params => {
      this.storyTitle = params.get("story");
      this.pageService.findPageById(params.get("story") + '/' + params.get("page"));
      this.subscribeUser();
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

  onLike(): void {
    this.voted = true;
    this.authService.likePage(this.page._id);
    this.pageService.pageLiked(this.page._id);
    this.storyService.pageLiked(this.page.storyId);
  }

  onUnlike(): void {
    this.voted = false;
    this.authService.unlikePage(this.page._id);
    this.pageService.pageUnliked(this.page._id);
    this.storyService.pageUnliked(this.page.storyId);
  }

  routesNotFilled(): boolean {
    for (const route of this.routes.controls) {
      if (route.value == '')
        return true;
    }
    return false;
  }


  async onPublish(form: NgForm) {
    let number = await this.storyService.getPagesLength(this.page.storyId).pipe(first()).toPromise();

    let routeNamesAndIds = [];
    let pages: Page[] = [];

    for (const routeName of this.routes.controls) { // a route-hoz tartozó oldalak inicializálása üresen
      number++;
      routeNamesAndIds.push(routeName.value);
      routeNamesAndIds.push(this.storyTitle + '/' + number);
      pages.push({
        _id: this.storyTitle + '/' + number,
        storyId: this.page.storyId,
        content: "You arrived at an empty page.",
        routes: [],
        status: 0,
        author: null,
        votes: null,
        dateOfCreation: null
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
          content: form.value.content,
          status:this.typeOfPublication === 1 || this.typeOfPublication === 2 ? 1 : 2 //protected v public w votes? => under approval, else approved
        })
    })
  }


  private subscribePage() {
    if (this.pageSubscription) {
      this.pageSubscription.unsubscribe();
    }
    this.pageSubscription = this.pageService.getPage().subscribe(page => {
      this.page = page;
      this.authService.pushUpdatedUser();
      this.storyService.getStory(this.page.storyId).subscribe(story => {
        if (story)
          this.typeOfPublication = story.type;
          console.log("typeOfPublication: " +this.typeOfPublication);
      });
      if (page.status == 0) {
        this.routes = new FormArray([new FormControl(''), new FormControl('')])
      }
      else {
        this.routes2 = (page.routes.filter((x, i) => i % 2 == 0))
          .sort((a, b) => { return page.routes.indexOf(a) - page.routes.indexOf(b) });
      }
    })
  }

  private subscribeUser() {

    if (this.userSubscription)
      this.userSubscription.unsubscribe();
    this.userSubscription = this.authService.getUpdatedUser()
      .subscribe(user => {
        this.user = user;
        if (this.user.votedFor.includes(this.page._id))
          this.voted = true;
        else
          this.voted = false;

        if (this.user.storyId === this.page.storyId){
          this.ownStory = true;
        }
        console.log("ownStory",this.ownStory);
      })

  }
}