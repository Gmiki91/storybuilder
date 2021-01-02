import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Post } from "../models/post.model";

@Injectable()
export class ForumService{
    constructor(private http: HttpClient) { }

    getPosts(storyTitle:string, pageNumber:string) {
        return this.http.get<Post[]>('http://localhost:3300/api/forum/'+storyTitle+'/'+pageNumber);
    }

    postPost(pageId:string){
        this.http.post('http://localhost:3300/api/forum/postPost',{pageId:pageId}).subscribe((response)=>console.log(response));
    }
}