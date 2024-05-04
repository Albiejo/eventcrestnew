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
exports.clearalldata = exports.updateNotification = exports.FavoriteVendors = exports.UpdateUserProfile = exports.UpdatePasswordService = exports.checkCurrentPassword = exports.FavoriteVendor = exports.googleSignup = exports.gLogin = exports.CheckExistingUSer = exports.ResetPassword = exports.generateOtpForPassword = exports.findUser = exports.toggleUserBlock = exports.getUsers = exports.login = exports.createRefreshToken = exports.signup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userRepository_1 = require("../Repository/userRepository");
const User_1 = __importDefault(require("../Model/User"));
const generateOtp_1 = __importDefault(require("../Util/generateOtp"));
const CustomError_1 = require("../Error/CustomError");
const dotenv_1 = __importDefault(require("dotenv"));
const Vendor_1 = __importDefault(require("../Model/Vendor"));
const mongoose_1 = __importDefault(require("mongoose"));
const Admin_1 = __importDefault(require("../Model/Admin"));
dotenv_1.default.config();
const signup = (email, password, name, phone) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingUser = yield (0, userRepository_1.findUserByEmail)(email);
        if (existingUser) {
            throw new CustomError_1.CustomError(`User email already exists`, 401);
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        const isActive = true;
        const newUser = yield (0, userRepository_1.createUser)({
            email,
            password: hashedPassword,
            name,
            phone,
            isActive,
        });
        return { user: newUser };
    }
    catch (error) {
        console.error("Error fetching signup", error);
        throw new CustomError_1.CustomError("Unable to fetch signup", 500);
    }
});
exports.signup = signup;
const createRefreshToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = yield User_1.default.findById(decoded._id);
        if (!user || user.refreshToken !== refreshToken) {
            throw new Error('Invalid refresh token');
        }
        const accessToken = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        return accessToken;
    }
    catch (error) {
        console.error("Error fetching user createRefreshToken", error);
        throw new CustomError_1.CustomError("Unable to fetch createRefreshToken", 500);
    }
});
exports.createRefreshToken = createRefreshToken;
const login = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingUser = yield (0, userRepository_1.findUserByEmail)(email);
        if (!existingUser) {
            throw new CustomError_1.CustomError("User not exists..", 404);
        }
        if (!existingUser.isActive) {
            throw new CustomError_1.CustomError(`User is Blocked, can't login`, 401);
        }
        const passwordMatch = yield bcrypt_1.default.compare(password, existingUser.password);
        if (!passwordMatch) {
            throw new CustomError_1.CustomError("Incorrect password..", 401);
        }
        const token = jsonwebtoken_1.default.sign({ _id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: "24h" });
        let refreshToken = jsonwebtoken_1.default.sign({ _id: existingUser._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
        existingUser.refreshToken = refreshToken;
        yield existingUser.save();
        return {
            token,
            refreshToken,
            userData: existingUser,
            message: "Successfully logged in..",
        };
    }
    catch (error) {
        console.error("Error fetching login", error);
        throw new CustomError_1.CustomError("Unable to fetch login", 500);
    }
});
exports.login = login;
const getUsers = (page, limit, search) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield (0, userRepository_1.findAllUsers)(page, limit, search);
        return users;
    }
    catch (error) {
        console.error("Error fetching getUsers", error);
        throw new CustomError_1.CustomError("Unable to fetch getUsers", 500);
    }
});
exports.getUsers = getUsers;
const toggleUserBlock = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        user.isActive = !user.isActive; // Toggle the isActive field
        yield user.save();
        const admindata = yield Admin_1.default.find();
        const Admin = admindata[0];
        Admin.notifications.push({
            _id: new mongoose_1.default.Types.ObjectId(),
            message: `${user.name}'s status was toggled , ${user.isActive ? "active" : "blocked"} now`,
            timestamp: new Date()
        });
        yield Admin.save();
        console.log("notifi pushed", Admin);
    }
    catch (error) {
        console.error("Error fetching toggleUserBlock", error);
        throw new CustomError_1.CustomError("Unable to fetch toggleUserBlock", 500);
    }
});
exports.toggleUserBlock = toggleUserBlock;
const findUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, userRepository_1.findUserById)(userId);
        return user;
    }
    catch (error) {
        console.error("Error fetching findUser", error);
        throw new CustomError_1.CustomError("Unable to fetch findUser", 500);
    }
});
exports.findUser = findUser;
const generateOtpForPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const otpCode = yield (0, generateOtp_1.default)(email);
        if (otpCode !== undefined) {
            return otpCode;
        }
        else {
            console.log("error on generating otp , please fix ..");
            throw new Error(`couldn't generate otp, error occcured ,please fix !!`);
        }
    }
    catch (error) {
        console.error("Error fetching generateOtpForPassword", error);
        throw new CustomError_1.CustomError("Unable to fetch generateOtpForPassword", 500);
    }
});
exports.generateOtpForPassword = generateOtpForPassword;
const ResetPassword = (password, email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        const status = yield (0, userRepository_1.UpdatePassword)(hashedPassword, email);
        if (!status.success) {
            throw new Error(status.message);
        }
    }
    catch (error) {
        console.error("Error fetching ResetPassword", error);
        throw new CustomError_1.CustomError("Unable to fetch ResetPassword", 500);
    }
});
exports.ResetPassword = ResetPassword;
const CheckExistingUSer = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingUser = yield (0, userRepository_1.findUserByEmail)(email);
        return existingUser;
    }
    catch (error) {
        console.error("Error fetching CheckExistingUSer", error);
        throw new CustomError_1.CustomError("Unable to fetch CheckExistingUSer", 500);
    }
});
exports.CheckExistingUSer = CheckExistingUSer;
const gLogin = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingUser = yield (0, userRepository_1.findUserByEmail)(email);
        if (!existingUser) {
            throw new CustomError_1.CustomError("User not exists", 404);
        }
        if (existingUser.isActive === false) {
            throw new CustomError_1.CustomError("User is blocked..", 404);
        }
        const token = jsonwebtoken_1.default.sign({ _id: existingUser._id }, process.env.JWT_SECRET, {
            expiresIn: "24h",
        });
        let refreshToken = jsonwebtoken_1.default.sign({ _id: existingUser._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
        existingUser.refreshToken = refreshToken;
        yield existingUser.save();
        return {
            token: token,
            userData: existingUser,
            refreshToken: refreshToken,
            message: "logged in successfully!",
        };
    }
    catch (error) {
        console.error("Error fetching gLogin", error);
        throw new CustomError_1.CustomError("Unable to fetch gLogin", 500);
    }
});
exports.gLogin = gLogin;
const googleSignup = (email, password, name) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingUser = yield (0, userRepository_1.findUserByEmail)(email);
        if (existingUser) {
            throw new CustomError_1.CustomError("user already exists", 404);
        }
        const isActive = true;
        const newUser = yield (0, userRepository_1.createUser)({ email, password, name, isActive });
        const token = jsonwebtoken_1.default.sign({ _id: newUser._id }, process.env.JWT_SECRET);
        return { token: token, user: newUser };
    }
    catch (error) {
        console.error("Error fetching googleSignup", error);
        throw new CustomError_1.CustomError("Unable to fetch googleSignup", 500);
    }
});
exports.googleSignup = googleSignup;
const FavoriteVendor = (vendorId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findById(userId);
        if (!user) {
            throw new Error("User not found.");
        }
        const vendorIndex = user.favorite.indexOf(vendorId);
        let vendordata;
        if (vendorIndex === -1) {
            user.favorite.push(vendorId);
            vendordata = yield Vendor_1.default.findById(vendorId);
            const data = {
                _id: new mongoose_1.default.Types.ObjectId(),
                message: `${user.name} like your profile`,
                timestamp: new Date(),
                Read: false
            };
            vendordata === null || vendordata === void 0 ? void 0 : vendordata.notifications.push(data);
            yield (vendordata === null || vendordata === void 0 ? void 0 : vendordata.save());
            user.notifications.push({
                _id: new mongoose_1.default.Types.ObjectId(),
                message: `You have favorited a profile. Congrats!`,
                timestamp: new Date(),
                Read: false
            });
            yield user.save();
        }
        else {
            user.favorite.splice(vendorIndex, 1);
        }
        yield user.save();
        const isFavorite = user.favorite.indexOf(vendorId) === -1 ? false : true;
        return {
            userData: user,
            isFavorite: isFavorite,
            vendordata: vendordata
        };
    }
    catch (error) {
        console.error("Error fetching FavoriteVendor", error);
        throw new CustomError_1.CustomError("Unable to fetch FavoriteVendor", 500);
    }
});
exports.FavoriteVendor = FavoriteVendor;
const checkCurrentPassword = (currentpassword, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingUser = yield (0, userRepository_1.findUserById)(userId);
        console.log("existingUser is", existingUser);
        console.log("current password in service is:", currentpassword);
        if (!existingUser) {
            throw new Error("user not found");
        }
        const passwordMatch = yield bcrypt_1.default.compare(currentpassword, existingUser.password);
        if (!passwordMatch) {
            return false;
        }
        return passwordMatch;
    }
    catch (error) {
        console.error("Error fetching checkCurrentPassword", error);
        throw new CustomError_1.CustomError("Unable to fetch checkCurrentPassword", 500);
    }
});
exports.checkCurrentPassword = checkCurrentPassword;
const UpdatePasswordService = (newPassword, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(newPassword, salt);
        const existingUser = yield (0, userRepository_1.findUserById)(userId);
        if (!existingUser) {
            throw new Error("user not found");
        }
        const email = existingUser.email;
        const updatedValue = yield (0, userRepository_1.UpdatePassword)(hashedPassword, email);
        if (updatedValue) {
            existingUser.notifications.push({
                _id: new mongoose_1.default.Types.ObjectId(),
                message: `You have updated your password , Congrats!`,
                timestamp: new Date(),
                Read: false
            });
            yield existingUser.save();
            return true;
        }
        return false;
    }
    catch (error) {
        console.error("Error fetching UpdatePasswordService", error);
        throw new CustomError_1.CustomError("Unable to fetch UpdatePasswordService", 500);
    }
});
exports.UpdatePasswordService = UpdatePasswordService;
const UpdateUserProfile = (userId, name, phone, image, imageUrl) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (0, userRepository_1.UpdateUserProfileDetails)(userId, name, phone, imageUrl, image);
        if (!data) {
            return false;
        }
        return data;
    }
    catch (error) {
        console.error("Error fetching UpdateUserProfile", error);
        throw new CustomError_1.CustomError("Unable to fetch UpdateUserProfile", 500);
    }
});
exports.UpdateUserProfile = UpdateUserProfile;
const FavoriteVendors = (userid, page, pageSize) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { favoriteVendors, totalFavVendorsCount } = yield (0, userRepository_1.getfavVendors)(userid, page, pageSize);
        return { favoriteVendors, totalFavVendorsCount };
    }
    catch (error) {
        console.error("Error fetching FavoriteVendors", error);
        throw new CustomError_1.CustomError("Unable to fetch FavoriteVendors", 500);
    }
});
exports.FavoriteVendors = FavoriteVendors;
const updateNotification = (userid, notifiID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (0, userRepository_1.updateNotificationstatus)(userid, notifiID);
        return data;
    }
    catch (error) {
        console.error("Error fetching updateNotification", error);
        throw new CustomError_1.CustomError("Unable to fetch updateNotification", 500);
    }
});
exports.updateNotification = updateNotification;
const clearalldata = (userid) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (0, userRepository_1.clearNotification)(userid);
        return data;
    }
    catch (error) {
        console.error("Error fetching clearalldata", error);
        throw new CustomError_1.CustomError("Unable to fetch clearalldata", 500);
    }
});
exports.clearalldata = clearalldata;
