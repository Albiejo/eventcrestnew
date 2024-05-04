import mongoose, { Schema, Document, Types } from 'mongoose';
import { Notification } from '../Util/Interfaces';

export interface User {
    email : string;
    password : string;
    name : string;
    phone : number;
    isActive:boolean;
    favorite:Array<string>;
    image:string;
    imageUrl:string;
    refreshToken:string;
    notifications:Array<Notification>;
    
    
}

export interface UserDocument extends User, Document {}

const UserSchema: Schema = new Schema({
    email :{type:String , required:true, unique:true},
    password:{type:String, required:true} , 
    name :{type:String , required:true} ,
    phone :{type:Number  , unique:true},
    isActive :{type:Boolean , required:true},
    favorite:{type:Array},
    image:{type:String},
    imageUrl:{type:String},
    refreshToken: { type: String },
    notifications:[{
        _id: { type: Schema.Types.ObjectId, default: Types.ObjectId },
        message: String,
        timestamp: { type: Date, default: Date.now  },
        Read: { type: Boolean, default: false }
    }]

});

export default mongoose.model<UserDocument>('User', UserSchema);