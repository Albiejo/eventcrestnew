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
      console.error("Error fetching addNewPayment", error);
      throw new CustomError("Unable to fetch addNewPayment", 500);
    }
}


export const getPayments=async(skip:number , limit:number)=>{
  try {
    const payment=await findAllPayments(skip, limit);
    return payment;
  } catch (error) {
    console.error("Error fetching getPayments", error);
    throw new CustomError("Unable to fetch getPayments", 500);
  }
}

export const updateAdminWallet= async(amount:number)=>{
try {
  await updateAdminWalletAmount(amount);
  
} catch (error) {
  console.log(error);
  console.error("Error fetching updateAdminWallet", error);
  throw new CustomError("Unable to fetch updateAdminWallet", 500);
}
}

export const CountTotalPayments = async()=>{
  try {
    const count=await findPaymentCount();
    return count;
  } catch (error) {
    console.error("Error fetching CountTotalPayments", error);
      throw new CustomError("Unable to fetch CountTotalPayments", 500);
  }
}