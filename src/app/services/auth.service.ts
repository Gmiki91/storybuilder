import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Story } from '../models/story.model';

import { User } from '../models/user.model';

@Injectable()
export class AuthService {
    private userLogged = new Subject<User>();
    private userUpdated = new Subject<User>();
    public user: User;

    constructor(private http: HttpClient) { }

    createUser(user: User) {
        this.http.post('http://localhost:3300/api/users/signup', user).subscribe(response => {
        });
    }

    login(data: { email: string, password: string }) {
        this.http.post<{ token: any, user: User }>('http://localhost:3300/api/users/login', data).subscribe(response => {
            this.user = response.user;
            this.userLogged.next(response.user);
            this.userUpdated.next(response.user);
        });
    }
    getUserLoggedIn() {
        return this.userLogged.asObservable();
    }
    getUpdatedUser() {
        return this.userUpdated.asObservable();
    }

    pushUpdatedUser(){
        this.http.get<User>('http://localhost:3300/api/users/updated/'+ this.user.email).subscribe(response => {
            this.user = response;
            this.userUpdated.next(response);
        })
    }

    getOwnStory() {
        return this.http.get<Story>('http://localhost:3300/api/stories/one/'+this.user.storyId);
    }
    addStory(storyId: string) {
        return this.http.patch('http://localhost:3300/api/users/addStory', { storyId: storyId, email: this.user.email }).subscribe(()=>this.pushUpdatedUser());
    }
    likePage(pageId: string){
        this.http.patch('http://localhost:3300/api/users/likePage', { pageId: pageId, email: this.user.email }).subscribe(()=>this.pushUpdatedUser());
    }
    unlikePage(pageId: string){
        this.http.patch('http://localhost:3300/api/users/unlikePage', { pageId: pageId, email: this.user.email }).subscribe(()=>this.pushUpdatedUser()); 
    }
}