import { VendorData } from "./vendorType";
import { UserData } from "./userType";


export interface FormValues {
    eventName: string;
    name: string;
    date: string;
    city: string;
    pin: string;
    mobile: string;
  }


  export interface booking{
    date:string;
    name:string;
    eventName:string;
    city:string;
    pin:number;
    mobile:number;
    createdAt:Date;
    vendorId:string;
    userId:string;
    status:string;
    payment_status:string;
    amount:number;
  }


  export interface payment{
    _id:string;
      amount:number;
      vendorId:VendorData;
      userId:UserData;
      bookingId:booking;
      createdAt:Date
  }