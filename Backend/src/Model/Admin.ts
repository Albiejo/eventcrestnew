import {Document,Schema,Types,model} from "mongoose";
import { Notification } from '../Util/Interfaces';


export interface AdminDocument extends Document{
    email:string;
    password:string;
    createdAt:Date;
    isAdmin:boolean;
    refreshToken:string;
    Wallet:number;
    notifications:Array<Notification>;
}

const adminSchema=new Schema<AdminDocument>({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    isAdmin:{
        type:Boolean,
        required:true
    },
    refreshToken:{
        type:String
    },
    Wallet:{
        type:Number
    },
    notifications:[{
        _id: { type: Schema.Types.ObjectId, default: Types.ObjectId },
        message: String,
        timestamp: { type: Date, default: Date.now },
        Read:{type:Boolean , default: false}
    }]
})




export default model<AdminDocument>('Admin',adminSchema)

