import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Page } from "../models/page.model";

@Injectable()
export class PageService {

    private page = new Subject<Page>();

    constructor(private httpClient: HttpClient) { }


    addEmptyPage(page) {
       return this.httpClient.post<string>("http://localhost:3300/api/pages", page);
    }


    putUnderApproval(data){
       return this.httpClient.post<string[]>("http://localhost:3300/api/pages/underApproval", data);
    }

    getUnderApprovals(story:string, page:string){
        return this.httpClient.get<string[]>("http://localhost:3300/api/pages/underApproval/"+story+"/"+page);
    }

    findPageById(id: string) {
        this.httpClient.get<Page>("http://localhost:3300/api/pages/"+id).subscribe(page=>{
        this.page.next(page)});
    }

    getPage(){
        return this.page.asObservable();
    }

    addRoutes(data){
       return this.httpClient.patch("http://localhost:3300/api/pages/addRoutes", data);
    }

    addRoute(data){
         this.httpClient.patch("http://localhost:3300/api/pages/addRoute", data).subscribe(()=>{
            this.findPageById(data.pageId)});
     }

     pageFinished(pageId:string){
        this.httpClient.patch("http://localhost:3300/api/pages/pageFinished",{pageId:pageId}).subscribe(()=>{
            this.findPageById(pageId)});
     }
    pageLiked(pageId){
        this.httpClient.patch("http://localhost:3300/api/pages/liked",{id:pageId}).subscribe(()=>{
            this.findPageById(pageId)});
    }
    pageUnliked(pageId){
        this.httpClient.patch("http://localhost:3300/api/pages/unliked", {id:pageId}).subscribe(()=>{
            this.findPageById(pageId)});
    }

    publishContent(data){
        this.httpClient.patch("http://localhost:3300/api/pages/publishContent",data).subscribe(()=>{
            this.findPageById(data.pageId)});
    }
}