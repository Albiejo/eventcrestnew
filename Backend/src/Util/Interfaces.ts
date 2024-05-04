import mongoose, { Document, Schema, Types } from 'mongoose';

//Interfaces for backend

export interface UserSession {
    otpSetTimestamp: number | undefined;
    email: string;
    password: string;
    name: string;
    phone: number;
    otpCode: string | undefined;
  }



export interface OTP {
    otp: string | undefined;
    email: string;
    otpSetTimestamp: number | undefined;
  }


export interface DecodedData {
    name: string;
    email: string;
    picture: string;
    jti: string;
  }


export interface vendorSession{
    email: string;
    password: string;
    name: string;
    phone: number;
    city:string;
    otpCode: string | undefined;
    vendor_type:string;
    otpSetTimestamp: number | undefined;
  }


export interface PaymentSession {
    amount:number;
    userId:string;
    bookingId:string;
    vendorId:string;
  }


export  interface Notification {
  _id: Types.ObjectId; 
  message: string;
  timestamp: Date;
  Read: boolean;
  
}



export interface Review {
  _id: mongoose.Types.ObjectId;
  username: string;
  rating: number;
  content: string;
  date:Date;
  reply:Array<string>
}

//for vendor model
export interface Vendor {
  email : string;
  password : string;
  name:string;
  city:string;
  about:string;
  phone:number;
  logo:string;
  coverpic:string;
  reviews:Array<Review>;
  isVerified:boolean;
  verificationRequest:boolean;
  totalBooking:number;
  vendor_type:Schema.Types.ObjectId;
  isActive:boolean;
  coverpicUrl:string;
  logoUrl:string;
  bookedDates:Array<string>;
  refreshToken:string;
  notifications:Array<Notification>;
  OverallRating:Number;
  locks: Lock[];
}

export interface Lock {
  date: string;
  isLocked: boolean;
}

export interface VendorType {
  type:string;
  status:boolean;
}
