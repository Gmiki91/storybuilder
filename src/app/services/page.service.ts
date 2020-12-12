import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Page } from "../models/page.model";

@Injectable()
export class PageService {

    constructor(private httpClient: HttpClient) { }

    addPage(page: Page) {
        this.httpClient.post("http://localhost:3300/api/pages", page).subscribe(() => console.log("page added"));
    }

    findPageById(id: string) {
        return this.httpClient.get<Page>("http://localhost:3300/api/pages/"+id);
    }
}