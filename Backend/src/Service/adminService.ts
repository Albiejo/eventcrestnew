import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import admin from "../Model/Admin";
import { CustomError } from "../Error/CustomError";
import { AdminRepository } from "../Repository/adminRepository";
import { AdminDocument } from "../Model/Admin";
import { Notification } from "../Util/Interfaces";
import mongoose from "mongoose";



interface LoginResponse {
    token: string;
    adminData: object; 
    message: string;
    refreshToken:string;

  }

  class AdminService {

    private adminRepository: AdminRepository;

    constructor() {
      this.adminRepository = new AdminRepository();
    }


    async login(email: string, password: string): Promise<LoginResponse> {
      try {
        const existingAdmin = await this.adminRepository.findByEmail(email);
       
        if (!existingAdmin) {
          throw new CustomError("Admin not exist", 400);
        }
  
        const passwordMatch = await bcrypt.compare(
          password,
          existingAdmin.password
        );
        if (!passwordMatch) {
          throw new CustomError("Incorrect password...", 401);
        }
  
        let refreshToken = existingAdmin.refreshToken;
  
        if (!refreshToken) {
     
          refreshToken = jwt.sign({ _id: existingAdmin._id }, process.env.JWT_REFRESH_SECRET!, { expiresIn: "10d" });
        }
  
        existingAdmin.refreshToken = refreshToken;
        await existingAdmin.save();
  
        const token = jwt.sign({ _id: existingAdmin._id }, process.env.JWT_SECRET!, { expiresIn: '24h'});
  
        return {
          refreshToken,
          token,
          adminData: existingAdmin,
          message: "Successfully logged in..",
        };
      } catch (error) {
        console.error("Error fetching login", error);
        throw error;
      }
    }


    async createRefreshTokenAdmin(refreshToken: string) {
      try {
       
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { _id: string };

        const Admin = await this.adminRepository.getById(decoded._id);
  
        if (!Admin || Admin.refreshToken !== refreshToken) {
          throw new Error("some token issue occured ,  please login again");
        }
  
        const accessToken = jwt.sign({ _id: Admin._id }, process.env.JWT_SECRET!, { expiresIn: '1m' });
        console.log("new access token created :",accessToken)
        return accessToken;
      } catch (error) {
        console.error("Error fetching RefreshTokenAdmin", error);
        throw error;
      }
    }
    

    async getDatas(adminId: string): Promise<AdminDocument | null> {
      try {
        const result = await this.adminRepository.getById(adminId);
        return result;
      } catch (error) {
        console.error("Error fetching admindata", error);
        throw new CustomError("Unable to fetch admindata , please login again.", 500);
      }
    }

    async updateNotification(adminId:string, notifiID:string):Promise<object>{
      try {
        let adminData = await this.adminRepository.getById(adminId);
        if (!adminData) {
          throw new Error('admin not found');
        }

        const notification = adminData.notifications.find((notif) => notif._id.toString() === notifiID);
        if (!notification) {
          throw new Error('Notification not found');
        }

        notification.Read = !notification.Read;
        await adminData.save();
        adminData = await this.adminRepository.getById(adminId);

        const message = notification.Read ? 'Notification marked as read' : 'Notification marked as unread';
        return {message:message , adminData:adminData}
      } catch (error) {
        console.error("Error fetching updateNotification", error);
        throw error
      }
    }

    async countNotification(adminId:string):Promise<object>{
      try {
        let adminData = await this.adminRepository.getById(adminId);
        if (!adminData) {
          throw new Error('admin not found');
        }

        const notification = adminData.notifications.length
      
        return {notification};
      } catch (error) {
        console.error("Error fetching countNotification", error);
        throw error;
      }
    }

    async clearalldata(adminId:string):Promise<object>{
      try {
        let adminData = await admin.findById(adminId);
        if (!adminData) {
          throw new Error('Admin not found');
        }
        adminData.notifications = [];
        await adminData.save();
        adminData=await admin.findById(adminId);
        return {adminData:adminData};
      } catch (error) {
          console.error("Error fetching admin clearall notifications", error);
          throw error;
      }

  }

  async createAnotherAdmin(email:string , password:string):Promise<object>{
    try {
      const existingAdmin = await this.adminRepository.findByEmail(email);

      if(existingAdmin){
        throw new CustomError("oops , this admin already exists !!" , 400)
      }
      
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const isAdmin: boolean = true;
      const Wallet = 0;
      const newAdmin = this.adminRepository.create({email , password:hashedPassword ,isAdmin ,Wallet})
      if(!newAdmin){
        throw new CustomError("some issue at creating admin , try after some time" , 400);
      }
      return newAdmin;

    } catch (error) {
      console.error("error creating admin by admin itself : " , error);
      throw error;
    }
  }


  async GetAllAdminDetails(){
    try {
      const adminDetails =  await admin.find();
      return adminDetails;
    } catch (error) {
      console.error("Error fetching all admin details", error);
      throw error;
    }
  }



  async DeleteAdmin(Id:string){
    try {
      const status = await admin.deleteOne({_id:Id});
      return status;
    } catch (error) {
      console.error("Error deleting admin :", error);
      throw error;
    }
  }




}

  export default new AdminService();



