import mongoose from "mongoose"
import { createNewPaymnet , findAllPayments ,updateAdminWalletAmount , findPaymentCount} from "../Repository/paymentRepository";
import { CustomError } from "../Error/CustomError";



export const addNewPayment=async(amount:number,userId:string,vendorId:string,bookingId:string): Promise<object>=>{
    try{
     const bookingIdObjectId =new mongoose.Types.ObjectId(bookingId) as unknown as mongoose.Schema.Types.ObjectId;
      const vendorIdObjectId =new mongoose.Types.ObjectId(vendorId) as unknown as mongoose.Schema.Types.ObjectId;
      const userIdObjectId=new mongoose.Types.ObjectId(userId) as unknown as mongoose.Schema.Types.ObjectId;


      const booking= await createNewPaymnet({amount,userId:userIdObjectId,vendorId:vendorIdObjectId,bookingId:bookingIdObjectId});
      return booking;

    } catch (error) {
      console.error("Error fetching add New Payment", error);
      throw new CustomError("unable to process payment now, try after some time" , 400);
    }
}


export const getPayments=async(skip:number , limit:number)=>{
  try {
    const payment=await findAllPayments(skip, limit);
    return payment;
  } catch (error) {
    console.error("Error fetching get Payments from DB", error);
    throw new CustomError("unable to get payments now , try after some time" , 400);
  }
}

export const updateAdminWallet= async(amount:number)=>{
try {
  await updateAdminWalletAmount(amount);
  
}catch (error) {
  console.error("Error fetching update Admin Wallet", error);
  throw new CustomError("unable to update wallet now , try after some time" , 400);
}
}

export const CountTotalPayments = async()=>{
  try {
    const count=await findPaymentCount();
    return count;
  } catch (error) {
     console.error("Error fetching Count Total Payments", error);
     throw error;
  }
}