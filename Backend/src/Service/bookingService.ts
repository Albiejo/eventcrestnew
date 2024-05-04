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
      throw new CustomError("Unable to fetch checkIfDatePresent", 500);
    }
  }

  async addABooking(eventName:string, name:string, city:string,date:string,pin:number,mobile:number,vendorId:string,userId:string){
    try {
        const vendorIdObjectId =new mongoose.Types.ObjectId(vendorId) as unknown as mongoose.Schema.Types.ObjectId;
        const userIdObjectId=new mongoose.Types.ObjectId(userId) as unknown as mongoose.Schema.Types.ObjectId;
        const booking= await bookingRepository.create({eventName, name, city,date,pin,mobile, vendorId:vendorIdObjectId,userId:userIdObjectId});

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
      console.error("Error fetching addABooking", error);
      throw new CustomError("Unable to fetch addABooking", 500);
    }
  }

  async getAllBookingsByUser(userId:string , skip: number, limit: number):Promise<bookingDocument[]>{
    try{
      const bookings=await bookingRepository.findBookingsByUserId(userId , skip, limit)
      return bookings;
    } catch (error) {
      console.error("Error fetching getAllBookingsByUser", error);
      throw new CustomError("Unable to fetch getAllBookingsByUser", 500);
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
      console.error("Error fetching acquireLockForDate", error);
      throw new CustomError("Unable to fetch acquireLockForDate", 500);
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
      console.error("Error fetching releaseLockForDate", error);
      throw new CustomError("Unable to fetch releaseLockForDate", 500);
    }
  }

  async getAllBookingsByVendor(vendorId:string):Promise<bookingDocument[]>{
    try{
      const bookings=await bookingRepository.findBookingsByVendorId(vendorId)
      return bookings;
    } catch (error) {
      console.error("Error fetching getAllBookingsByVendor", error);
      throw new CustomError("Unable to fetch getAllBookingsByVendor", 500);
    }
  }


  async getAllBookingsById(bookingId:string):Promise<bookingDocument|{}>{
    try{
      const bookings=await bookingRepository.findBookingsByBookingId(bookingId)
      return bookings;
    } catch (error) {
      console.error("Error fetching getAllBookingsById", error);
      throw new CustomError("Unable to fetch getAllBookingsById", 500);
    }
  }


  async updateStatusById(bookingId:string,status:string , vid:string , userId:string){
    try{
      const bookings=await bookingRepository.updateBookingStatusById(bookingId,status , vid, userId)
      return bookings;
    } catch (error) {
      console.error("Error fetching updateStatusById", error);
      throw new CustomError("Unable to fetch updateStatusById", 500);
    }
  }


  async countTotalBookingsByUser(userId: string){
    try {
      const totalBookings = await Booking.countDocuments({ userId: userId });
      return totalBookings;
    } catch (error) {
      console.error("Error fetching countTotalBookingsByUser", error);
      throw new CustomError("Unable to fetch countTotalBookingsByUser", 500);
    }
  }


  async MarkBookingCancel(bookingId:string , vendorId:string , date:string){
    try {
      const result = await bookingRepository.updatebookingCancel(bookingId , vendorId , date);
      return result
    } catch (error) {
      console.error("Error fetching MarkBookingCancel", error);
      throw new CustomError("Unable to fetch MarkBookingCancel", 500);
    }
    }


    async getAllBookings(){
      try {
        const data = await bookingRepository.getfullbookingdetails();
        return data;
      } catch (error) {
        console.error("Error fetching getAllBookings", error);
        throw new CustomError("Unable to fetch getAllBookings", 500);
      }
    }
}


export default new bookingService();


