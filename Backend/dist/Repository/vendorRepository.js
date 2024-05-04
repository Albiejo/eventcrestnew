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
exports.clearNotification = exports.updateNotificationstatus = exports.updateVerificationStatus = exports.requestForVerification = exports.addReviewReplyById = exports.updateVendorprofData = exports.findVerndorId = exports.AddVendorReview = exports.UpdateVendorPassword = exports.getTotalVendorsCount = exports.findAllVendors = exports.findvendorByEmail = exports.createVendor = void 0;
const Vendor_1 = __importDefault(require("../Model/Vendor"));
const CustomError_1 = require("../Error/CustomError");
const mongoose_1 = __importDefault(require("mongoose"));
const createVendor = (vendorData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield Vendor_1.default.create(vendorData);
    }
    catch (error) {
        throw error;
    }
});
exports.createVendor = createVendor;
const findvendorByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield Vendor_1.default.findOne({ email });
    }
    catch (error) {
        throw error;
    }
});
exports.findvendorByEmail = findvendorByEmail;
const findAllVendors = (page, pageSize, search, sortBy, category) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = {};
        if (category && category.trim()) {
            const categories = category.split(',').map(c => c.trim());
            query.vendor_type = { $in: categories };
        }
        if (search && search.trim()) {
            query = {
                $or: [
                    { name: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } },
                    { city: { $regex: search, $options: "i" } },
                ],
            };
        }
        const skip = (page - 1) * pageSize;
        let data = Vendor_1.default.find(query).skip(skip).limit(pageSize);
        if (sortBy) {
            data = data.sort(sortBy);
        }
        return yield data.exec();
    }
    catch (error) {
        throw error;
    }
});
exports.findAllVendors = findAllVendors;
const getTotalVendorsCount = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield Vendor_1.default.countDocuments({});
    }
    catch (error) {
        throw error;
    }
});
exports.getTotalVendorsCount = getTotalVendorsCount;
const UpdateVendorPassword = (password, mail) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield Vendor_1.default.updateOne({ email: mail }, { password: password });
        if (result.modifiedCount === 1) {
            return { success: true, message: "Vendor Password updated successfully." };
        }
        else {
            return { success: false, message: "Vendor not found or password not updated." };
        }
    }
    catch (error) {
        throw error;
    }
});
exports.UpdateVendorPassword = UpdateVendorPassword;
const AddVendorReview = (content, rating, username, vendorId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vendorData = yield Vendor_1.default.findById(vendorId);
        if (!vendorData) {
            throw new Error('Vendor not found');
        }
        const reviewId = new mongoose_1.default.Types.ObjectId();
        vendorData.reviews.push({
            _id: reviewId,
            content, rating, username,
            date: new Date(),
            reply: []
        });
        vendorData.notifications.push({
            _id: new mongoose_1.default.Types.ObjectId(),
            message: `${username} added a review to your profile.`,
            timestamp: new Date(),
            Read: false
        });
        const ratings = vendorData.reviews.map((review) => review.rating);
        vendorData.OverallRating = calculateOverallRating(ratings);
        yield vendorData.save();
        return true;
    }
    catch (error) {
        throw error;
    }
});
exports.AddVendorReview = AddVendorReview;
const calculateOverallRating = (ratings) => {
    const totalRating = ratings.reduce((acc, rating) => acc + rating, 0);
    return ratings.length > 0 ? totalRating / ratings.length : 0;
};
const findVerndorId = (vendorid) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield Vendor_1.default.findById(vendorid);
    }
    catch (error) {
        throw error;
    }
});
exports.findVerndorId = findVerndorId;
const updateVendorprofData = (vendorId, formData, coverpicUrl, logoUrl, logo, coverpic) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const update = {
            name: formData.name,
            city: formData.city,
            phone: parseInt(formData.phone),
            about: formData.about,
            coverpicUrl: coverpicUrl,
            logoUrl: logoUrl,
            logo: logo,
            coverpic: coverpic
        };
        // Use the $set operator to update the document
        yield Vendor_1.default.updateOne({ _id: vendorId }, { $set: update });
    }
    catch (error) {
        throw new Error('Failed to update vendor data');
    }
});
exports.updateVendorprofData = updateVendorprofData;
const addReviewReplyById = (vendorId, content, reviewId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vendorData = yield Vendor_1.default.findById(vendorId);
        if (!vendorData) {
            console.log('Vendor not found');
            throw new CustomError_1.CustomError('Vendor not found', 404);
        }
        const review = vendorData.reviews.find((review) => review._id.toString() === reviewId);
        if (!review) {
            console.log('Review not found');
            throw new CustomError_1.CustomError('Review not found', 404);
        }
        const result = yield Vendor_1.default.findByIdAndUpdate(vendorId, { $push: { 'reviews.$[review].reply': content } }, {
            arrayFilters: [{ 'review._id': { $eq: new mongoose_1.default.Types.ObjectId(reviewId) } }],
            new: true
        });
        const newvendordata = yield Vendor_1.default.findById(vendorId);
        return newvendordata;
    }
    catch (error) {
        throw new Error('Failed to add reply');
    }
});
exports.addReviewReplyById = addReviewReplyById;
function requestForVerification(vendorId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield Vendor_1.default.findByIdAndUpdate(vendorId, { $set: { verificationRequest: true } });
            return data;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.requestForVerification = requestForVerification;
function updateVerificationStatus(vendorId, status) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield Vendor_1.default.findByIdAndUpdate(vendorId, { $set: { verificationRequest: false, isVerified: status === "Accepted" } });
            return data;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.updateVerificationStatus = updateVerificationStatus;
const updateNotificationstatus = (vendorid, notifid) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let vendordata = yield Vendor_1.default.findById(vendorid);
        if (!vendordata) {
            throw new Error('User not found');
        }
        const notification = vendordata.notifications.find((notif) => notif._id.toString() === notifid);
        if (!notification) {
            throw new Error('Notification not found');
        }
        notification.Read = !notification.Read;
        yield vendordata.save();
        const message = notification.Read ? 'Notification marked as read' : 'Notification marked as unread';
        vendordata = yield Vendor_1.default.findById(vendorid);
        return { message: message, vendordata: vendordata };
    }
    catch (error) {
        throw error;
    }
});
exports.updateNotificationstatus = updateNotificationstatus;
const clearNotification = (vendorid) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vendorData = yield Vendor_1.default.findById(vendorid);
        if (!vendorData) {
            throw new Error('vendor not found');
        }
        vendorData.notifications = [];
        yield vendorData.save();
        return true;
    }
    catch (error) {
        throw error;
    }
});
exports.clearNotification = clearNotification;
