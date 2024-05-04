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
const moment_1 = __importDefault(require("moment"));
const bookingService_1 = __importDefault(require("../Service/bookingService"));
const handleError_1 = require("../Util/handleError");
class BookingController {
    bookAnEvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { vendorId, userId } = req.query;
                const { eventName, name, city } = req.body;
                const date = (0, moment_1.default)(req.body.date).format('DD-MM-YYYY');
                const pin = parseInt(req.body.pin);
                const mobile = parseInt(req.body.mobile);
                const DateAlreadyBooked = yield bookingService_1.default.checkIfDatePresent(vendorId, date);
                if (DateAlreadyBooked) {
                    return res.status(400).json({ message: "Sorry this date is not available!" });
                }
                else {
                    try {
                        yield bookingService_1.default.acquireLockForDate(vendorId, date);
                        const booking = yield bookingService_1.default.addABooking(eventName, name, city, date, pin, mobile, vendorId, userId);
                        yield bookingService_1.default.releaseLockForDate(vendorId, date);
                        return res.status(201).json({ booking: booking, message: "Booking done Successfully" });
                    }
                    catch (error) {
                        console.error("Error acquiring lock:", error);
                        return res.status(400).json({ message: "Sorry, this date is currently not available." });
                    }
                }
            }
            catch (error) {
                (0, handleError_1.handleError)(res, error, "bookAnEvent");
            }
        });
    }
    getBookingsByUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.query.userId;
                const page = parseInt(req.query.page) || 1;
                const pageSize = parseInt(req.query.pageSize) || 10;
                const skip = (page - 1) * pageSize;
                const totalBookings = yield bookingService_1.default.countTotalBookingsByUser(userId);
                const totalPages = Math.ceil(totalBookings / pageSize);
                const bookings = yield bookingService_1.default.getAllBookingsByUser(userId, skip, pageSize);
                return res.status(201).json({ bookings, totalPages });
            }
            catch (error) {
                (0, handleError_1.handleError)(res, error, "getBookingsByUser");
            }
        });
    }
    getAllBookingsbyvendor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const vendorId = req.query.vendorId;
                const bookings = yield bookingService_1.default.getAllBookingsByVendor(vendorId);
                return res.status(201).json({ bookings });
            }
            catch (error) {
                (0, handleError_1.handleError)(res, error, "getAllBookingsbyvendor");
            }
        });
    }
    getBookingsById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookingId = req.query.bookingId;
                const bookings = yield bookingService_1.default.getAllBookingsById(bookingId);
                return res.status(201).json({ bookings });
            }
            catch (error) {
                (0, handleError_1.handleError)(res, error, "getBookingsById");
            }
        });
    }
    updateStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.query.userId;
                const bookingId = req.query.bookingId;
                const vendorid = req.query.vid;
                const status = req.body.status;
                const bookings = yield bookingService_1.default.updateStatusById(bookingId, status, vendorid, userId);
                return res.status(201).json(bookings);
            }
            catch (error) {
                (0, handleError_1.handleError)(res, error, "updateStatus");
            }
        });
    }
    cancelBooking(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const date = req.body.date;
                const { bookingId, vendorId } = req.query;
                const data = yield bookingService_1.default.MarkBookingCancel(bookingId, vendorId, date);
                return res.status(200).json({ data: data });
            }
            catch (error) {
                (0, handleError_1.handleError)(res, error, "cancelBooking");
            }
        });
    }
    getallBookings(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookings = yield bookingService_1.default.getAllBookings();
                return res.status(201).json({ bookings });
            }
            catch (error) {
                (0, handleError_1.handleError)(res, error, "getallBookings");
            }
        });
    }
}
exports.default = new BookingController();
