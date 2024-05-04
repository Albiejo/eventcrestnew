export interface UserData{
    _id:string;
    email : string;
    password : string;
    name : string;
    phone : number;
    isActive:boolean;
    image:string;
    imageUrl:string;
    favourite:Array<string>;
    refreshToken:string;
    notifications:Array<object>;
}