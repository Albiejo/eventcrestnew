"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const CustomError_1 = require("../Error/CustomError");
const adminRepository_1 = require("../Repository/adminRepository");
class AdminService {
    constructor() {
        this.adminRepository = new adminRepository_1.AdminRepository();
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingAdmin = yield this.adminRepository.findByEmail(email);
                if (!existingAdmin) {
                    throw new CustomError_1.CustomError("Admin not exist", 400);
                }
                const passwordMatch = yield bcrypt_1.default.compare(password, existingAdmin.password);
                if (!passwordMatch) {
                    throw new CustomError_1.CustomError("Incorrect password...", 401);
                }
                let refreshToken = existingAdmin.refreshToken;
                if (!refreshToken) {
                    refreshToken = jsonwebtoken_1.default.sign({ _id: existingAdmin._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
                }
                existingAdmin.refreshToken = refreshToken;
                yield existingAdmin.save();
                const token = jsonwebtoken_1.default.sign({ _id: existingAdmin._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
                return {
                    refreshToken,
                    token,
                    adminData: existingAdmin,
                    message: "Successfully logged in..",
                };
            }
            catch (error) {
                console.error("Error fetching login", error);
                throw new CustomError_1.CustomError("Unable to fetch login", 500);
            }
        });
    }
    createRefreshTokenAdmin(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
                const Admin = yield this.adminRepository.getById(decoded._id);
                if (!Admin || Admin.refreshToken !== refreshToken) {
                    throw new Error("Invalid refresh token");
                }
                const accessToken = jsonwebtoken_1.default.sign({ _id: Admin._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
                return accessToken;
            }
            catch (error) {
                console.error("Error fetching createRefreshTokenAdmin", error);
                throw new CustomError_1.CustomError("Unable to fetch createRefreshTokenAdmin", 500);
            }
        });
    }
    getDatas(adminId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.adminRepository.getById(adminId);
                return result;
            }
            catch (error) {
                console.error("Error fetching getDatas", error);
                throw new CustomError_1.CustomError("Unable to fetch getDatas", 500);
            }
        });
    }
    updateNotification(adminId, notifiID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let adminData = yield this.adminRepository.getById(adminId);
                if (!adminData) {
                    throw new Error('admin not found');
                }
                const notification = adminData.notifications.find((notif) => notif._id.toString() === notifiID);
                if (!notification) {
                    throw new Error('Notification not found');
                }
                notification.Read = !notification.Read;
                yield adminData.save();
                adminData = yield this.adminRepository.getById(adminId);
                const message = notification.Read ? 'Notification marked as read' : 'Notification marked as unread';
                return { message: message, adminData: adminData };
            }
            catch (error) {
                console.error("Error fetching updateNotification", error);
                throw new CustomError_1.CustomError("Unable to fetch updateNotification", 500);
            }
        });
    }
    countNotification(adminId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let adminData = yield this.adminRepository.getById(adminId);
                if (!adminData) {
                    throw new Error('admin not found');
                }
                const notification = adminData.notifications.length;
                return { notification };
            }
            catch (error) {
                console.error("Error fetching countNotification", error);
                throw new CustomError_1.CustomError("Unable to fetch countNotification", 500);
            }
        });
    }
}
exports.default = new AdminService();
