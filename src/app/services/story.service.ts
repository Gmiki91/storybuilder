import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Story } from '../models/story.model';
import { filter, map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import { Subject } from 'rxjs';
import { Language } from '../models/language.enum';

@Injectable()
export class StoryService {

    private stories = new Subject<Story[][]>();
    constructor(private http: HttpClient) { }

    pushStories() {
        var languages =  Object.values(Language);
        return this.http.post<Story[][]>('http://localhost:3300/api/stories/', languages)
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

    getPagesLength(storyId){
        return this.http.get<number>('http://localhost:3300/api/stories/'+storyId);
    }

    addStory(story: Story) {
       return this.http.post<Story>('http://localhost:3300/api/stories/add', story);
    }

    addPageToStory(pageId:string, storyId:string){
        this.http.patch('http://localhost:3300/api/stories/addPage',{pageId,storyId}).subscribe(() => this.pushStories());
    }

    deleteStory(story: Story) {
        this.http.delete('http://localhost:3300/api/stories/'+story._id).subscribe(() => this.pushStories());
    }

}