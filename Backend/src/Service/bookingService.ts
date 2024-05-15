import mongoose from "mongoose";
import Booking , { bookingDocument } from "../Model/Booking";
import bookingRepository from "../Repository/bookingRepository";
import vendor from "../Model/Vendor"
import { CustomError } from "../Error/CustomError";




class bookingService{

  async checkIfDatePresent(vendorId:string , date:string):Promise<boolean>{
    try {
      const vendorData = await vendor.findById(vendorId);
      if (!vendorData) {
        throw new Error('Vendor not found');
      }
      const isBooked = vendorData.bookedDates.includes(date);
      return isBooked? true : false;
    } catch (error) {
      console.error("Error fetching checkIfDatePresent", error);
      throw new CustomError("unable to check Booking dates  now , try after some time" , 400);
    }
  }

  async addABooking(eventName:string, name:string, venue:string,date:string,pin:number,mobile:number,vendorId:string,userId:string){
    try {
        const vendorIdObjectId =new mongoose.Types.ObjectId(vendorId) as unknown as mongoose.Schema.Types.ObjectId;
        const userIdObjectId=new mongoose.Types.ObjectId(userId) as unknown as mongoose.Schema.Types.ObjectId;
        const booking= await bookingRepository.create({eventName, name, venue,date,pin,mobile, vendorId:vendorIdObjectId,userId:userIdObjectId});

        await vendor.findByIdAndUpdate(vendorId, {
          $push: { bookedDates: date },
        }); 
        
        const vendorData  = await vendor.findById(vendorId);
        if(!vendorData){
          throw Error;
        }

        vendorData.notifications.push({
          _id: new mongoose.Types.ObjectId(),
          message:"New Event Booked, check bookings tab for more details !",
          timestamp: new Date() ,
          Read:false
        })

        await vendorData.save()

        return booking;

    } catch (error) {
      console.error("Error fetching add Booking", error);
      throw new CustomError("unable to process Booking now , try after some time" , 400);
    }
  }

  async getAllBookingsByUser(userId:string , skip: number, limit: number):Promise<bookingDocument[]>{
    try{
      const bookings=await bookingRepository.findBookingsByUserId(userId , skip, limit)
      return bookings;
    } catch (error) {
      console.error("Error fetching get All Bookings By User", error);
      throw new CustomError("unable to get Bookings now , try after some time" , 400);
    }
  }

  async acquireLockForDate(vendorId: string, date: string): Promise<void>{
    try {
      const vendorData = await vendor.findById(vendorId);
     
      if (!vendorData) {
        throw new Error("Vendor not found");
      }
  
      const existingLock = vendorData.locks.find(lock => lock.date === date);
     
      if (existingLock && existingLock.isLocked) {
        throw new Error('Date is already locked');
      }
  
      vendorData.locks.push({
        date: date,
        isLocked: true
      });
      
      await vendorData.save();

    } catch (error) {
      console.error("Error fetching acquire Lock For Date in booking", error);
      throw new CustomError("unable to process Booking now , try after some time" , 400);

    }
  }

  async releaseLockForDate(vendorId: string, date: string): Promise<void>{
    try {

      const vendorData = await vendor.findById(vendorId);
     
      if (!vendorData) {
        throw new Error("Vendor not found");
      }
  
      const lockIndex = vendorData.locks.findIndex(lock => lock.date === date);
  
  
      if (lockIndex !== -1) {
        vendorData.locks.splice(lockIndex, 1);
        await vendorData.save();
      }
    } catch (error) {
      console.error("Error fetching release Lock For Date in booking", error);
      throw new CustomError("unable to process Booking now , try after some time" , 400);
    }
  }

  async getAllBookingsByVendor(vendorId:string):Promise<bookingDocument[]>{
    try{
      const bookings=await bookingRepository.findBookingsByVendorId(vendorId)
      return bookings;
    } catch (error) {
      console.error("Error fetching get All Bookings  By Vendor", error);
      throw new CustomError("unable to get Bookings now , try after some time" , 400);
    }
  }


  async getAllBookingsById(bookingId:string):Promise<bookingDocument|{}>{
    try{
      const bookings=await bookingRepository.findBookingsByBookingId(bookingId)
      return bookings;
    } catch (error) {
      console.error("Error fetching get All Bookings By Id", error);
      throw new CustomError("unable to get Bookings now , try after some time" , 400);
    }
  }


  async updateStatusById(bookingId:string,status:string , vid:string , userId:string){
    try{
      const bookings=await bookingRepository.updateBookingStatusById(bookingId,status , vid, userId)
      return bookings;
    } catch (error) {
      console.error("Error fetching update booking Status By Id", error);
      throw new CustomError("unable to update Booking now , try after some time" , 400);
    }
  }


  async countTotalBookingsByUser(userId: string){
    try {
      const totalBookings = await Booking.countDocuments({ userId: userId });
      return totalBookings;
    } catch (error) {
      console.error("Error fetching count Total bookings By User", error);
      throw new CustomError("unable to count Bookings now , try after some time" , 400);
    }
  }


  async MarkBookingCancel(bookingId:string , vendorId:string , date:string){
    try {
      const result = await bookingRepository.updatebookingCancel(bookingId , vendorId , date);
      return result
    } catch (error) {
      console.error("Error procesing booking cancellation", error);
      throw new CustomError("unable to update Booking now , try after some time" , 400);
    }
    }


    async getAllBookings(){
      try {
        const data = await bookingRepository.getfullbookingdetails();
        return data;
      } catch (error) {
        console.error("Error fetching getAllBookings", error);
        throw new CustomError("unable to get Bookings now , try after some time" , 400);
      }
    }
}


export default new bookingService();


