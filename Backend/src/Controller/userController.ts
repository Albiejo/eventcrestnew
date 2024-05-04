import { Request, Response } from "express";
import {
  signup,
  login,
  getUsers,
  toggleUserBlock,
  generateOtpForPassword,
  ResetPassword,
  CheckExistingUSer,
  gLogin,
  googleSignup,
  FavoriteVendor,
  checkCurrentPassword,
  UpdatePasswordService,
  UpdateUserProfile,FavoriteVendors,createRefreshToken,findUser,updateNotification,clearalldata
} from "../Service/userService";

import generateOtp from "../Util/generateOtp";
import { CustomError } from "../Error/CustomError";
import user from "../Model/User";
import Jwt from "jsonwebtoken";
import { json } from "body-parser";
import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import sharp from "sharp";
import crypto from "crypto";
import dotenv from 'dotenv';
import { UserSession } from "../Util/Interfaces";
import { OTP } from "../Util/Interfaces";
import { DecodedData } from "../Util/Interfaces";
import nodemailer from 'nodemailer';
import { ErrorMessages } from "../Util/enums";
import { handleError } from "../Util/handleError";
dotenv.config();




declare module "express-session" {
  interface Session {
    user: UserSession | undefined;
    otp: OTP;
  }
}

//amazon s3 settings
const s3 = new S3Client({
  credentials: {
    accessKeyId:process.env.ACCESS_KEY!,
    secretAccessKey:process.env.SECRET_ACCESS_KEY!,
  },
  region:process.env.BUCKET_REGION!,
});


const randomImage = (bytes = 32) => crypto.randomBytes(bytes).toString("hex");







class UserController{

  async UserSignup(req: Request, res: Response){
    try {

      const { email, password, name, phone } = req.body;
      const otpCode = await generateOtp(email);
      if (otpCode !== undefined) {
        req.session.user = {
          email: email,
          password: password,
          name: name,
          phone: parseInt(phone),
          otpCode: otpCode,
          otpSetTimestamp: Date.now(),
        };
        return res.status(200).json({ message: "OTP send to email for verification..", email: email });
      } else {
        console.log("couldn't generate otp, error occcured ,please fix !!");
        return res
          .status(500)
          .json({
            message: `Server Error couldn't generate otp, error occcured ,please fix !!`,
          });
      }
    } catch (error) {
      handleError(res, error, "UserSignup");
    }
  }




  
  async verifyOtp(req: Request, res: Response): Promise<void> {
    try {
     
      const otp = req.body.otp;
      const userData: UserSession | undefined = req.session.user;
      
      if (!userData) {
        res.status(400).json({ error: "Session data not found. Please sign up again." });
        return;
      }

      const email = userData.email;
      const password = userData.password;
      const name = userData.name;
      const phone = userData.phone;
      if (!userData.otpCode) {
        throw new CustomError("OTP Expired...Try again with new OTP !!", 400);
      }
      const otpCode = userData.otpCode;

      if (otp === otpCode) {
        const user = await signup(email, password, name, phone);

        if (user) {
          delete req.session.user;
        //signup data in session deleted  after storing in DB
          res.status(201).json(user);
        }
      } else {
        res.status(400).json({ message: "Invalid otp !!" });
      }
    } catch (error: any) {
      if (error.code === 11000 && error.keyPattern && error.keyValue) {
        const duplicateField = Object.keys(error.keyPattern)[0];
        const duplicateValue = error.keyValue[duplicateField];
         res
          .status(500)
          .json({
            message: `The ${duplicateField} '${duplicateValue}' is already in use.`,
        });
      } else if (error instanceof CustomError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        console.error(error);
        res.status(500).json({ message: ErrorMessages.ServerError});
      }
    }
  }



