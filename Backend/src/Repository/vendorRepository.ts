import Vendor , {VendorDocument } from "../Model/Vendor";
import { Review } from "../Util/Interfaces";
import { CustomError } from "../Error/CustomError";
import mongoose from "mongoose";

export const createVendor = async (vendorData : Partial<VendorDocument>): Promise<VendorDocument> => {
    try {
      return await Vendor.create(vendorData);
    } catch (error) {
      throw error;
    }
  };


export const findvendorByEmail = async (email: string): Promise<VendorDocument | null> => {
    try {
      return await Vendor.findOne({ email });
    } catch (error) {
      throw error;
    }
};



export const findAllVendors = async (page: number, pageSize: number , search:string ,sortBy: string | null , category:string ): Promise<VendorDocument[] | null> => {
  try {
    let query: any = {};
   
    if (category && category.trim()) {
      const categories = category.split(',').map(c => c.trim());
      query.vendor_type = { $in: categories };
    }

    if (search && search.trim()) {
      query = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { city: { $regex: search, $options: "i" } },
        ],
      };
    }

    const skip = (page - 1) * pageSize;
    let data = Vendor.find(query).skip(skip).limit(pageSize);

    if (sortBy) {
      data = data.sort(sortBy); 
    }

    return await data.exec();
  } catch (error) {
    throw error;
  }
};



export const getTotalVendorsCount = async (): Promise<number> => {
  try {
    return await Vendor.countDocuments({});
  } catch (error) {
    throw error;
  }
};

export const UpdateVendorPassword = async(password:string , mail:string) =>{
  try {
    const result = await Vendor.updateOne({ email: mail }, { password: password });
    if (result.modifiedCount === 1) {
      return { success: true, message: "Vendor Password updated successfully." };
    } else {
      return { success: false, message: "Vendor not found or password not updated." };
    }
  } catch (error) {
    throw error;
  }
}


export const AddVendorReview = async(content: string, rating: number, username: string, vendorId: string)=>{
 try {

      const vendorData = await Vendor.findById(vendorId);
      if (!vendorData) {
        throw new Error('Vendor not found');
      }
    const reviewId = new mongoose.Types.ObjectId();

    vendorData.reviews.push({
      _id: reviewId,
      content,rating,username,
      date: new Date(),
      reply:[]
    });
    
    vendorData.notifications.push({
      _id: new mongoose.Types.ObjectId(),
      message:`${username} added a review to your profile.`,
      timestamp: new Date() ,
      Read:false
    })
    
    const ratings = vendorData.reviews.map((review) => review.rating)

    vendorData.OverallRating = calculateOverallRating(ratings);
    await vendorData.save();

    return true;

 } catch (error) {
   throw error;
 }
}

const calculateOverallRating = (ratings: any[]) => {
  const totalRating = ratings.reduce((acc, rating) => acc + rating, 0);
  return ratings.length > 0 ? totalRating / ratings.length : 0;
};


export const findVerndorId= async(vendorid:string):Promise<VendorDocument | null>=>{
  try {
    return await Vendor.findById( vendorid );
  } catch (error) {
    throw error;
  }
}


export const updateVendorprofData=async(vendorId: string, formData: any, coverpicUrl: string|undefined, logoUrl: string|undefined,logo:string|undefined,coverpic:string|undefined): Promise<void>=>{
  try {
    
      const update = {
        name:formData.name,
        city:formData.city,
        phone:parseInt(formData.phone),
        about:formData.about,
        coverpicUrl: coverpicUrl,
        logoUrl: logoUrl,
        logo: logo,
        coverpic: coverpic
      };
  
      // Use the $set operator to update the document
      await Vendor.updateOne({ _id: vendorId }, { $set: update });
       
    
    
  } catch (error) {
      throw new Error('Failed to update vendor data');
  }
}


export const addReviewReplyById = async(vendorId: string, content: string, reviewId: string)=>{
  try {
   
    const vendorData = await Vendor.findById(vendorId);
    if (!vendorData) {
      console.log('Vendor not found')
      throw new CustomError('Vendor not found', 404);
    }
    const review = vendorData.reviews.find((review: Review) => review._id.toString() === reviewId);
  
    if (!review) {
      console.log('Review not found')
      throw new CustomError('Review not found', 404);
    }
    const result = await Vendor.findByIdAndUpdate(
      vendorId,
      { $push: { 'reviews.$[review].reply': content } },
      {
        arrayFilters: [{ 'review._id': { $eq: new mongoose.Types.ObjectId(reviewId) } }],
        new: true 
      }
    );
   
   const newvendordata = await Vendor.findById(vendorId);
   return newvendordata;
  } catch (error) {
    throw new Error('Failed to add reply');
  }
}


export async function requestForVerification(vendorId:string){
  try {
    const data=await Vendor.findByIdAndUpdate(vendorId,{$set:{verificationRequest:true}})
    return data;
  } catch (error) {
    throw error;
  }
}



export async function updateVerificationStatus(vendorId:string,status:string){
  try {
    const data=await Vendor.findByIdAndUpdate(vendorId,{$set:{verificationRequest:false,isVerified: status === "Accepted"}})
    return data;
  } catch (error) {
    throw error;
  }
}


export const updateNotificationstatus =async(vendorid:string , notifid:string)=>{
  try {
    let vendordata = await Vendor.findById(vendorid);
    if (!vendordata) {
      throw new Error('User not found');
    }

    const notification = vendordata.notifications.find((notif) => notif._id.toString() === notifid);
    if (!notification) {
      throw new Error('Notification not found');
    }

    notification.Read = !notification.Read;
    await vendordata.save();
    const message = notification.Read ? 'Notification marked as read' : 'Notification marked as unread';
    vendordata = await Vendor.findById(vendorid);
    return {message: message, vendordata:vendordata};
  } catch (error) {
    throw error;
  }
}

export const clearNotification = async(vendorid :string) => {
  try {
    const vendorData = await Vendor.findById(vendorid);
    if (!vendorData) {
      throw new Error('vendor not found');
    }
    vendorData.notifications = [];
    await vendorData.save();
    return true;
  } catch (error) {
    throw error;
  }
  }