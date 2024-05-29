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
const bookingRepository_1 = __importDefault(require("../Repository/bookingRepository"));
const Vendor_1 = __importDefault(require("../Model/Vendor"));
const CustomError_1 = require("../Error/CustomError");
class bookingService {
    checkIfDatePresent(vendorId, date) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const vendorData = yield Vendor_1.default.findById(vendorId);
                if (!vendorData) {
                    throw new Error('Vendor not found');
                }
                const isBooked = vendorData.bookedDates.includes(date);
                return isBooked ? true : false;
            }
            catch (error) {
                console.error("Error fetching checkIfDatePresent", error);
                throw new CustomError_1.CustomError("unable to check Booking dates  now , try after some time", 400);
            }
        });
    }
    addABooking(eventName, name, venue, date, pin, mobile, vendorId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const vendorIdObjectId = new mongoose_1.default.Types.ObjectId(vendorId);
                const userIdObjectId = new mongoose_1.default.Types.ObjectId(userId);
                const booking = yield bookingRepository_1.default.create({ eventName, name, venue, date, pin, mobile, vendorId: vendorIdObjectId, userId: userIdObjectId });
                yield Vendor_1.default.findByIdAndUpdate(vendorId, {
                    $push: { bookedDates: date },
                });
                const vendorData = yield Vendor_1.default.findById(vendorId);
                if (!vendorData) {
                    throw Error;
                }
                vendorData.notifications.push({
                    _id: new mongoose_1.default.Types.ObjectId(),
                    message: "New Event Booked, check bookings tab for more details !",
                    timestamp: new Date(),
                    Read: false
                });
                yield vendorData.save();
                return booking;
            }
            catch (error) {
                console.error("Error fetching add Booking", error);
                throw new CustomError_1.CustomError("unable to process Booking now , try after some time", 400);
            }
        });
    }
    getAllBookingsByUser(userId, skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookings = yield bookingRepository_1.default.findBookingsByUserId(userId, skip, limit);
                return bookings;
            }
            catch (error) {
                console.error("Error fetching get All Bookings By User", error);
                throw new CustomError_1.CustomError("unable to get Bookings now , try after some time", 400);
            }
        });
    }
    acquireLockForDate(vendorId, date) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const vendorData = yield Vendor_1.default.findById(vendorId);
                if (!vendorData) {
                    throw new Error("Vendor not found");
                }
                const existingLock = vendorData.locks.find(lock => lock.date === date);
                if (existingLock && existingLock.isLocked) {
                    throw new Error('Date is already locked');
                }
                vendorData.locks.push({
                    date: date,
                    isLocked: true
                });
                yield vendorData.save();
            }
            catch (error) {
                console.error("Error fetching acquire Lock For Date in booking", error);
                throw new CustomError_1.CustomError("unable to process Booking now , try after some time", 400);
            }
        });
    }
    releaseLockForDate(vendorId, date) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const vendorData = yield Vendor_1.default.findById(vendorId);
                if (!vendorData) {
                    throw new Error("Vendor not found");
                }
                const lockIndex = vendorData.locks.findIndex(lock => lock.date === date);
                if (lockIndex !== -1) {
                    vendorData.locks.splice(lockIndex, 1);
                    yield vendorData.save();
                }
            }
            catch (error) {
                console.error("Error fetching release Lock For Date in booking", error);
                throw new CustomError_1.CustomError("unable to process Booking now , try after some time", 400);
            }
        });
    }
    getAllBookingsByVendor(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookings = yield bookingRepository_1.default.findBookingsByVendorId(vendorId);
                return bookings;
            }
            catch (error) {
                console.error("Error fetching get All Bookings  By Vendor", error);
                throw new CustomError_1.CustomError("unable to get Bookings now , try after some time", 400);
            }
        });
    }
    getAllBookingsById(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookings = yield bookingRepository_1.default.findBookingsByBookingId(bookingId);
                return bookings;
            }
            catch (error) {
                console.error("Error fetching get All Bookings By Id", error);
                throw new CustomError_1.CustomError("unable to get Bookings now , try after some time", 400);
            }
        });
    }
    updateStatusById(bookingId, status, vid, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookings = yield bookingRepository_1.default.updateBookingStatusById(bookingId, status, vid, userId);
                return bookings;
            }
            catch (error) {
                console.error("Error fetching update booking Status By Id", error);
                throw new CustomError_1.CustomError("unable to update Booking now , try after some time", 400);
            }
        });
    }
    countTotalBookingsByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const totalBookings = yield Booking_1.default.countDocuments({ userId: userId });
                return totalBookings;
            }
            catch (error) {
                console.error("Error fetching count Total bookings By User", error);
                throw new CustomError_1.CustomError("unable to count Bookings now , try after some time", 400);
            }
        });
    }
    MarkBookingCancel(bookingId, vendorId, date) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield bookingRepository_1.default.updatebookingCancel(bookingId, vendorId, date);
                return result;
            }
            catch (error) {
                console.error("Error procesing booking cancellation", error);
                throw new CustomError_1.CustomError("unable to update Booking now , try after some time", 400);
            }
        });
    }
    getAllBookings() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield bookingRepository_1.default.getfullbookingdetails();
                return data;
            }
            catch (error) {
                console.error("Error fetching getAllBookings", error);
                throw new CustomError_1.CustomError("unable to get Bookings now , try after some time", 400);
            }
        });
    }
}
exports.default = new bookingService();
