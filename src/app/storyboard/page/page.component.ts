import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Page } from 'src/app/models/page.model';
import { PageService } from 'src/app/services/page.service';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})
export class PageComponent implements OnInit {

  page:Page;
  constructor(private route:ActivatedRoute, private pageService:PageService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params=>{
      this.pageService.findPageById(params.get("story")+params.get("page"))
      .subscribe(page=>{
        this.page=page})
    })
  }

}
