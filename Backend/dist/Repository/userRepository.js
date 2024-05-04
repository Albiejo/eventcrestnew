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
exports.clearNotification = exports.updateNotificationstatus = exports.getfavVendors = exports.UpdateUserProfileDetails = exports.addVendorToFavorites = exports.UpdatePassword = exports.findAllUsers = exports.findbyIdandUpdate = exports.findUserById = exports.findUserByEmail = exports.createUser = void 0;
const User_1 = __importDefault(require("../Model/User"));
const Vendor_1 = __importDefault(require("../Model/Vendor"));
const createUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield User_1.default.create(userData);
    }
    catch (error) {
        throw error;
    }
});
exports.createUser = createUser;
const findUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield User_1.default.findOne({ email });
    }
    catch (error) {
        throw error;
    }
});
exports.findUserByEmail = findUserByEmail;
const findUserById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield User_1.default.findById(userId);
    }
    catch (error) {
        throw error;
    }
});
exports.findUserById = findUserById;
const findbyIdandUpdate = (userId, refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield User_1.default.findByIdAndUpdate({ _id: userId }, { $set: { refreshToken: refreshToken } });
    }
    catch (error) {
        throw error;
    }
});
exports.findbyIdandUpdate = findbyIdandUpdate;
const findAllUsers = (page, limit, search) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = {};
        if (search) {
            query = {
                $or: [
                    { name: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } },
                ],
            };
        }
        const users = yield User_1.default.find(query)
            .skip((page - 1) * limit)
            .limit(limit);
        return users;
    }
    catch (error) {
        throw error;
    }
});
exports.findAllUsers = findAllUsers;
const UpdatePassword = (password, mail) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield User_1.default.updateOne({ email: mail }, { password: password });
        if (result.modifiedCount === 1) {
            return { success: true, message: "Password updated successfully." };
        }
        else {
            return {
                success: false,
                message: "User not found or password not updated.",
            };
        }
    }
    catch (error) {
        throw error;
    }
});
exports.UpdatePassword = UpdatePassword;
const addVendorToFavorites = (userId, vendorId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findById(userId);
        if (!user) {
            throw new Error("User not found.");
        }
        if (user.favorite.includes(vendorId)) {
            return false; // Vendor already in favorites
        }
        user.favorite.push(vendorId);
        yield user.save();
        return true;
    }
    catch (error) {
        console.error("Error in addVendorToFavorites repository:", error);
        throw new Error("Failed to add vendor to favorites.");
    }
});
exports.addVendorToFavorites = addVendorToFavorites;
const UpdateUserProfileDetails = (userId, name, phone, image, imageUrl) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userData = yield User_1.default.findOne({ _id: userId });
        const update = {
            name: "",
            phone: 0,
            image: "",
            imageUrl: ""
        };
        if (name) {
            update.name = name;
        }
        else if (userData === null || userData === void 0 ? void 0 : userData.name) {
            update.name = userData === null || userData === void 0 ? void 0 : userData.name;
        }
        if (phone) {
            update.phone = phone;
        }
        else if (userData === null || userData === void 0 ? void 0 : userData.phone) {
            update.phone = userData === null || userData === void 0 ? void 0 : userData.phone;
        }
        if (image) {
            update.image = image;
        }
        else if (userData === null || userData === void 0 ? void 0 : userData.image) {
            update.image = userData === null || userData === void 0 ? void 0 : userData.image;
        }
        if (imageUrl) {
            update.imageUrl = imageUrl;
        }
        else if (userData === null || userData === void 0 ? void 0 : userData.imageUrl) {
            update.imageUrl = userData.imageUrl;
        }
        const result = yield User_1.default.updateOne({ _id: userId }, { $set: update });
        const NewUserData = yield User_1.default.findOne({ _id: userId });
        if (result.modifiedCount === 1) {
            return { NewUserData: NewUserData };
        }
        else {
            return false;
        }
    }
    catch (error) {
        console.error("Error in updating profile", error);
        throw new Error("Failed to update user Profile..");
    }
});
exports.UpdateUserProfileDetails = UpdateUserProfileDetails;
const getfavVendors = (userid, page, pageSize) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const skip = (page - 1) * pageSize;
        const userData = yield User_1.default.findById(userid);
        if (!userData) {
            throw new Error('User not found');
        }
        const favoriteVendorIds = userData.favorite;
        if (!favoriteVendorIds || favoriteVendorIds.length === 0) {
            throw new Error('No favorite vendors found for this user');
        }
        const favoriteVendors = yield Vendor_1.default.find({ _id: { $in: favoriteVendorIds } }).skip(skip).limit(pageSize);
        return { favoriteVendors: favoriteVendors, totalFavVendorsCount: favoriteVendors.length };
    }
    catch (error) {
        throw error;
    }
});
exports.getfavVendors = getfavVendors;
const updateNotificationstatus = (userid, notifiID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userdata = yield User_1.default.findById(userid);
        if (!userdata) {
            throw new Error('User not found');
        }
        const notification = userdata.notifications.find((notif) => notif._id.toString() === notifiID);
        if (!notification) {
            throw new Error('Notification not found');
        }
        notification.Read = !notification.Read;
        yield userdata.save();
        console.log("notification toggled");
        const message = notification.Read ? 'Notification marked as read' : 'Notification marked as unread';
        userdata = yield User_1.default.findById(userid);
        return { message: message, userdata: userdata };
    }
    catch (error) {
        throw error;
    }
});
exports.updateNotificationstatus = updateNotificationstatus;
const clearNotification = (userid) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userdata = yield User_1.default.findById(userid);
        if (!userdata) {
            throw new Error('User not found');
        }
        userdata.notifications = [];
        yield userdata.save();
        return true;
    }
    catch (error) {
        throw error;
    }
});
exports.clearNotification = clearNotification;
