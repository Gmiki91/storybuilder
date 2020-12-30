import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
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
  routeObject;
  pageNumber:string;
  pageSubscription = Subscription.EMPTY;
  userSubscription = Subscription.EMPTY;
  user: User;
  voted: boolean;
  ownStory: boolean;
  underApprovalRoutes:string[];
  constructor(private route: ActivatedRoute, private router: Router, private pageService: PageService, private storyService: StoryService, private authService: AuthService) { }

  ngOnInit(): void {
    this.ownStory = false;
    this.route.paramMap.subscribe(params => {
      this.storyTitle = params.get("story");
      this.pageNumber = params.get("page");
      this.pageService.findPageById(params.get("story") + '/' + params.get("page"));


      this.subscribePage();
    })
    
  }

  onRouteClick(): void {
    
    this.router.navigate([this.routeObject.value]);
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

onAddRoute(route){
  this.pageService.putUnderApproval({pageId:this.page._id,route:route}).subscribe((result:string[])=>{
    this.underApprovalRoutes=result});
}


  onPublish(form: NgForm) {
    this.pageService.publishContent(
      {
        pageId: this.page._id,
        content: form.value.content,
        status:  1
      })
    
  }

  async onApproveRoute(route:string){
    let number = await this.storyService.getPagesLength(this.page.storyId).pipe(first()).toPromise();
    number = number+1;
    let pageId =this.storyTitle+"/"+number++;
    console.log("pageId", pageId);
    this.pageService.addEmptyPage({
      "_id": pageId,
      "storyId": this.page.storyId
    }).subscribe(() => {
      this.storyService.addPageToStory(pageId,this.page.storyId);
      this.pageService.addRoute({pageId:this.page._id,routeNameAndId:[route,pageId]});
      this.pageService.pageFinished(this.page._id);
  }
    )
  }


  private subscribePage() {
    if (this.pageSubscription) {
      this.pageSubscription.unsubscribe();
    }
    this.pageSubscription = this.pageService.getPage().subscribe(page => {
      this.page = page;
      this.underApprovalRoutes=page.routes;
      this.routeObject={
        name:this.page.route[0],
        value:this.page.route[1]
      }
      this.subscribeUser();
     
    })
  }

  private subscribeUser() {
    this.authService.pushUpdatedUser();
    if (this.userSubscription)
      this.userSubscription.unsubscribe();
    this.userSubscription = this.authService.getUpdatedUser()
      .subscribe(user => {
        this.user = user;
        if (this.user.votedFor.includes(this.page._id))
          this.voted = true;
        else
          this.voted = false;

        if (this.user.storyId === this.page.storyId)
          this.ownStory = true;

      })

  }
}