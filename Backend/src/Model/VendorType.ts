import mongoose, { Schema, Document } from 'mongoose';
import { VendorType } from '../Util/Interfaces';


export interface VendorTypeDocument extends VendorType, Document {}

const VendorTypeSchema: Schema = new Schema({
    type :{type:String , required:true} ,
    status :{type:Boolean , required:true,default:true}
});

export default mongoose.model<VendorTypeDocument>('vendortype', VendorTypeSchema);