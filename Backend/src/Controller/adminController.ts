import { Request, Response } from "express";
import { CustomError } from "../Error/CustomError";
import { ErrorMessages } from "../Util/enums";
import adminService from "../Service/adminService";
import moment from "moment";
import Payment from "../Model/Payment";
import { handleError } from "../Util/handleError";


function getCurrentWeekRange() {
  const startOfWeek = moment().startOf("isoWeek").toDate();
  const endOfWeek = moment().endOf("isoWeek").toDate();
  return { startOfWeek, endOfWeek };
}

// Function to get current year range
function getCurrentYearRange() {
  const startOfYear = new Date(new Date().getFullYear(), 0, 1);
  const endOfYear = new Date(new Date().getFullYear() + 1, 0, 1);
  return { startOfYear, endOfYear };
}

// Function to calculate the last five years' range
function getLastFiveYearsRange() {
  const currentYear = new Date().getFullYear();
  const startOfFiveYearsAgo = new Date(currentYear - 5, 0, 1);
  const endOfCurrentYear = new Date(currentYear + 1, 0, 1);
  return { startOfFiveYearsAgo, endOfCurrentYear };
}

class AdminController {
  
  async Adminlogin(req: Request, res: Response){
    try {
      const { email, password } = req.body;
      const {refreshToken ,  token, adminData, message } = await adminService.login(email, password);
      
      res.cookie('jwtToken', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
      console.log("testing");
      return res.status(200).json({token, refreshToken , adminData, message });
      
    } catch (error) {
      handleError(res, error, "Adminlogin");
    }
  }

  async Adminlogout(req: Request, res: Response){
    try {
      res.clearCookie('jwtToken');
      return  res.status(200).json({ message: "admin logged out successfully.." });
    } catch (error) {
      handleError(res, error, "Adminlogout");;
    }
  }


  async createRefreshToken(req: Request, res: Response){
    try {
     
      const { refreshToken } = req.body;

      const token = await adminService.createRefreshTokenAdmin(refreshToken);
      
      return  res.status(200).json({ token });
    } catch (error) {
      handleError(res, error, "createRefreshToken");
    }
  }

  async getFulldetails (req: Request, res: Response){
    try {
      const adminId:string = req.query.adminId as string;
      const adminData = await adminService.getDatas(adminId)
      return res.status(200).json({data:adminData});
    } catch (error) {
      handleError(res, error, "getFulldetails");
    }
  }

  
  async MarkasRead(req: Request, res: Response){
    try {
      const {id ,notifid} = req.query;
      const data  = await adminService.updateNotification(id as string,notifid as string)
      return res.status(200).json({data:data});
    } catch (error) {
      handleError(res, error, "MarkasRead");
    }
  }

  async countNotifications(req: Request, res: Response){
    try {
      const adminId:string = req.query.adminId as string;
      const data  = await adminService.countNotification(adminId)
      return res.status(200).json({data:data});
    } catch (error) {
      handleError(res, error, "MarkasRead");
    }
  }


  async getRevenue(req: Request, res: Response): Promise<void> {
    try {
      const dateType = req.query.date as string;
      let start,
        end,
        groupBy,
        sortField,
        arrayLength = 0;

      switch (dateType) {
        case "week":
          const { startOfWeek, endOfWeek } = getCurrentWeekRange();
          start = startOfWeek;
          end = endOfWeek;
          groupBy = { day: { $dayOfMonth: "$createdAt" } }; // Group by day
          sortField = "day"; // Sort by day
          arrayLength = 7;
          break;
        case "month":
          const { startOfYear, endOfYear } = getCurrentYearRange();
          start = startOfYear;
          end = endOfYear;
          groupBy = { month: { $month: "$createdAt" } }; // Group by month
          sortField = "month"; // Sort by month
          arrayLength = 12;
          break;
        case "year":
          const { startOfFiveYearsAgo, endOfCurrentYear } =
            getLastFiveYearsRange();
          start = startOfFiveYearsAgo;
          end = endOfCurrentYear;
          groupBy = { year: { $year: "$createdAt" } }; // Group by year
          sortField = "year"; // Sort by year
          arrayLength = 5;
          break;
        default:
          res.status(400).json({ message: "Invalid date parameter" });
          return;
      }

      const revenueData = await Payment.aggregate([
        {
          $match: {
            createdAt: {
              $gte: start,
              $lt: end,
            },
          },
        },
        {
          $group: {
            _id: groupBy,
            totalRevenue: { $sum: "$amount" },
          },
        },
        {
          $sort: { [`_id.${sortField}`]: 1 },
        },
      ]);
      const revenueArray = Array.from({ length: arrayLength }, (_, index) => {
        const item = revenueData.find((r) => {
          if (dateType === "week") {
            return r._id.day === index + 1;
          } else if (dateType === "month") {
            return r._id.month === index + 1;
          } else if (dateType === "year") {
            return (
              r._id.year ===
              new Date().getFullYear() - (arrayLength - 1) + index
            );
          }
          return false;
        });
        return item ? item.totalRevenue : 0; // Default to 0 if no data for the expected index
      });

      res.status(200).json({ revenue: revenueArray });
    } catch (error) {
      handleError(res, error, "getRevenue");
    }
  }

};


export default new AdminController();



