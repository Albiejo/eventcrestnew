import { Request, Response } from "express";
import moment from 'moment';
import { ErrorMessages } from "../Util/enums";
import { CustomError } from "../Error/CustomError";
import bookingService from "../Service/bookingService";
import { handleError } from "../Util/handleError";




class BookingController{

    async bookAnEvent(req: Request, res: Response){
        try {
            const { vendorId, userId }: { vendorId: string; userId: string } = req.query as { vendorId: string; userId: string };
            const { eventName, name, city }: { eventName: string; name: string; city: string } = req.body;          
            const date = moment(req.body.date).format('DD-MM-YYYY');
            const pin=parseInt(req.body.pin);
            const mobile=parseInt(req.body.mobile);

            const DateAlreadyBooked  = await bookingService.checkIfDatePresent(vendorId , date );
            
            if(DateAlreadyBooked){
              return res.status(400).json({message:"Sorry this date is not available!"});
            }else{
              try {
                    
                    await bookingService.acquireLockForDate(vendorId, date);

                    const booking = await bookingService.addABooking(eventName, name, city,date,pin,mobile,vendorId,userId);
                    
                    await bookingService.releaseLockForDate(vendorId, date);

                    return res.status(201).json({booking:booking,message:"Booking done Successfully"});
              } catch (error) {
                    console.error("Error acquiring lock:", error);
                    return res.status(400).json({ message: "Sorry, this date is currently not available." });
              }        
            }
          } catch (error) {
            handleError(res, error, "bookAnEvent");
          }
    }


    async getBookingsByUser(req: Request, res: Response){
        try {
        
          const userId: string = req.query.userId as string;

          const page: number = parseInt(req.query.page as string) || 1; 
          const pageSize: number = parseInt(req.query.pageSize as string) || 10; 
          const skip = (page - 1) * pageSize; 
          
          const totalBookings = await bookingService.countTotalBookingsByUser(userId);
          const totalPages = Math.ceil(totalBookings / pageSize);


          const bookings = await bookingService.getAllBookingsByUser(userId , skip, pageSize);
          
         return res.status(201).json({bookings , totalPages });
        } catch (error) {
          handleError(res, error, "getBookingsByUser");
        }
      }



      async getAllBookingsbyvendor(req: Request, res: Response){
        try {
          const vendorId: string = req.query.vendorId as string;
          const bookings = await bookingService.getAllBookingsByVendor(vendorId);
          return res.status(201).json({bookings});
        } catch (error) {
          handleError(res, error, "getAllBookingsbyvendor");
        }
      }



      async getBookingsById(req: Request, res: Response){
        try {
          const bookingId: string = req.query.bookingId as string;
          const bookings = await bookingService.getAllBookingsById(bookingId);
          return res.status(201).json({bookings});
        } catch (error) {
          handleError(res, error, "getBookingsById");
        }
      }
   

      async updateStatus(req: Request, res: Response){
        try {
          const userId  :string = req.query.userId as string;
          const bookingId: string = req.query.bookingId as string;
          const vendorid : string = req.query.vid as string;
          const status=req.body.status

          const bookings = await bookingService.updateStatusById(bookingId,status ,vendorid , userId);
          return res.status(201).json(bookings);
        } catch (error) {
          handleError(res, error, "updateStatus");
        }
      }


      async cancelBooking(req: Request, res: Response){
        try {
          const date:string = req.body.date as string; 
          const {bookingId ,vendorId } =  req.query;
          const data = await bookingService.MarkBookingCancel(bookingId as string , vendorId as string , date);
          return  res.status(200).json({data:data});
        } catch (error) {
          handleError(res, error, "cancelBooking");
        }
      }


      async getallBookings(req: Request, res: Response){
        try {
          const bookings = await bookingService.getAllBookings();
          return res.status(201).json({bookings});
        } catch (error) {
          handleError(res, error, "getallBookings");
        }
      }
}

export default new BookingController();
