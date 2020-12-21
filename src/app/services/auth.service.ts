import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Story } from '../models/story.model';

import { User } from '../models/user.model';

@Injectable()
export class AuthService {
    private userLogged = new Subject<User>();
    private user: User;

    constructor(private http: HttpClient) { }

    createUser(user: User) {
        this.http.post('http://localhost:3300/api/users/signup', user).subscribe(response => {
        });
    }

    login(data: { email: string, password: string }) {
        this.http.post<{ token: any, user: User }>('http://localhost:3300/api/users/login', data).subscribe(response => {
            this.user = response.user;
            this.userLogged.next(response.user);
        });
    }
    getUserLoggedIn() {
        return this.userLogged.asObservable();
    }

    getOwnStory() {
        console.log(this.user);
        return this.http.get<Story>('http://localhost:3300/api/stories/own/'+this.user.storyId);
    }
    addStory(storyId: string) {
        return this.http.patch('http://localhost:3300/api/users/addStory', { storyId: storyId, email: this.user.email }).subscribe(()=>this.getOwnStory());
    }
}