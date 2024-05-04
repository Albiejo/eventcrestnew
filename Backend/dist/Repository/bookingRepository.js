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
const mongoose_1 = __importDefault(require("mongoose"));
const Booking_1 = __importDefault(require("../Model/Booking"));
const Vendor_1 = __importDefault(require("../Model/Vendor"));
const User_1 = __importDefault(require("../Model/User"));
const baseRepository_1 = require("./baseRepository");
class BookingRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(Booking_1.default);
    }
    findBookingsByVendorId(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield Booking_1.default.find({ vendorId: vendorId });
                return result;
            }
            catch (error) {
                throw error;
            }
        });
    }
    findBookingsByUserId(userId, skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield Booking_1.default.find({ userId: userId }).populate('vendorId').skip(skip).limit(limit);
                return result;
            }
            catch (error) {
                throw error;
            }
        });
    }
    findBookingsByBookingId(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield Booking_1.default.find({ _id: bookingId }).populate('userId').populate('vendorId');
                return result;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getfullbookingdetails() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield Booking_1.default.find();
                if (!data) {
                    throw new Error("Booking details not found");
                }
                return data;
            }
            catch (error) {
                throw error;
            }
        });
    }
    updatebookingCancel(bookingId, vendorId, date) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookingData = yield Booking_1.default.findById(bookingId);
                if (!bookingData) {
                    throw new Error('Booking not found');
                }
                bookingData.status = 'Cancelled';
                bookingData.payment_status = 'Cancelled';
                yield bookingData.save();
                yield Vendor_1.default.findByIdAndUpdate(vendorId, {
                    $pull: { bookedDates: date }
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateBookingStatusById(bookingId, status, vid, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield Booking_1.default.findByIdAndUpdate(bookingId, { $set: { status: status } });
                const vendordata = yield Vendor_1.default.findById(vid);
                if (status === 'Accepted') {
                    if (vendordata) {
                        if (!vendordata.totalBooking) {
                            vendordata.totalBooking = 1;
                        }
                        else {
                            vendordata.totalBooking += 1;
                        }
                    }
                    yield (vendordata === null || vendordata === void 0 ? void 0 : vendordata.save());
                }
                const userData = yield User_1.default.findById(userId);
                userData === null || userData === void 0 ? void 0 : userData.notifications.push({
                    _id: new mongoose_1.default.Types.ObjectId(),
                    message: `Your Booking Status with ${vendordata === null || vendordata === void 0 ? void 0 : vendordata.name} has been updated.`,
                    timestamp: new Date(),
                    Read: false
                });
                yield (userData === null || userData === void 0 ? void 0 : userData.save());
                return { result, userData };
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = new BookingRepository();
