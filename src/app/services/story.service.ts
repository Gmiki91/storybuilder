import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Story } from '../models/story.model';
import { filter, map } from 'rxjs/operators';

@Injectable()
export class StoryService {

    constructor(private http: HttpClient) { }

    getStories() {
        let languages = [
            { "language": "English", "level": 3 },
            { "language": "German", "level": 6 },
            { "language": "Spanish", "level": 6 },
        ];
        return this.http.post<Story[][]>('http://localhost:3300/api/stories/', languages)
            .pipe(
                map(stories => {
                    return stories.filter(story => {
                        return story.length > 0;
                    })
                }))
            ;
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
        this.http.post('http://localhost:3300/api/stories/add', story).subscribe(() => console.log("Story created"));
    }
}