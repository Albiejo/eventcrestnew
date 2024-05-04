import mongoose from "mongoose";
import Booking, { bookingDocument } from "../Model/Booking"
import vendor from "../Model/Vendor"
import user from "../Model/User";
import { BaseRepository } from "./baseRepository";




class BookingRepository extends BaseRepository<bookingDocument>{

  constructor(){
    super(Booking)
  }



  async findBookingsByVendorId( vendorId: string){
    try {

      const result = await Booking.find({ vendorId: vendorId });
      return result;

    } catch (error) {
      throw error;
    }
  }

  async findBookingsByUserId(userId: string,  skip: number, limit: number){
    try {
      const result = await Booking.find({ userId: userId }).populate('vendorId').skip(skip).limit(limit);
      return result;
    } catch (error) {
      throw error;
    }
  }


  async findBookingsByBookingId( bookingId: string){
    try {
      const result = await Booking.find({ _id: bookingId }).populate('userId').populate('vendorId');
      return result;
    } catch (error) {
      throw error;
    }
  }


  async getfullbookingdetails(){
    try {
      const data  = await Booking.find();
      if(!data){
        throw new Error("Booking details not found");
      }
      return data;
    } catch (error) {
      throw error;
    }
  }


  async updatebookingCancel(bookingId:string , vendorId:string , date:string):Promise<void>{
    try {
      const bookingData = await Booking.findById(bookingId);
      if (!bookingData) {
        throw new Error('Booking not found');
      }

      bookingData.status = 'Cancelled'; 
      bookingData.payment_status = 'Cancelled';
      await bookingData.save();

      await vendor.findByIdAndUpdate(vendorId, {
        $pull: { bookedDates: date }
      });
    } catch (error) {
      throw error;
    }
  }



  async updateBookingStatusById(bookingId: string,status:string,vid:string,userId:string){
    try {

      const result = await Booking.findByIdAndUpdate(bookingId,{$set:{status:status}});

      const vendordata = await vendor.findById(vid)
      
      if(status === 'Accepted'){
        if (vendordata) {
          if (!vendordata.totalBooking) {
              vendordata.totalBooking = 1;
          } else {
              vendordata.totalBooking += 1; 
          }
       }
        await vendordata?.save();
      }


      const userData = await user.findById(userId);
      userData?.notifications.push({
        _id: new mongoose.Types.ObjectId(),
        message:`Your Booking Status with ${vendordata?.name} has been updated.`,
        timestamp: new Date(),
        Read:false
      })
      await userData?.save();

      return {result , userData};
      
    } catch (error) {
      throw error;
    }
  }



 
}


export default new BookingRepository()













