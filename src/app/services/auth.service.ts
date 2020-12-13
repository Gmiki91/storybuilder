import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { User } from '../models/user.model';

@Injectable()
export class AuthService{
    private userLogged = new Subject<User>();
    
    constructor(private http: HttpClient) { }

    createUser(user:User){
        this.http.post('http://localhost:3300/api/users/signup', user).subscribe(response => {
        });
    }

    login(data:{email:string, password:string}){
        this.http.post<{ token: any, user: User }>('http://localhost:3300/api/users/login',data).subscribe(response => {
            this.userLogged.next(response.user);
        });
}
getUserLoggedIn() {
    return this.userLogged.asObservable();
}
    
}