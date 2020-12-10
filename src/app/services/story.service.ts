import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Story } from '../models/story.model';

@Injectable()
export class StoryService {

    constructor(private http: HttpClient) { }

    getStories() {
        let languages=[{"language":"english", "level":3},{"language":"german","level":6}];
        return this.http.post<Story[][]>('http://localhost:3300/api/stories/', languages);
    }
    addStory(story:Story){
        this.http.post('http://localhost:3300/api/stories/add',story).subscribe((response)=>{console.log(response)}); 
    }
}