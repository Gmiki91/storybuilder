export interface User{
    _id?:string;
    email:string;
    password:string;
    name:string;
    points:number;
    storyId:string;
    votedFor:[string];
    unlocked:[string];
    routeAdvised:[string];
    favorite:[string];
}
