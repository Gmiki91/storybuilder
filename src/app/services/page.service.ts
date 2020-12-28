import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Page } from "../models/page.model";
import { User } from "../models/user.model";
import { AuthService } from "./auth.service";

@Injectable()
export class PageService {

    private page = new Subject<Page>();
    private user:User;

    constructor(private httpClient: HttpClient, private authService: AuthService) { }


    addPage(page: Page) {
       return this.httpClient.post<string>("http://localhost:3300/api/pages", page);
    }
    addPages(pages:Page[]) {
        return this.httpClient.post<Page[]>("http://localhost:3300/api/pages/many", pages);
     }

    putUnderApproval(data){
        this.httpClient.post<string>("http://localhost:3300/api/pages/underApproval", data).subscribe(response=>console.log( response));
    }

    findPageById(id: string) {
        this.authService.getUpdatedUser().subscribe(user => {
            this.user=user;
        })
        this.httpClient.get<Page>("http://localhost:3300/api/pages/"+id).subscribe(page=>{
        this.page.next(page)});
    }

    getPage(){
        return this.page.asObservable();
    }

    addRoutes(data){
       return this.httpClient.patch("http://localhost:3300/api/pages/addRoutes", data);
    }

    removeRoute(data){
        this.httpClient.patch("http://localhost:3300/api/pages/removeRoute", data).subscribe(()=>{
            this.findPageById(data.pageId)});
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
        this.httpClient.patch("http://localhost:3300/api/pages/publishContent", {data:data, user:this.user}).subscribe(()=>{
            this.findPageById(data.pageId)});
    }
}