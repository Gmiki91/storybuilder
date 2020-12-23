export interface Story{
    _id?:string;
    title: string;
    pages:[string];
    level:string;
    language:string;
    type:number;
    popularity:number;
    lastUpdated:Date;
}

/*
Type :
	0 - private
	1 - protected
	2 - public w votes
	3 - public
	4 - archived

*/