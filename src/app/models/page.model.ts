import { User } from "./user.model";

export interface Page{
    _id?: string;
    tempId?:string;
    storyId:string;
    content: string;
    routes:string[];
    status:number;
    author:User;
    votes:number;
    dateOfCreation:Date;
}