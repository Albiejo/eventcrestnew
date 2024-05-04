import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createVendor , findvendorByEmail ,updateVerificationStatus, getTotalVendorsCount,findAllVendors ,UpdateVendorPassword ,AddVendorReview,findVerndorId , updateVendorprofData  , addReviewReplyById , requestForVerification ,
  updateNotificationstatus ,clearNotification
} from '../Repository/vendorRepository';
import mongoose, { ObjectId } from 'mongoose';
import vendor , { VendorDocument } from '../Model/Vendor';
import { findVerndorIdByType } from '../Repository/vendorTypeRepository';
import { CustomError } from '../Error/CustomError';
import admin from '../Model/Admin';


interface LoginResponse {
  token: string;
  vendorData: object; 
  message: string;
  refreshToken:string
}

export const signup = async (email:string ,password:string, name:string , phone:number, city:string,vendor_type:string): Promise<string> => {
    try {
      const existingVendor = await findvendorByEmail(email);
      if (existingVendor) {
        throw new Error('vendor already exists');
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const isActive:boolean = true;
      const isVerified:boolean=false;
      const verificationRequest:boolean=false;
      const totalBooking:number=0;

      const vendorType=await findVerndorIdByType(vendor_type);

      const newVendor = await createVendor({ email , password: hashedPassword , name , phone , city , isActive , isVerified , verificationRequest , totalBooking ,vendor_type:vendorType?._id});
  
      return "vendor created";

    } catch (error) {
      console.error("Error fetching signup", error);
      throw new CustomError("Unable to fetch signup", 500);
    }
  };




  export const login = async (email:string , password : string): Promise<LoginResponse> =>{
    try {
        const existingVendor = await findvendorByEmail(email);
        if (!existingVendor) {
          throw new CustomError('Vendor not exists..', 404);
        }
        if(!existingVendor.isActive){
          throw new CustomError(`Vendor is Blocked, can't login`, 401);
        }
    
        const passwordMatch = await bcrypt.compare( password, existingVendor.password);

        if (!passwordMatch) {
          throw new CustomError('Incorrect password..', 401);
        }

        const vendorData = await findvendorByEmail(email);

        // If the password matches, generate and return a JWT token
        const token = jwt.sign({ _id: existingVendor._id }, process.env.JWT_SECRET!, { expiresIn: "24h"});

        let refreshToken = existingVendor.refreshToken;

   
        if (!refreshToken) {
         
          refreshToken = jwt.sign({ _id: existingVendor._id }, process.env.JWT_REFRESH_SECRET!, { expiresIn: "7d" });
        }
    
    
        existingVendor.refreshToken = refreshToken;
        await existingVendor.save();

        return {refreshToken , token,vendorData:existingVendor,message:"Successfully logged in.."};
        
      } catch (error) {
        console.error("Error fetching login", error);
        throw new CustomError("Unable to fetch login", 500);
      }
}


export const CheckExistingVendor = async(email:string)=>{
  try {
    const existingVendor = await findvendorByEmail(email);
    return existingVendor;
  } catch (error) {
    console.error("Error fetching CheckExistingVendor", error);
    throw new CustomError("Unable to fetch CheckExistingVendor", 500);
  }
}



export const createRefreshToken = async (refreshToken:string)=>{
  try {

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { _id: string };
    const Vendor = await vendor.findById(decoded._id);

    if (!Vendor || Vendor.refreshToken !== refreshToken) {
        throw new Error('Invalid refresh token');
      }

    const accessToken = jwt.sign({ _id: Vendor._id }, process.env.JWT_SECRET!, { expiresIn: '24h' });
    return accessToken;

  } catch (error) {
    console.error("Error fetching createRefreshToken", error);
    throw new CustomError("Unable to fetch createRefreshToken", 500);
  }
}


export const getVendors=async(page: number, pageSize: number, search:string , sortBy: string | null , category:string)=>{
  try {
    const vendors=await findAllVendors(page ,pageSize , search ,sortBy ,category);
    const totalVendorsCount = await getTotalVendorsCount();
    return { vendors, totalVendorsCount };
  } catch (error) {
    console.error("Error fetching getVendors", error);
    throw new CustomError("Unable to fetch getVendors", 500);
  }
}



export const toggleVendorBlock = async(vendorId:string): Promise<void> =>{
  try {
    const Vendor = await vendor.findById(vendorId)
    if (!Vendor) {
        throw new Error('Vendor not found');
    }
    
    Vendor.isActive = !Vendor.isActive; 
    await Vendor.save();
    const admindata = await admin.find();
    const Admin:any= admindata[0];
    Admin.notifications.push({
      _id: new mongoose.Types.ObjectId(),
      message:`${Vendor.name}'s status was toggled , ${Vendor.isActive ? "active" : "blocked"} now`,
      timestamp: new Date()
    })
  
    await Admin.save();
    console.log("notifi pushed",Admin);
} catch (error) {
  console.error("Error fetching toggleVendorBlock", error);
  throw new CustomError("Unable to fetch toggleVendorBlock", 500);
}

}



export const getSingleVendor = async(vendorId:string): Promise<VendorDocument> =>{
  try {
    const Vendor = await vendor.findById(vendorId)
    if (!Vendor) {
        throw new Error('Vendor not found');
    }
   return Vendor;
} catch (error) {
    console.error("Error fetching getSingleVendor", error);
    throw new CustomError("Unable to fetch getSingleVendor", 500);
}

}


export const ResetVendorPasswordService = async(password:string , email:string)=>{
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const status = await UpdateVendorPassword(hashedPassword , email);
    if(!status.success){
      throw new Error(status.message)
    }
  } catch (error) {
    console.error("Error fetching ResetVendorPasswordService", error);
    throw new CustomError("Unable to fetch ResetVendorPasswordService", 500);
  }
}


