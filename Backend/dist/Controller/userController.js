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
const userService_1 = require("../Service/userService");
const generateOtp_1 = __importDefault(require("../Util/generateOtp"));
const CustomError_1 = require("../Error/CustomError");
const User_1 = __importDefault(require("../Model/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const sharp_1 = __importDefault(require("sharp"));
const crypto_1 = __importDefault(require("crypto"));
const dotenv_1 = __importDefault(require("dotenv"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const enums_1 = require("../Util/enums");
const handleError_1 = require("../Util/handleError");
dotenv_1.default.config();
//amazon s3 settings
const s3 = new client_s3_1.S3Client({
    credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
    },
    region: process.env.BUCKET_REGION,
});
const randomImage = (bytes = 32) => crypto_1.default.randomBytes(bytes).toString("hex");
class UserController {
    UserSignup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password, name, phone } = req.body;
                const otpCode = yield (0, generateOtp_1.default)(email);
                if (otpCode !== undefined) {
                    req.session.user = {
                        email: email,
                        password: password,
                        name: name,
                        phone: parseInt(phone),
                        otpCode: otpCode,
                        otpSetTimestamp: Date.now(),
                    };
                    return res.status(200).json({ message: "OTP send to email for verification..", email: email });
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
                (0, handleError_1.handleError)(res, error, "UserSignup");
            }
        });
    }
    verifyOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const otp = req.body.otp;
                const userData = req.session.user;
                if (!userData) {
                    res.status(400).json({ error: "Session data not found. Please sign up again." });
                    return;
                }
                const email = userData.email;
                const password = userData.password;
                const name = userData.name;
                const phone = userData.phone;
                if (!userData.otpCode) {
                    throw new CustomError_1.CustomError("OTP Expired...Try again with new OTP !!", 400);
                }
                const otpCode = userData.otpCode;
                if (otp === otpCode) {
                    const user = yield (0, userService_1.signup)(email, password, name, phone);
                    if (user) {
                        delete req.session.user;
                        //signup data in session deleted  after storing in DB
                        res.status(201).json(user);
                    }
                }
                else {
                    res.status(400).json({ message: "Invalid otp !!" });
                }
            }
            catch (error) {
                if (error.code === 11000 && error.keyPattern && error.keyValue) {
                    const duplicateField = Object.keys(error.keyPattern)[0];
                    const duplicateValue = error.keyValue[duplicateField];
                    res
                        .status(500)
                        .json({
                        message: `The ${duplicateField} '${duplicateValue}' is already in use.`,
                    });
                }
                else if (error instanceof CustomError_1.CustomError) {
                    res.status(error.statusCode).json({ message: error.message });
                }
                else {
                    console.error(error);
                    res.status(500).json({ message: enums_1.ErrorMessages.ServerError });
                }
            }
        });
    }
    UserLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const { refreshToken, token, userData, message } = yield (0, userService_1.login)(email, password);
                res.cookie("jwtToken", token, { httpOnly: true });
                return res.status(200).json({ token, userData, message, refreshToken });
            }
            catch (error) {
                (0, handleError_1.handleError)(res, error, "UserLogin");
            }
        });
    }
    getUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.query.userId;
                const data = yield (0, userService_1.findUser)(userId);
                return res.status(200).json(data);
            }
            catch (error) {
                (0, handleError_1.handleError)(res, error, "getUser");
            }
        });
    }
    UserLogout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.clearCookie("jwtToken");
                return res.status(200).json({ message: "User logged out successfully" });
            }
            catch (error) {
                (0, handleError_1.handleError)(res, error, "UserLogout");
            }
        });
    }
    createRefreshToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { refreshToken } = req.body;
                const token = yield (0, userService_1.createRefreshToken)(refreshToken);
                return res.status(200).json({ token });
            }
            catch (error) {
                (0, handleError_1.handleError)(res, error, "createRefreshToken");
            }
        });
    }
    allUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = 1, limit = 10, search = "" } = req.query;
                const pageNumber = parseInt(page, 10);
                const limitNumber = parseInt(limit, 10);
                const users = yield (0, userService_1.getUsers)(pageNumber, limitNumber, search.toString());
                return res.status(200).json({ users, pageNumber });
            }
            catch (error) {
                (0, handleError_1.handleError)(res, error, "get allUsers");
            }
        });
    }
    Toggleblock(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.query.userId;
                if (!userId) {
                    throw new Error("User ID is missing or invalid.");
                }
                yield (0, userService_1.toggleUserBlock)(userId);
                const User = yield User_1.default.findById(userId);
                return res.status(200).json({ message: "User block status updated." });
            }
            catch (error) {
                (0, handleError_1.handleError)(res, error, "Toggleblock user block");
            }
        });
    }
    UserForgotPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const email = req.body.email;
                const user = yield (0, userService_1.CheckExistingUSer)(email);
                if (user) {
                    const otp = yield (0, userService_1.generateOtpForPassword)(email);
                    req.session.otp = {
                        otp: otp,
                        email: email,
                        otpSetTimestamp: Date.now(),
                    };
                    return res.status(200).json({ message: "OTP sent to email", email: email });
                }
                else {
                    return res.status(400).json({ error: "Email not Registered with us !!" });
                }
            }
            catch (error) {
                (0, handleError_1.handleError)(res, error, "UserForgotPassword");
            }
        });
    }
    VerifyOtpForPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const ReceivedOtp = req.body.otp;
                const generatedOtp = (_a = req.session.otp) === null || _a === void 0 ? void 0 : _a.otp;
                if (!req.session.otp) {
                    throw new CustomError_1.CustomError("OTP Expired.Try again.", 400);
                }
                if (ReceivedOtp === generatedOtp) {
                    console.log("otp is correct , navigating user to update password.");
                    return res.status(200).json({ data: "otp is correct" });
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
    ResetUserPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const password = req.body.password;
                const confirmPassword = req.body.confirm_password;
                if (password === confirmPassword) {
                    const email = req.session.otp.email;
                    yield (0, userService_1.ResetPassword)(password, email);
                    return res.status(200).json({ message: "Password reset successfully." });
                }
                else {
                    return res.status(400).json({ error: "Passwords do not match." });
                }
            }
            catch (error) {
                (0, handleError_1.handleError)(res, error, "ResetUserPassword");
            }
        });
    }
    ResendOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = req.session.user;
                console.log("userData", userData);
                if (!userData) {
                    return res.status(400).json({ error: "Session data not found. Please sign up again." });
                    console.log("no session data found");
                }
                const email = userData.email;
                const newOtp = yield (0, generateOtp_1.default)(email);
                if (!email) {
                    return res.status(400).json({ error: "Email not found in session data." });
                }
                if (req.session.user) {
                    req.session.user.otpCode = newOtp;
                }
                else {
                    console.error("Session user data is unexpectedly undefined.");
                    return res.status(500).json({ message: "Server Error: Session user data is unexpectedly undefined." });
                }
                console.log("user session after resend", req.session.user);
                return res.status(200).json({ message: "New OTP sent to email" });
            }
            catch (error) {
                (0, handleError_1.handleError)(res, error, "ResendOtp");
            }
        });
    }
    UseGoogleLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decodeInfo = jsonwebtoken_1.default.decode(req.body.credential);
                if (!decodeInfo) {
                    return res.status(400).json({ error: "Invalid credentials" });
                }
                const { email, jti } = decodeInfo;
                const password = jti;
                const { token, userData, message } = yield (0, userService_1.gLogin)(email, password);
                req.session.user = userData._id;
                res.cookie("jwtToken", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                });
                res.status(200).json({ token, userData, message });
            }
            catch (error) {
                (0, handleError_1.handleError)(res, error, "UseGoogleLogin");
            }
        });
    }
    UseGoogleRegister(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.body.credential;
                const decodedInfo = jsonwebtoken_1.default.decode(req.body.credential);
                const { name, email, jti } = decodedInfo;
                const user = yield (0, userService_1.googleSignup)(email, jti, name);
                if (user) {
                    res.status(200).json({ message: "User account registered .." });
                }
            }
            catch (error) {
                (0, handleError_1.handleError)(res, error, "UseGoogleRegister");
            }
        });
    }
    passwordResendOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const otp = req.session.otp;
                if (!otp) {
                    res
                        .status(400)
                        .json({ error: "Session data not found. Please sign up again." });
                    return;
                }
                const email = otp.email;
                const newOtp = yield (0, generateOtp_1.default)(email);
                if (req.session.otp) {
                    req.session.otp.otp = newOtp;
                }
                else {
                    console.error("session data is undefined..");
                    res
                        .status(500)
                        .json({ message: "Server Error , session data is undefined.. " });
                    return;
                }
            }
            catch (error) {
                (0, handleError_1.handleError)(res, error, "passwordResendOtp");
            }
        });
    }
    AddFavVendor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { vendorId, userId } = req.query;
                if (!vendorId) {
                    return res.status(400).json({ error: "Invalid vendor id." });
                }
                if (!userId) {
                    return res.status(400).json({ message: "Invalid user id." });
                }
                const data = yield (0, userService_1.FavoriteVendor)(vendorId, userId);
                return res.status(200).json({ data: data });
            }
            catch (error) {
                (0, handleError_1.handleError)(res, error, "AddFavVendor");
            }
        });
    }
    getFavoriteVendors(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.query.userid;
                const page = parseInt(req.query.page) || 1;
                const pageSize = parseInt(req.query.pageSize) || 8;
                if (!userId) {
                    return res.status(400).json({ error: "Invalid user id." });
                }
                const { favoriteVendors, totalFavVendorsCount } = yield (0, userService_1.FavoriteVendors)(userId, page, pageSize);
                const totalPages = Math.ceil(totalFavVendorsCount / pageSize);
                if (favoriteVendors) {
                    return res.status(200).json({ data: favoriteVendors, totalPages: totalPages });
                }
                else {
                    return res.status(400).json({ message: "No vendors in favorites." });
                }
            }
            catch (error) {
                (0, handleError_1.handleError)(res, error, "getFavoriteVendors");
            }
        });
    }
    UpdatePasswordController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const currentPassword = req.body.current_password;
                const newPassword = req.body.new_password;
                const userId = req.query.userid;
                let status = yield (0, userService_1.checkCurrentPassword)(currentPassword, userId);
                if (!status) {
                    return res.status(400).json({ error: `Current password doesn't match` });
                }
                const data = yield (0, userService_1.UpdatePasswordService)(newPassword, userId);
                if (!data) {
                    return res.status(400).json({ error: "couldn't update password..internal error." });
                }
                return res.status(200).json({ message: "password updated successfully.." });
            }
            catch (error) {
                (0, handleError_1.handleError)(res, error, "UpdatePasswordController user");
            }
        });
    }
    UpdateProfileDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const name = req.body.name;
                const phone = parseInt(req.body.phone);
                const userid = req.query.userid;
                let imageName = "";
                let imageUrl = "";
                if (req.file) {
                    const buffer = yield (0, sharp_1.default)((_a = req.file) === null || _a === void 0 ? void 0 : _a.buffer)
                        .resize({ height: 1200, width: 1200, fit: "contain" })
                        .toBuffer();
                    imageName = randomImage();
                    const params = {
                        Bucket: process.env.BUCKET_NAME,
                        Key: imageName,
                        Body: buffer,
                        ContentType: (_b = req.file) === null || _b === void 0 ? void 0 : _b.mimetype,
                    };
                    const command2 = new client_s3_1.PutObjectCommand(params);
                    yield s3.send(command2);
                    const getObjectParams = {
                        Bucket: process.env.BUCKET_NAME,
                        Key: imageName
                    };
                    const command = new client_s3_1.GetObjectCommand(getObjectParams);
                    imageUrl = yield (0, s3_request_presigner_1.getSignedUrl)(s3, command, {
                        expiresIn: 86400 * 3,
                    });
                }
                const data = yield (0, userService_1.UpdateUserProfile)(userid, name, phone, imageName, imageUrl);
                if (!data) {
                    res.status(400).json({ error: `couldn't update details..try after soem time` });
                }
                res.status(200).json({ message: "Profile details updated successfully", data: data });
            }
            catch (error) {
                (0, handleError_1.handleError)(res, error, "UpdateProfileDetails");
            }
        });
    }
    MarkRead(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, notifiId } = req.query;
                const data = yield (0, userService_1.updateNotification)(userId, notifiId);
                if (data) {
                    res.status(200).json({ data: data });
                }
            }
            catch (error) {
                (0, handleError_1.handleError)(res, error, "MarkRead");
            }
        });
    }
    subscribe(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const transporter = nodemailer_1.default.createTransport({
                    host: "smtp.gmail.com",
                    port: 587,
                    secure: false,
                    requireTLS: true,
                    auth: {
                        user: process.env.USER_NAME,
                        pass: process.env.USER_PASSWORD,
                    },
                    tls: {
                        rejectUnauthorized: false
                    }
                });
                const mailOptions = {
                    from: process.env.USER_NAME,
                    to: email,
                    subject: "NEWS-LETTER",
                    text: `Congrats for subscribing to Event Crest newsletter ! , You wll receive a newsletter from  event crest every week`,
                };
                const info = yield transporter.sendMail(mailOptions);
                return res.status(200).json({ success: true });
            }
            catch (error) {
                (0, handleError_1.handleError)(res, error, "subscribe");
            }
        });
    }
    clearAllNotifications(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userid = req.query.userId;
                const data = yield (0, userService_1.clearalldata)(userid);
                res.status(200).json(data);
            }
            catch (error) {
                (0, handleError_1.handleError)(res, error, "clearAllNotifications");
            }
        });
    }
}
;
exports.default = new UserController();
