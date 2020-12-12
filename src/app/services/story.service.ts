import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Story } from '../models/story.model';
import { filter, map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import { Subject } from 'rxjs';

@Injectable()
export class StoryService {

    private stories = new Subject<Story[][]>();
    constructor(private http: HttpClient) { }

    pushStories() {
        var data = [{ language: "English", "level": "C1" }];
        return this.http.post<Story[][]>('http://localhost:3300/api/stories/', data)
            .pipe(
                map(stories => {
                    return stories.filter(story => {
                        return story.length > 0;
                    })
                })
            ).subscribe(filteredStories=>this.stories.next(filteredStories));
    }

    getStories(){
        return this.stories.asObservable();
    }

    getAllStoryTitles() {
        return this.http.get<Story[]>('http://localhost:3300/api/stories')
            .pipe(
                map(stories => {
                    return stories.map(story => {
                        return story.title;
                    })
                })
            );
    }

    addStory(story: Story) {
        this.http.post('http://localhost:3300/api/stories/add', story).subscribe(() => this.pushStories());
    }
}