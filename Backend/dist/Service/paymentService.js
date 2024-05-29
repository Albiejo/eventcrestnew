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
exports.CountTotalPayments = exports.updateAdminWallet = exports.getPayments = exports.addNewPayment = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const paymentRepository_1 = require("../Repository/paymentRepository");
const CustomError_1 = require("../Error/CustomError");
const addNewPayment = (amount, userId, vendorId, bookingId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookingIdObjectId = new mongoose_1.default.Types.ObjectId(bookingId);
        const vendorIdObjectId = new mongoose_1.default.Types.ObjectId(vendorId);
        const userIdObjectId = new mongoose_1.default.Types.ObjectId(userId);
        const booking = yield (0, paymentRepository_1.createNewPaymnet)({ amount, userId: userIdObjectId, vendorId: vendorIdObjectId, bookingId: bookingIdObjectId });
        return booking;
    }
    catch (error) {
        console.error("Error fetching add New Payment", error);
        throw new CustomError_1.CustomError("unable to process payment now, try after some time", 400);
    }
});
exports.addNewPayment = addNewPayment;
const getPayments = (skip, limit) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payment = yield (0, paymentRepository_1.findAllPayments)(skip, limit);
        return payment;
    }
    catch (error) {
        console.error("Error fetching get Payments from DB", error);
        throw new CustomError_1.CustomError("unable to get payments now , try after some time", 400);
    }
});
exports.getPayments = getPayments;
const updateAdminWallet = (amount) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, paymentRepository_1.updateAdminWalletAmount)(amount);
    }
    catch (error) {
        console.error("Error fetching update Admin Wallet", error);
        throw new CustomError_1.CustomError("unable to update wallet now , try after some time", 400);
    }
});
exports.updateAdminWallet = updateAdminWallet;
const CountTotalPayments = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const count = yield (0, paymentRepository_1.findPaymentCount)();
        return count;
    }
    catch (error) {
        console.error("Error fetching Count Total Payments", error);
        throw error;
    }
});
exports.CountTotalPayments = CountTotalPayments;
