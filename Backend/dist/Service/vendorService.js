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
exports.clearalldata = exports.updateNotification = exports.changeVerifyStatus = exports.verificationRequest = exports.addReviewReplyController = exports.updateVendorprof = exports.UpdateVendorPasswordService = exports.checkVendorCurrentPassword = exports.PushVendorReview = exports.ResetVendorPasswordService = exports.getSingleVendor = exports.toggleVendorBlock = exports.getVendors = exports.createRefreshToken = exports.CheckExistingVendor = exports.login = exports.signup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const vendorRepository_1 = require("../Repository/vendorRepository");
const mongoose_1 = __importDefault(require("mongoose"));
const Vendor_1 = __importDefault(require("../Model/Vendor"));
const vendorTypeRepository_1 = require("../Repository/vendorTypeRepository");
const CustomError_1 = require("../Error/CustomError");
const Admin_1 = __importDefault(require("../Model/Admin"));
const signup = (email, password, name, phone, city, vendor_type) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingVendor = yield (0, vendorRepository_1.findvendorByEmail)(email);
        if (existingVendor) {
            throw new Error('vendor already exists');
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        const isActive = true;
        const isVerified = false;
        const verificationRequest = false;
        const totalBooking = 0;
        const vendorType = yield (0, vendorTypeRepository_1.findVerndorIdByType)(vendor_type);
        const newVendor = yield (0, vendorRepository_1.createVendor)({ email, password: hashedPassword, name, phone, city, isActive, isVerified, verificationRequest, totalBooking, vendor_type: vendorType === null || vendorType === void 0 ? void 0 : vendorType._id });
        return "vendor created";
    }
    catch (error) {
        console.error("Error fetching signup", error);
        throw new CustomError_1.CustomError("Unable to fetch signup", 500);
    }
});
exports.signup = signup;
const login = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingVendor = yield (0, vendorRepository_1.findvendorByEmail)(email);
        if (!existingVendor) {
            throw new CustomError_1.CustomError('Vendor not exists..', 404);
        }
        if (!existingVendor.isActive) {
            throw new CustomError_1.CustomError(`Vendor is Blocked, can't login`, 401);
        }
        const passwordMatch = yield bcrypt_1.default.compare(password, existingVendor.password);
        if (!passwordMatch) {
            throw new CustomError_1.CustomError('Incorrect password..', 401);
        }
        const vendorData = yield (0, vendorRepository_1.findvendorByEmail)(email);
        // If the password matches, generate and return a JWT token
        const token = jsonwebtoken_1.default.sign({ _id: existingVendor._id }, process.env.JWT_SECRET, { expiresIn: "24h" });
        let refreshToken = existingVendor.refreshToken;
        if (!refreshToken) {
            refreshToken = jsonwebtoken_1.default.sign({ _id: existingVendor._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
        }
        existingVendor.refreshToken = refreshToken;
        yield existingVendor.save();
        return { refreshToken, token, vendorData: existingVendor, message: "Successfully logged in.." };
    }
    catch (error) {
        console.error("Error fetching login", error);
        throw new CustomError_1.CustomError("Unable to fetch login", 500);
    }
});
exports.login = login;
const CheckExistingVendor = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingVendor = yield (0, vendorRepository_1.findvendorByEmail)(email);
        return existingVendor;
    }
    catch (error) {
        console.error("Error fetching CheckExistingVendor", error);
        throw new CustomError_1.CustomError("Unable to fetch CheckExistingVendor", 500);
    }
});
exports.CheckExistingVendor = CheckExistingVendor;
const createRefreshToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const Vendor = yield Vendor_1.default.findById(decoded._id);
        if (!Vendor || Vendor.refreshToken !== refreshToken) {
            throw new Error('Invalid refresh token');
        }
        const accessToken = jsonwebtoken_1.default.sign({ _id: Vendor._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        return accessToken;
    }
    catch (error) {
        console.error("Error fetching createRefreshToken", error);
        throw new CustomError_1.CustomError("Unable to fetch createRefreshToken", 500);
    }
});
exports.createRefreshToken = createRefreshToken;
const getVendors = (page, pageSize, search, sortBy, category) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vendors = yield (0, vendorRepository_1.findAllVendors)(page, pageSize, search, sortBy, category);
        const totalVendorsCount = yield (0, vendorRepository_1.getTotalVendorsCount)();
        return { vendors, totalVendorsCount };
    }
    catch (error) {
        console.error("Error fetching getVendors", error);
        throw new CustomError_1.CustomError("Unable to fetch getVendors", 500);
    }
});
exports.getVendors = getVendors;
const toggleVendorBlock = (vendorId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Vendor = yield Vendor_1.default.findById(vendorId);
        if (!Vendor) {
            throw new Error('Vendor not found');
        }
        Vendor.isActive = !Vendor.isActive;
        yield Vendor.save();
        const admindata = yield Admin_1.default.find();
        const Admin = admindata[0];
        Admin.notifications.push({
            _id: new mongoose_1.default.Types.ObjectId(),
            message: `${Vendor.name}'s status was toggled , ${Vendor.isActive ? "active" : "blocked"} now`,
            timestamp: new Date()
        });
        yield Admin.save();
        console.log("notifi pushed", Admin);
    }
    catch (error) {
        console.error("Error fetching toggleVendorBlock", error);
        throw new CustomError_1.CustomError("Unable to fetch toggleVendorBlock", 500);
    }
});
exports.toggleVendorBlock = toggleVendorBlock;
const getSingleVendor = (vendorId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Vendor = yield Vendor_1.default.findById(vendorId);
        if (!Vendor) {
            throw new Error('Vendor not found');
        }
        return Vendor;
    }
    catch (error) {
        console.error("Error fetching getSingleVendor", error);
        throw new CustomError_1.CustomError("Unable to fetch getSingleVendor", 500);
    }
});
exports.getSingleVendor = getSingleVendor;
const ResetVendorPasswordService = (password, email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        const status = yield (0, vendorRepository_1.UpdateVendorPassword)(hashedPassword, email);
        if (!status.success) {
            throw new Error(status.message);
        }
    }
    catch (error) {
        console.error("Error fetching ResetVendorPasswordService", error);
        throw new CustomError_1.CustomError("Unable to fetch ResetVendorPasswordService", 500);
    }
});
exports.ResetVendorPasswordService = ResetVendorPasswordService;
const PushVendorReview = (content, rating, username, vendorid) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (0, vendorRepository_1.AddVendorReview)(content, rating, username, vendorid);
        return data;
    }
    catch (error) {
        console.error("Error fetching PushVendorReview", error);
        throw new CustomError_1.CustomError("Unable to fetch PushVendorReview", 500);
    }
});
exports.PushVendorReview = PushVendorReview;
const checkVendorCurrentPassword = (Currentpassword, vendorid) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingVendor = yield (0, vendorRepository_1.findVerndorId)(vendorid);
        if (!existingVendor) {
            throw new CustomError_1.CustomError("Vendor not found", 404);
        }
        const passwordMatch = yield bcrypt_1.default.compare(Currentpassword, existingVendor.password);
        if (!passwordMatch) {
            throw new CustomError_1.CustomError("Password doesn't match", 401);
        }
        return passwordMatch;
    }
    catch (error) {
        console.error("Error fetching checkVendorCurrentPassword", error);
        throw new CustomError_1.CustomError("Unable to fetch checkVendorCurrentPassword", 500);
    }
});
exports.checkVendorCurrentPassword = checkVendorCurrentPassword;
const UpdateVendorPasswordService = (newPassword, vendorid) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(newPassword, salt);
        const existingVendor = yield (0, vendorRepository_1.findVerndorId)(vendorid);
        if (!existingVendor) {
            throw new CustomError_1.CustomError("user not found", 404);
        }
        const email = existingVendor.email;
        const updatedValue = yield (0, vendorRepository_1.UpdateVendorPassword)(hashedPassword, email);
        if (updatedValue) {
            return true;
        }
        return false;
    }
    catch (error) {
        console.error("Error fetching UpdateVendorPasswordService", error);
        throw new CustomError_1.CustomError("Unable to fetch UpdateVendorPasswordService", 500);
    }
});
exports.UpdateVendorPasswordService = UpdateVendorPasswordService;
const updateVendorprof = (vendorId, formData, coverpicUrl, logoUrl, logo, coverpic) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("inside update service");
        yield (0, vendorRepository_1.updateVendorprofData)(vendorId, formData, coverpicUrl, logoUrl, logo, coverpic);
        const updatedVendor = yield (0, vendorRepository_1.findVerndorId)(vendorId);
        return updatedVendor;
    }
    catch (error) {
        console.error("Error fetching updateVendorprof", error);
        throw new CustomError_1.CustomError("Unable to fetch updateVendorprof", 500);
    }
});
exports.updateVendorprof = updateVendorprof;
const addReviewReplyController = (vendorId, content, reviewId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vendordata = yield (0, vendorRepository_1.addReviewReplyById)(vendorId, content, reviewId);
        return vendordata;
    }
    catch (error) {
        console.error("Error fetching addReviewReplyController", error);
        throw new CustomError_1.CustomError("Unable to fetch addReviewReplyController", 500);
    }
});
exports.addReviewReplyController = addReviewReplyController;
const verificationRequest = (vendorId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (0, vendorRepository_1.requestForVerification)(vendorId);
        return data;
    }
    catch (error) {
        console.error("Error fetching verificationRequest", error);
        throw new CustomError_1.CustomError("Unable to fetch verificationRequest", 500);
    }
});
exports.verificationRequest = verificationRequest;
function changeVerifyStatus(vendorId, status) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield (0, vendorRepository_1.updateVerificationStatus)(vendorId, status);
            return data;
        }
        catch (error) {
            console.error("Error fetching changeVerifyStatus", error);
            throw new CustomError_1.CustomError("Unable to fetch changeVerifyStatus", 500);
        }
    });
}
exports.changeVerifyStatus = changeVerifyStatus;
const updateNotification = (vendorid, notifiId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (0, vendorRepository_1.updateNotificationstatus)(vendorid, notifiId);
        return data;
    }
    catch (error) {
        console.error("Error fetching updateNotification", error);
        throw new CustomError_1.CustomError("Unable to fetch updateNotification", 500);
    }
});
exports.updateNotification = updateNotification;
const clearalldata = (vendorid) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (0, vendorRepository_1.clearNotification)(vendorid);
        return data;
    }
    catch (error) {
        console.error("Error fetching clearalldata", error);
        throw new CustomError_1.CustomError("Unable to fetch clearalldata", 500);
    }
});
exports.clearalldata = clearalldata;
