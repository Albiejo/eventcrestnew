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
const vendorService_1 = require("../Service/vendorService");
const moment_1 = __importDefault(require("moment"));
const generateOtp_1 = __importDefault(require("../Util/generateOtp"));
const CustomError_1 = require("../Error/CustomError");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const handleError_1 = require("../Util/handleError");
const mongoose_1 = require("mongoose");
const Payment_1 = __importDefault(require("../Model/Payment"));
function getCurrentWeekRange() {
    const startOfWeek = (0, moment_1.default)().startOf('isoWeek').toDate();
    const endOfWeek = (0, moment_1.default)().endOf('isoWeek').toDate();
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
const sharp = require("sharp");
const s3 = new client_s3_1.S3Client({
    credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
    },
    region: process.env.BUCKET_REGION,
});
class VendorController {
    vendorSignup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password, name, phone, city, vendor_type } = req.body;
                const otpCode = yield (0, generateOtp_1.default)(email);
                if (otpCode !== undefined) {
                    req.session.vendor = {
                        email: email,
                        password: password,
                        name: name,
                        phone: parseInt(phone),
                        city: city,
                        otpCode: otpCode,
                        otpSetTimestamp: Date.now(),
                        vendor_type: vendor_type,
                    };
                    return res
                        .status(200)
                        .json({
                        message: "OTP send to vendor's email for verification..",
                        email: email,
                    });
                }
                else {
                    console.log("couldn't generate otp, error occcured ,please fix !!");
                    return res
                        .status(500)
                        .json({
                        message: `Server Error couldn't generate otp, error occcured ,please fix !!`,
                    });
                }
            }
            catch (error) {
                (0, handleError_1.handleError)(res, error, "vendorSignup");
            }
        });
    }
    createRefreshToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { refreshToken } = req.body;
                const token = yield (0, vendorService_1.createRefreshToken)(refreshToken);
                return res.status(200).json({ token });
            }
            catch (error) {
                (0, handleError_1.handleError)(res, error, "createRefreshToken");
            }
        });
    }
    VendorLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const { refreshToken, token, vendorData, message } = yield (0, vendorService_1.login)(email, password);
                res.cookie("jwtToken", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                });
                return res.status(200).json({ refreshToken, token, vendorData, message });
            }
            catch (error) {
                (0, handleError_1.handleError)(res, error, "VendorLogin");
            }
        });
    }
    VendorLogout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.clearCookie("jwtToken");
                res.status(200).json({ message: "vendor logged out successfully" });
            }
            catch (error) {
                (0, handleError_1.handleError)(res, error, "VendorLogout");
            }
        });
    }
    verifyOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const otp = req.body.otp;
                const vendorData = req.session.vendor;
                if (!vendorData) {
                    return res
                        .status(400)
                        .json({ error: "Session data not found. Please sign up again." });
                }
                const email = vendorData.email;
                const password = vendorData.password;
                const name = vendorData.name;
                const phone = vendorData.phone;
                const city = vendorData.city;
                if (!vendorData.otpCode) {
                    throw new CustomError_1.CustomError("OTP Expired...Try again with new OTP !!", 400);
                }
                const otpCode = vendorData.otpCode;
                const vendor_type = vendorData.vendor_type;
                if (otp === otpCode) {
                    const vendor = yield (0, vendorService_1.signup)(email, password, name, phone, city, vendor_type);
                    return res.status(201).json({ message: "vendor created" });
                }
                else {
                    return res.status(400).json({ error: "Invalid otp !!" });
                }
            }
            catch (error) {
                (0, handleError_1.handleError)(res, error, "verifyOtp");
            }
        });
    }
    VendorForgotPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const email = req.body.email;
                const vendor = yield (0, vendorService_1.CheckExistingVendor)(email);
                if (vendor) {
                    const otp = yield (0, generateOtp_1.default)(email);
                    req.session.votp = { otp: otp, email: email };
                    res
                        .status(200)
                        .json({
                        message: "otp sent to vendor email for password updation request ",
                        email: email,
                    });
                }
                else {
                    res.status(400).json({ error: "Email not Registered with us !!" });
                }
            }
            catch (error) {
                (0, handleError_1.handleError)(res, error, "VendorForgotPassword");
            }
        });
    }
    VerifyOtpForPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const ReceivedOtp = req.body.otp;
                const generatedOtp = (_a = req.session.votp) === null || _a === void 0 ? void 0 : _a.otp;
                if (!req.session.votp) {
                    throw new CustomError_1.CustomError("OTP Expired.Try again.", 400);
                }
                if (ReceivedOtp === generatedOtp) {
                    console.log("otp is correct , navigating vendor to update password.");
                    return res
                        .status(200)
                        .json({ data: "otp is correct, please update password now" });
                }
                else {
                    throw new CustomError_1.CustomError("Invalid OTP !!", 400);
                }
            }
            catch (error) {
                (0, handleError_1.handleError)(res, error, "VerifyOtpForPassword");
            }
        });
    }
    getAllVendors(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const search = req.query.search !== undefined ? req.query.search.toString() : "";
                const sortBy = req.query.sortBy;
                const pageSize = parseInt(req.query.pageSize) || 8;
                let sortCriteria = null;
                const category = req.query.category;
                switch (sortBy) {
                    case "rating":
                        sortCriteria = "OverallRating";
                        break;
                    case "-rating":
                        sortCriteria = "-OverallRating";
                        break;
                    default:
                        break;
                }
                const { vendors, totalVendorsCount } = yield (0, vendorService_1.getVendors)(page, pageSize, search.toString(), sortCriteria, category);
                const totalPages = Math.ceil(totalVendorsCount / pageSize);
                return res.status(200).json({ vendors: vendors, totalPages: totalPages });
            }
            catch (error) {
                (0, handleError_1.handleError)(res, error, "getAllVendors");
            }
        });
    }
    Toggleblock(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const VendorId = req.query.VendorId;
                if (!VendorId) {
                    throw new Error("Vendor ID is missing or invalid.");
                }
                yield (0, vendorService_1.toggleVendorBlock)(VendorId);
                return res
                    .status(200)
                    .json({ message: "vendor block status toggled successfully." });
            }
            catch (error) {
                (0, handleError_1.handleError)(res, error, "Toggleblock");
            }
        });
    }
    getVendor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const vendorId = req.query.Id;
                if (!vendorId) {
                    return res.status(400).json({ error: "Vendor ID is required." });
                }
                const data = yield (0, vendorService_1.getSingleVendor)(vendorId);
                if (!data) {
                    return res
                        .status(400)
                        .json({ error: "Vendor not found , error occured" });
                }
                else {
                    return res.status(200).json({ data: data });
                }
            }
            catch (error) {
                (0, handleError_1.handleError)(res, error, "getVendor");
            }
        });
    }
    ResetVendorPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const password = req.body.password;
                const confirmPassword = req.body.confirmPassword;
                if (password === confirmPassword) {
                    const email = req.session.votp.email;
                    const status = yield (0, vendorService_1.ResetVendorPasswordService)(password, email);
                    return res
                        .status(200)
                        .json({ message: "Password reset successfully." });
                }
                else {
                    return res.status(400).json({ error: "Passwords do not match." });
                }
            }
            catch (error) {
                (0, handleError_1.handleError)(res, error, "ResetVendorPassword");
            }
        });
    }
    addVendorReview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const content = req.body.content;
                const rating = req.body.rate;
                const { vendorid, username } = req.query;
                const status = yield (0, vendorService_1.PushVendorReview)(content, rating, username, vendorid);
                if (!status) {
                    return res
                        .status(400)
                        .json({ error: `couldn't add reviews, some error occured` });
                }
                return res.status(200).json({ message: "review added for vendor.." });
            }
            catch (error) {
                (0, handleError_1.handleError)(res, error, "addVendorReview");
            }
        });
    }
    UpdateProfilePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const currentPassword = req.body.current_password;
                const newPassword = req.body.new_password;
                const vendorId = req.query.vendorid;
                let status = yield (0, vendorService_1.checkVendorCurrentPassword)(currentPassword, vendorId);
                if (!status) {
                    throw new CustomError_1.CustomError(`Current password doesn't match!`, 400);
                }
                const data = yield (0, vendorService_1.UpdateVendorPasswordService)(newPassword, vendorId);
                if (!data) {
                    return res
                        .status(400)
                        .json({ error: "couldn't update password..internal error." });
                }
                return res
                    .status(200)
                    .json({ message: "password updated successfully.." });
            }
            catch (error) {
                (0, handleError_1.handleError)(res, error, "UpdateProfilePassword");
            }
        });
    }
    resendOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const vendorData = req.session.vendor;
                if (!vendorData) {
                    return res
                        .status(400)
                        .json({ error: "Session data not found. Please sign up again." });
                }
                const email = vendorData.email;
                const newOtp = yield (0, generateOtp_1.default)(email);
                if (!email) {
                    return res
                        .status(400)
                        .json({ error: "Email not found in session data." });
                }
                if (req.session.vendor) {
                    req.session.vendor.otpCode = newOtp;
                }
                else {
                    console.error("Session vendor data is unexpectedly undefined.");
                    return res
                        .status(500)
                        .json({
                        message: "Server Error: Session vendor data is unexpectedly undefined.",
                    });
                }
                return res.status(200).json({ message: "New OTP sent to email" });
            }
            catch (error) {
                (0, handleError_1.handleError)(res, error, "resendOtp");
            }
        });
    }
    updateProfiledetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const vendorId = req.query.vendorid;
                const formData = req.body;
                let coverpicFile, coverpicUrl;
                let logoFile, logoUrl;
                if (req.files) {
                    if (typeof req.files === "object" &&
                        "coverpic" in req.files &&
                        Array.isArray(req.files["coverpic"])) {
                        coverpicFile = req.files["coverpic"][0];
                    }
                    if (typeof req.files === "object" &&
                        "logo" in req.files &&
                        Array.isArray(req.files["logo"])) {
                        logoFile = req.files["logo"][0];
                    }
                    const resizedCoverpicBuffer = yield sharp(coverpicFile === null || coverpicFile === void 0 ? void 0 : coverpicFile.buffer)
                        .resize({ width: 1920, height: 1080, fit: "cover" })
                        .toBuffer();
                    const coverpicUploadParams = {
                        Bucket: process.env.BUCKET_NAME,
                        Key: coverpicFile === null || coverpicFile === void 0 ? void 0 : coverpicFile.originalname,
                        Body: resizedCoverpicBuffer,
                        ContentType: coverpicFile === null || coverpicFile === void 0 ? void 0 : coverpicFile.mimetype,
                    };
                    const covercommand = new client_s3_1.PutObjectCommand(coverpicUploadParams);
                    yield s3.send(covercommand);
                    const covercommand2 = new client_s3_1.GetObjectCommand({
                        Bucket: process.env.BUCKET_NAME,
                        Key: coverpicFile === null || coverpicFile === void 0 ? void 0 : coverpicFile.originalname,
                    });
                    coverpicUrl = yield (0, s3_request_presigner_1.getSignedUrl)(s3, covercommand2, {
                        expiresIn: 86400 * 3,
                    });
                    // Upload logo to S3
                    const logoUploadParams = {
                        Bucket: process.env.BUCKET_NAME,
                        Key: logoFile === null || logoFile === void 0 ? void 0 : logoFile.originalname,
                        Body: logoFile === null || logoFile === void 0 ? void 0 : logoFile.buffer,
                        ContentType: logoFile === null || logoFile === void 0 ? void 0 : logoFile.mimetype,
                    };
                    const logocommand = new client_s3_1.PutObjectCommand(logoUploadParams);
                    yield s3.send(logocommand);
                    const logocommand2 = new client_s3_1.GetObjectCommand({
                        Bucket: process.env.BUCKET_NAME,
                        Key: logoFile === null || logoFile === void 0 ? void 0 : logoFile.originalname,
                    });
                    logoUrl = yield (0, s3_request_presigner_1.getSignedUrl)(s3, logocommand2, {
                        expiresIn: 86400 * 3,
                    });
                }
                const updatedVendor = yield (0, vendorService_1.updateVendorprof)(vendorId, formData, coverpicUrl, logoUrl, logoFile === null || logoFile === void 0 ? void 0 : logoFile.originalname, coverpicFile === null || coverpicFile === void 0 ? void 0 : coverpicFile.originalname);
                res.status(200).json(updatedVendor);
            }
            catch (error) {
                (0, handleError_1.handleError)(res, error, "updateProfiledetails");
            }
        });
    }
    addReviewReply(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const content = req.body.content;
                const { vendorId, reviewId } = req.query;
                const vendorData = yield (0, vendorService_1.addReviewReplyController)(vendorId, content, reviewId);
                return res.status(200).json({ vendorData: vendorData });
            }
            catch (error) {
                (0, handleError_1.handleError)(res, error, "addReviewReply");
            }
        });
    }
    sendVerifyRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const vendorId = req.body.vendorId;
                const result = yield (0, vendorService_1.verificationRequest)(vendorId);
                res.status(200).json(result);
            }
            catch (error) {
                (0, handleError_1.handleError)(res, error, "sendVerifyRequest vendor");
            }
        });
    }
    updateVerifyStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const vendorId = req.body.vendorId;
                const status = req.body.status;
                const result = yield (0, vendorService_1.changeVerifyStatus)(vendorId, status);
                return res
                    .status(200)
                    .json({ result, message: "Status updated successfully!" });
            }
            catch (error) {
                (0, handleError_1.handleError)(res, error, "updateVerifyStatus vendor");
            }
        });
    }
    MarkasRead(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { Id, notifiId } = req.query;
                const data = yield (0, vendorService_1.updateNotification)(Id, notifiId);
                if (data) {
                    res.status(200).json({ data: data });
                }
            }
            catch (error) {
                (0, handleError_1.handleError)(res, error, "MarkasRead vendor");
            }
        });
    }
    clearAllNotifications(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const vendorid = req.query.userId;
                const data = yield (0, vendorService_1.clearalldata)(vendorid);
                res.status(200).json(data);
            }
            catch (error) {
                (0, handleError_1.handleError)(res, error, "clearAllNotifications vendor");
            }
        });
    }
    getRevenue(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const vendorId = req.query.vendorId;
                const dateType = req.query.date;
                if (!vendorId || !mongoose_1.Types.ObjectId.isValid(vendorId)) {
                    res.status(400).json({ message: 'Invalid or missing vendorId' });
                    return;
                }
                let start, end, groupBy, sortField, arrayLength = 0;
                switch (dateType) {
                    case 'week':
                        const { startOfWeek, endOfWeek } = getCurrentWeekRange();
                        start = startOfWeek;
                        end = endOfWeek;
                        groupBy = { day: { $dayOfMonth: '$createdAt' } }; // Group by day
                        sortField = 'day'; // Sort by day
                        arrayLength = 7;
                        break;
                    case 'month':
                        const { startOfYear, endOfYear } = getCurrentYearRange();
                        start = startOfYear;
                        end = endOfYear;
                        groupBy = { month: { $month: '$createdAt' } }; // Group by month
                        sortField = 'month'; // Sort by month
                        arrayLength = 12;
                        break;
                    case 'year':
                        const { startOfFiveYearsAgo, endOfCurrentYear } = getLastFiveYearsRange();
                        start = startOfFiveYearsAgo;
                        end = endOfCurrentYear;
                        groupBy = { year: { $year: '$createdAt' } }; // Group by year
                        sortField = 'year'; // Sort by year
                        arrayLength = 5;
                        break;
                    default:
                        res.status(400).json({ message: 'Invalid date parameter' });
                        return;
                }
                const revenueData = yield Payment_1.default.aggregate([
                    {
                        $match: {
                            vendorId: new mongoose_1.Types.ObjectId(vendorId),
                            createdAt: {
                                $gte: start,
                                $lt: end,
                            },
                        },
                    },
                    {
                        $group: {
                            _id: groupBy,
                            totalRevenue: { $sum: '$amount' },
                        },
                    },
                    {
                        $sort: { [`_id.${sortField}`]: 1 },
                    },
                ]);
                const revenueArray = Array.from({ length: arrayLength }, (_, index) => {
                    const item = revenueData.find((r) => {
                        if (dateType === 'week') {
                            return r._id.day === index + 1;
                        }
                        else if (dateType === 'month') {
                            return r._id.month === index + 1;
                        }
                        else if (dateType === 'year') {
                            return r._id.year === new Date().getFullYear() - (arrayLength - 1) + index;
                        }
                        return false;
                    });
                    return item ? item.totalRevenue : 0; // Default to 0 if no data for the expected index
                });
                res.status(200).json({ revenue: revenueArray });
            }
            catch (error) {
                (0, handleError_1.handleError)(res, error, "getRevenue");
            }
        });
    }
}
exports.default = new VendorController();
