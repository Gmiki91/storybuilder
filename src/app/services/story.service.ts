import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Story } from '../models/story.model';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Injectable()
export class StoryService {

    private stories = new Subject<Story[]>();
    constructor(private http: HttpClient) { }

/** Stories grouped by language
 *  pushStories() {
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
 */
   pushStories(){
     this.http.get<Story[]>('http://localhost:3300/api/stories/all').subscribe(notfilteredStories=>this.stories.next(notfilteredStories));
   }

    getStories(){
        return this.stories.asObservable();
    }

    getStory(storyId: string){
        return this.http.get<Story>('http://localhost:3300/api/stories/one/' + storyId);
    }

    getAllStoryTitles() {
        return this.http.get<Story[]>('http://localhost:3300/api/stories/all')
            .pipe(
                map(stories => {
                    return stories.map(story => {
                        return story.title;
                    })
                })
            );
    }

    getPagesLength(storyId){
        return this.http.get<number>('http://localhost:3300/api/stories/length/'+storyId);
    }

    addStory(story: Story) {
       return this.http.post<Story>('http://localhost:3300/api/stories/add', story);
    }

    addPageToStory(pageId:string, storyId:string){
        this.http.patch('http://localhost:3300/api/stories/addPage',{pageId,storyId}).subscribe(()=> console.log("Empty page added at the end of newly accepted route"));
    }

    addPagesToStory(pageIds:string[], storyId:string){
        this.http.patch('http://localhost:3300/api/stories/addPages',{pageIds,storyId}).subscribe(() => this.pushStories());
    }

    pageLiked(storyId:string){
        return this.http.patch("http://localhost:3300/api/stories/liked", {id:storyId}).toPromise();
    }

    pageUnliked(storyId:string){
        return this.http.patch("http://localhost:3300/api/stories/unliked", {id:storyId}).toPromise();
    }
    
    archiveStory(storyId: string) {
        this.http.patch('http://localhost:3300/api/stories/archive',{id:storyId}).subscribe(() => this.pushStories());
    }
    isStoryArchived(storyId: string) {
       return this.http.get<boolean>('http://localhost:3300/api/stories/archive/'+storyId);
    }

    deleteStory(story: Story) {
        this.http.delete('http://localhost:3300/api/stories/'+story._id).subscribe(() => this.pushStories());
    }

}