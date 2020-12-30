import { User } from "./user.model";

export interface Page{
    _id?: string;
    storyId:string;
    content: string;
    routes:string[];
    route:string[];
    status:number;
    votes:number;
    dateOfCreation:Date;
}