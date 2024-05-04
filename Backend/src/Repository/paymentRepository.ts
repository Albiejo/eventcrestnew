import mongoose from "mongoose";
import Booking from "../Model/Booking";
import Payment , {paymentDocument} from "../Model/Payment";
import admin from "../Model/Admin";



interface PaymentWithAdminData {
  result: paymentDocument[];
  AdminData:object; 
}




export const createNewPaymnet = async (
    paymentData: Partial<paymentDocument>
  ): Promise<paymentDocument> => {
    try {
      const existingPayment = await Payment.findOne({ bookingId: paymentData.bookingId });
    
      if (existingPayment) {
        return existingPayment;
      }
      const result = await Payment.create(paymentData);
      await Booking.findByIdAndUpdate(paymentData.bookingId,{$set:{payment_status:"Completed"}})
      
      return result;
    } catch (error) {
      throw error;
    }
  };


  

  export const findAllPayments=async( skip: number, limit: number):Promise<PaymentWithAdminData>=>{
    try {

      const result=await Payment.find().populate('userId').populate('vendorId').populate('bookingId').skip(skip).limit(limit);
      const Admin =await admin.find();
      const AdminData = Admin[0];
      return {result,AdminData }
    } catch (error) {
      throw error;
    }
  }



  export const findPaymentCount = async()=>{
    try {
      const count = await Payment.countDocuments();
      return count;
    } catch (error) {
      throw error;    
    }
  }


  export const updateAdminWalletAmount = async(amount:number)=>{
    try {
      const admindata = await admin.find();
      if(!admindata){
        throw new Error("admin not found");
      }
      const Admin = admindata[0];
   
      if(!Admin.Wallet){
        Admin.Wallet = amount;
      }else{
        Admin.Wallet = Admin.Wallet + amount;
      }
      Admin.notifications.push({
        _id: new mongoose.Types.ObjectId(),
        message:`${amount} got credited to wallet!`,
        timestamp: new Date(),
        Read:false
      })
      await Admin.save();
      console.log("admin details after payment ",Admin)
    } catch (error) {
      throw error
    }
  }