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
import Swal from 'sweetalert2'

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})
export class PageComponent implements OnInit {

  storyTitle: string;
  page: Page;
  routeObject;
  pageNumber: string;
  pageSubscription = Subscription.EMPTY;
  userSubscription = Subscription.EMPTY;
  user: User;
  ownStory: boolean;
  underApprovalRoutes: string[];
  answers: FormArray;
  unlocked: boolean;
  voted: boolean;
  advisedRoute: boolean;
  archived: boolean;

  constructor(private route: ActivatedRoute, private router: Router, private pageService: PageService, private storyService: StoryService, private authService: AuthService) { }

  ngOnInit(): void {
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

  onQuestion(): void {
    this.page.question;

    Swal.fire({
      title: this.page.question,
      icon: 'question',
      input: 'text',
      confirmButtonText: 'Check',
    }).then(response => {
      if (this.page.answers.indexOf(response.value) > -1) {
        Swal.fire({
          title: 'Correct!',
          icon: 'success',
          showConfirmButton: false,
          timer: 2000
        });
        this.pageUnlocked();
      } else
        Swal.fire({
          title: 'Incorrect!',
          icon: 'error',
          showCancelButton: true,
          confirmButtonText: 'But it should be right!',
          cancelButtonText: 'Oh well ...'
        }).then(response => {
          if (response.isConfirmed)
            Swal.fire({
              title: 'Your answer has been sent to the author for consideration.',
              icon: 'info',
              showConfirmButton: false,
              timer: 3000
            });
        })

    });
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

  onAddAnswer() {
    this.answers.push(new FormControl(''));
  }

  onRemoveAnswer() {
    this.answers.removeAt(this.answers.controls.length - 1);
  }

  got3Answers(): boolean {
    for (const answer of this.answers.controls)
      if (answer.value == '')
        return false
    return this.answers.length >= 3
  }

  onAddRoute(route) {
    if (!this.ownStory)
      this.authService.routeAdvised(this.page._id);

    this.pageService.putUnderApproval({ pageId: this.page._id, route: { name: route, user: this.user.email } }).subscribe((result: string[]) => {
      this.underApprovalRoutes = result
    });
  }

  onPublish(form: NgForm) {
    let answerArray: string[] = [];
    for (const answer of this.answers.controls)
      answerArray.push(answer.value);
    this.pageService.publishContent(
      {
        pageId: this.page._id,
        content: form.value.content,
        status: 1,
        question: form.value.question,
        answers: answerArray
      })
  }

  async onApproveRoute(route) {
    let number = await this.storyService.getPagesLength(this.page.storyId).pipe(first()).toPromise();
    number = number + 1;
    let pageId = this.storyTitle + "/" + number++;
    this.pageService.addEmptyPage({
      "_id": pageId,
      "storyId": this.page.storyId
    }).subscribe(() => {
      // route.user kap pontot
      this.storyService.addPageToStory(pageId, this.page.storyId);
      this.pageService.addRoute({ pageId: this.page._id, routeNameAndId: [route.name, pageId] });
      this.pageService.pageFinished(this.page._id);
      this.pageService.clearPossibleRoutes(this.page._id);
      this.underApprovalRoutes = [];
    })
  }

  private pageUnlocked(): void {
    this.unlocked = true;
    this.authService.unlockPage(this.page._id);
  }

  private subscribePage() {
    if (this.pageSubscription) {
      this.pageSubscription.unsubscribe();
    }
   
    this.pageSubscription = this.pageService.getPage().subscribe(async page =>  {
      this.page = page;
      this.archived= await this.storyService.isStoryArchived(page.storyId).pipe(first()).toPromise();
      this.underApprovalRoutes = page.routes;
      if (page.status == 0)
        this.answers = new FormArray([new FormControl(''), new FormControl(''), new FormControl('')])
      this.routeObject = {
        name: this.page.route[0],
        value: this.page.route[1]
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
        else
          this.ownStory = false;

        if (this.user.unlocked.indexOf(this.page._id) > -1)
          this.unlocked = true;
        else
          this.unlocked = false;

        if (this.user.routeAdvised.indexOf(this.page._id) > -1)
          this.advisedRoute = true;
        else
          this.advisedRoute = false;
      })

  }
}