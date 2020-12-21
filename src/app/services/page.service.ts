import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Page } from "../models/page.model";
import { StoryService } from "./story.service";

@Injectable()
export class PageService {

    private page = new Subject<Page>();

    constructor(private httpClient: HttpClient, private storyService:StoryService) { }

    addPage(page: Page) {
       return this.httpClient.post<string>("http://localhost:3300/api/pages", page);
    }
    addPages(pages:Page[]) {
        return this.httpClient.post<Page[]>("http://localhost:3300/api/pages/many", pages);
     }

    findPageById(id: string) {
        this.httpClient.get<Page>("http://localhost:3300/api/pages/"+id).subscribe(page=>{
        this.page.next(page)});
    }

    getPageById(){
        return this.page.asObservable();
    }

    addRoutes(data){
       return this.httpClient.patch("http://localhost:3300/api/pages/addRoutes", data);
    }

    removeRoute(data){
        this.httpClient.patch("http://localhost:3300/api/pages/removeRoute", data).subscribe(()=>{
            this.findPageById(data.pageId)});
    }
    publishContent(data){
        this.httpClient.patch("http://localhost:3300/api/pages/publishContent", data).subscribe(()=>{
            this.findPageById(data.pageId)});
    }
}