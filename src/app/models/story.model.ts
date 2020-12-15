export interface Story{
    _id?:string;
    title: string;
    pages:[string];
    level:string;
    language:string;
    popularity:number;
    lastUpdated:Date;
}