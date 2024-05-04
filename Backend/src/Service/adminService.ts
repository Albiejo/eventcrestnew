import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import admin from "../Model/Admin";
import { CustomError } from "../Error/CustomError";
import { AdminRepository } from "../Repository/adminRepository";
import { AdminDocument } from "../Model/Admin";

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
     
          refreshToken = jwt.sign({ _id: existingAdmin._id }, process.env.JWT_REFRESH_SECRET!, { expiresIn: "7d" });
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
        throw new CustomError("Unable to fetch login", 500);
      }
    }


    async createRefreshTokenAdmin(refreshToken: string) {
      try {

        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { _id: string };

        const Admin = await this.adminRepository.getById(decoded._id);
  
        if (!Admin || Admin.refreshToken !== refreshToken) {
          throw new Error("Invalid refresh token");
        }
  
        const accessToken = jwt.sign({ _id: Admin._id }, process.env.JWT_SECRET!, { expiresIn: '24h' });
        return accessToken;
      } catch (error) {
        console.error("Error fetching createRefreshTokenAdmin", error);
        throw new CustomError("Unable to fetch createRefreshTokenAdmin", 500);
      }
    }
    

    async getDatas(adminId: string): Promise<AdminDocument | null> {
      try {
        const result = await this.adminRepository.getById(adminId);
        return result;
      } catch (error) {
        console.error("Error fetching getDatas", error);
        throw new CustomError("Unable to fetch getDatas", 500);
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
        throw new CustomError("Unable to fetch updateNotification", 500);
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
        throw new CustomError("Unable to fetch countNotification", 500);
      }
    }

  }

  export default new AdminService();