export const PushVendorReview = async(content:string , rating:number , username:string , vendorid:string)=>{
  try {
    const data = await AddVendorReview(content , rating, username , vendorid)
    return  data;
  } catch (error) {
    console.error("Error fetching PushVendorReview", error);
    throw new CustomError("Unable to fetch PushVendorReview", 500);
  }
}





export const checkVendorCurrentPassword= async(Currentpassword:string , vendorid:string)=>{
try {
    const existingVendor = await findVerndorId(vendorid);
  
    if(!existingVendor){
      throw new CustomError("Vendor not found",404)
    }

    const passwordMatch = await bcrypt.compare( Currentpassword, existingVendor.password);

    
    if (!passwordMatch) {
      throw new CustomError("Password doesn't match",401)
    }

    return passwordMatch; 
} catch (error) {
  console.error("Error fetching checkVendorCurrentPassword", error);
  throw new CustomError("Unable to fetch checkVendorCurrentPassword", 500);
}
}


 


export const UpdateVendorPasswordService=async(newPassword:string , vendorid:string)=>{

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const existingVendor = await findVerndorId(vendorid);
    if(!existingVendor){
      throw new CustomError("user not found",404)
    }
    const email = existingVendor.email;

    const updatedValue = await UpdateVendorPassword(hashedPassword , email);
    if(updatedValue){
      return true;
    }
    return false
  } catch (error) {
    console.error("Error fetching UpdateVendorPasswordService", error);
    throw new CustomError("Unable to fetch UpdateVendorPasswordService", 500); 
  }
}

export const updateVendorprof=async(vendorId: string, formData: any, coverpicUrl: string|undefined, logoUrl: string|undefined,logo:string|undefined,coverpic:string|undefined): Promise<any> =>{
  try {
    console.log("inside update service");
    
    await updateVendorprofData(vendorId, formData, coverpicUrl, logoUrl,logo,coverpic);
   
    const updatedVendor = await findVerndorId(vendorId);

    return updatedVendor;
} catch (error) {
  console.error("Error fetching updateVendorprof", error);
  throw new CustomError("Unable to fetch updateVendorprof", 500);
}
}



export const addReviewReplyController=async(vendorId:string,content:string,reviewId:string): Promise<any>=>{
  try {
    const vendordata=await addReviewReplyById(vendorId,content,reviewId)
    return vendordata;
  } catch (error) {
    console.error("Error fetching addReviewReplyController", error);
    throw new CustomError("Unable to fetch addReviewReplyController", 500);
  }
}



export const  verificationRequest=async(vendorId:string)=>{
  try {
    const data=await requestForVerification(vendorId)
    return data
  } catch (error) {
    console.error("Error fetching verificationRequest", error);
    throw new CustomError("Unable to fetch verificationRequest", 500);
  }
}


export async function changeVerifyStatus(vendorId:string,status:string){
  try {
    const data=await updateVerificationStatus(vendorId,status)
    return data
  } catch (error) {
    console.error("Error fetching changeVerifyStatus", error);
    throw new CustomError("Unable to fetch changeVerifyStatus", 500);
  }
}

export const updateNotification =async(vendorid :string , notifiId:string)=>{
try {
  const data = await updateNotificationstatus(vendorid ,notifiId)
  return data;
} catch (error) {
    console.error("Error fetching updateNotification", error);
    throw new CustomError("Unable to fetch updateNotification", 500);
}
}

export const clearalldata = async(vendorid:string):Promise<boolean>=>{
  try {
   const data  = await clearNotification(vendorid);
   return data;
  } catch (error) {
    console.error("Error fetching clearalldata", error);
    throw new CustomError("Unable to fetch clearalldata", 500);
  }
}