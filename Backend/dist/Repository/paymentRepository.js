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
exports.updateAdminWalletAmount = exports.findPaymentCount = exports.findAllPayments = exports.createNewPaymnet = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Booking_1 = __importDefault(require("../Model/Booking"));
const Payment_1 = __importDefault(require("../Model/Payment"));
const Admin_1 = __importDefault(require("../Model/Admin"));
const createNewPaymnet = (paymentData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingPayment = yield Payment_1.default.findOne({ bookingId: paymentData.bookingId });
        if (existingPayment) {
            return existingPayment;
        }
        const result = yield Payment_1.default.create(paymentData);
        yield Booking_1.default.findByIdAndUpdate(paymentData.bookingId, { $set: { payment_status: "Completed" } });
        return result;
    }
    catch (error) {
        throw error;
    }
});
exports.createNewPaymnet = createNewPaymnet;
const findAllPayments = (skip, limit) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield Payment_1.default.find().populate('userId').populate('vendorId').populate('bookingId').skip(skip).limit(limit);
        const Admin = yield Admin_1.default.find();
        const AdminData = Admin[0];
        return { result, AdminData };
    }
    catch (error) {
        throw error;
    }
});
exports.findAllPayments = findAllPayments;
const findPaymentCount = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const count = yield Payment_1.default.countDocuments();
        return count;
    }
    catch (error) {
        throw error;
    }
});
exports.findPaymentCount = findPaymentCount;
const updateAdminWalletAmount = (amount) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admindata = yield Admin_1.default.find();
        if (!admindata) {
            throw new Error("admin not found");
        }
        const Admin = admindata[0];
        if (!Admin.Wallet) {
            Admin.Wallet = amount;
        }
        else {
            Admin.Wallet = Admin.Wallet + amount;
        }
        Admin.notifications.push({
            _id: new mongoose_1.default.Types.ObjectId(),
            message: `${amount} got credited to wallet!`,
            timestamp: new Date(),
            Read: false
        });
        yield Admin.save();
        console.log("admin details after payment ", Admin);
    }
    catch (error) {
        throw error;
    }
});
exports.updateAdminWalletAmount = updateAdminWalletAmount;