  async UserLogin(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const {refreshToken,  token, userData, message } = await login(email, password);
      res.cookie("jwtToken", token, { httpOnly: true });
      return res.status(200).json({ token, userData, message , refreshToken });
    } catch (error) {
      handleError(res, error, "UserLogin");
    }
  }





  async getUser(req: Request, res: Response){
    try {
      
      const userId:string = req.query.userId as string;

      const data = await findUser(userId);
      return res.status(200).json(data);
      
    } catch (error) {
      handleError(res, error, "getUser");
    }
  }






  async UserLogout(req: Request, res: Response){
    try {
      res.clearCookie("jwtToken");
      return  res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
      handleError(res, error, "UserLogout");
    }
  }



  async createRefreshToken(req: Request, res: Response){
    try {
     
      const { refreshToken } = req.body;
      
      const token = await createRefreshToken(refreshToken);
    
      return res.status(200).json({ token });

    } catch (error) {
      handleError(res, error, "createRefreshToken");
    }
  }





  async allUsers(req: Request, res: Response){
    try {
      const { page = 1, limit = 10, search = "" } = req.query;
      const pageNumber = parseInt(page as string, 10);
      const limitNumber = parseInt(limit as string, 10);
      const users = await getUsers(pageNumber, limitNumber, search.toString());
      return res.status(200).json({ users, pageNumber });
    } catch (error) {
      handleError(res, error, "get allUsers");
    }
  }




  async Toggleblock(req: Request, res: Response){
    try {
      const userId: string | undefined = req.query.userId as string | undefined;
      if (!userId) {
        throw new Error("User ID is missing or invalid.");
      }

      await toggleUserBlock(userId);
      const User = await user.findById(userId);

      return res.status(200).json({ message: "User block status updated." });
    } catch (error) {
      handleError(res, error, "Toggleblock user block");
    }
  }



  async UserForgotPassword(req: Request, res: Response){
    try {
      const email = req.body.email;
      const user = await CheckExistingUSer(email);
      if (user) {
        const otp = await generateOtpForPassword(email);
        req.session.otp = {
          otp: otp,
          email: email,
          otpSetTimestamp: Date.now(),
        };
        return res.status(200).json({ message: "OTP sent to email",email: email});
      } else {
        return res.status(400).json({ error: "Email not Registered with us !!" });
      }
    } catch (error) {
      handleError(res, error, "UserForgotPassword");
    }
  }




  async VerifyOtpForPassword(req: Request, res: Response){
    try {
      const ReceivedOtp = req.body.otp;
      const generatedOtp = req.session.otp?.otp;

      if (!req.session.otp) {
        throw new CustomError("OTP Expired.Try again.", 400);
      }

      if (ReceivedOtp === generatedOtp) {
        console.log("otp is correct , navigating user to update password.");
        return res.status(200).json({ data: "otp is correct" });
      } else {
        throw new CustomError("Invalid OTP !!", 400);
      }
    } catch (error) {
      handleError(res, error, "VerifyOtpForPassword");
    }
  }



  async ResetUserPassword(req: Request, res: Response){
    try {
      const password = req.body.password;
      const confirmPassword = req.body.confirm_password;
      if (password === confirmPassword) {
        const email = req.session.otp.email;
        await ResetPassword(password, email);
        return res.status(200).json({ message: "Password reset successfully." });
      } else {
        return res.status(400).json({ error: "Passwords do not match." });
      }
    } catch (error) {
      handleError(res, error, "ResetUserPassword");
    }
  }



  async ResendOtp(req: Request, res: Response){
    try {
      
      const userData: UserSession | undefined = req.session.user;
      console.log("userData", userData);

      
      if (!userData) {
        return res.status(400).json({ error: "Session data not found. Please sign up again." });
        console.log("no session data found");

      }
      const email = userData.email;
      const newOtp = await generateOtp(email);
      if (!email) {
        return  res.status(400).json({ error: "Email not found in session data." });
      }

      if (req.session.user) {
        req.session.user.otpCode = newOtp;
      } else {
        console.error("Session user data is unexpectedly undefined.");
        return  res.status(500).json({ message:"Server Error: Session user data is unexpectedly undefined." });

      }
      console.log("user session after resend" , req.session.user);
      return  res.status(200).json({ message: "New OTP sent to email" });
    } catch (error) {
      handleError(res, error, "ResendOtp");
    }
  }



  async UseGoogleLogin(req: Request, res: Response) {
    try {
      const decodeInfo = Jwt.decode(req.body.credential) as DecodedData | null;
      if (!decodeInfo) {
        return res.status(400).json({ error: "Invalid credentials" });
      }
      const { email, jti } = decodeInfo;
      const password = jti;
      const { token, userData, message } = await gLogin(email, password);
      req.session.user = userData._id;
      res.cookie("jwtToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });
      res.status(200).json({ token, userData, message });
    } catch (error) {
      handleError(res, error, "UseGoogleLogin");
    }
  }



  async UseGoogleRegister(req: Request, res: Response) {
    try {
      const token = req.body.credential;
      const decodedInfo = Jwt.decode(req.body.credential);

      const { name, email, jti }: DecodedData = decodedInfo as DecodedData;
      const user = await googleSignup(email, jti, name);
      if (user) {
        res.status(200).json({ message: "User account registered .." });
      }
    } catch (error) {
      handleError(res, error, "UseGoogleRegister");
    }
  }



  async passwordResendOtp(req: Request, res: Response): Promise<void> {
    try {
      const otp: OTP | undefined = req.session.otp;
      if (!otp) {
        res
          .status(400)
          .json({ error: "Session data not found. Please sign up again." });
        return;
      }
      const email = otp.email;
      const newOtp = await generateOtp(email);
      if (req.session.otp) {
        req.session.otp.otp = newOtp;
      } else {
        console.error("session data is undefined..");
        res
          .status(500)
          .json({ message: "Server Error , session data is undefined.. " });
        return;
      }
    } catch (error) {
      handleError(res, error, "passwordResendOtp");
    }
  }



  async AddFavVendor(req: Request, res: Response){
    try {

      const {vendorId , userId} = req.query;

      if (!vendorId) {
        return res.status(400).json({ error: "Invalid vendor id." });
      }
      if (!userId) {
        return res.status(400).json({ message: "Invalid user id." });
      }
    
      
      const data = await FavoriteVendor(vendorId as string, userId as string);

     
      return  res.status(200).json({ data: data});
      
    } catch (error) {
      handleError(res, error, "AddFavVendor");
    }
  }




  async getFavoriteVendors(req: Request, res: Response){
    try {
      const userId: string = req.query.userid as string;
      const page: number = parseInt(req.query.page as string) || 1; 
      const pageSize: number = parseInt(req.query.pageSize as string) || 8;

      if (!userId) {
        return res.status(400).json({ error: "Invalid user id." });
      }
      const {favoriteVendors , totalFavVendorsCount} = await FavoriteVendors( userId , page, pageSize);
      const totalPages = Math.ceil(totalFavVendorsCount / pageSize);

      if (favoriteVendors) {
        return res.status(200).json({ data:favoriteVendors ,totalPages:totalPages });
      } else {
        return res.status(400).json({ message: "No vendors in favorites." });
      }

    } catch (error) {
      handleError(res, error, "getFavoriteVendors");
    }
  }




  async UpdatePasswordController(req: Request, res: Response){
    
    try {

      const currentPassword = req.body.current_password;
      const newPassword = req.body.new_password;

      const userId: string = req.query.userid as string;


      let status = await checkCurrentPassword(currentPassword, userId);

      if (!status) {
        return  res.status(400).json({ error: `Current password doesn't match` });
        
      }      
      const data = await UpdatePasswordService(newPassword , userId);

      if(!data){
        return  res.status(400).json({error:"couldn't update password..internal error."})
      }
      return res.status(200).json({message:"password updated successfully.."})

    } catch (error) {
      handleError(res, error, "UpdatePasswordController user");
    }
  }
  




  async UpdateProfileDetails(req: Request, res: Response): Promise<void> {
  try {
    const name = req.body.name;
    const phone = parseInt(req.body.phone);
    const userid:string = req.query.userid as string;

  
    let imageName = "";
    let imageUrl="";

    if (req.file) {
      
      const buffer = await sharp(req.file?.buffer)
        .resize({ height: 1200, width: 1200, fit: "contain" })
        .toBuffer();

        imageName = randomImage();

      const params = {
        Bucket: process.env.BUCKET_NAME!,
        Key: imageName,
        Body: buffer,
        ContentType: req.file?.mimetype,
      };

      const command2 = new PutObjectCommand(params);
      await s3.send(command2);


      const getObjectParams={
        Bucket: process.env.BUCKET_NAME!,
        Key:imageName
      }

      const command = new GetObjectCommand(getObjectParams);

      imageUrl = await getSignedUrl(s3, command , {
          expiresIn: 86400 * 3,
        });
      
    }


    const data = await UpdateUserProfile(userid, name, phone, imageName,imageUrl,);
    
    if(!data){
      res.status(400).json({error:`couldn't update details..try after soem time`});
    }
    res.status(200).json({message:"Profile details updated successfully" , data:data})
    
  } catch (error) {
    handleError(res, error, "UpdateProfileDetails");
  }
  }




  async MarkRead(req: Request, res: Response): Promise<void> {
    try {
      const {userId , notifiId} = req.query;
      const data  = await updateNotification(userId as string ,notifiId as string );
      if(data){
         res.status(200).json({data:data});
      }
    } catch (error) {
      handleError(res, error, "MarkRead");
    }
  }


  async subscribe(req: Request, res: Response){
    try {
      const { email } = req.body;
    
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: process.env.USER_NAME,
            pass: process.env.USER_PASSWORD,
        },
        tls: {
            rejectUnauthorized: false 
        }
    });

    const mailOptions = {
        from: process.env.USER_NAME,
        to: email,
        subject: "NEWS-LETTER",
        text: `Congrats for subscribing to Event Crest newsletter ! , You wll receive a newsletter from  event crest every week`,
    };

    const info = await transporter.sendMail(mailOptions);
     return res.status(200).json({ success: true });
    } catch (error) {
      handleError(res, error, "subscribe");
    }
  }



  async clearAllNotifications(req: Request, res: Response): Promise<void>{
    try {
      const userid:string  = req.query.userId as string; 
      const data  = await clearalldata(userid)
      res.status(200).json(data)
    } catch (error) {
      handleError(res, error, "clearAllNotifications");
    }
  }
};

export default new UserController();

