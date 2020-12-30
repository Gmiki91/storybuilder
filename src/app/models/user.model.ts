export interface User{
    email:string;
    password:string;
    name:string;
    points:number;
    storyId:string;
    votedFor:[string];
    unlocked:[string];
}
