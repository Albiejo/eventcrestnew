"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vendorOtpExpiration = exports.userEmailVerifyOtp = exports.userOtpExpiration = void 0;
const userOtpExpiration = (req, res, next) => {
    var _a, _b, _c, _d, _e;
    const now = Date.now();
    if (((_a = req.session) === null || _a === void 0 ? void 0 : _a.user) && ((_c = (_b = req.session) === null || _b === void 0 ? void 0 : _b.user) === null || _c === void 0 ? void 0 : _c.otpCode) && ((_e = (_d = req.session) === null || _d === void 0 ? void 0 : _d.user) === null || _e === void 0 ? void 0 : _e.otpSetTimestamp)) {
        const timeElapsed = now - req.session.user.otpSetTimestamp;
        if (timeElapsed >= 60000) { // Check if 1 minute has passed
            // Expire OTP code
            req.session.user.otpCode = undefined;
            req.session.user.otpSetTimestamp = undefined;
            console.log("Expired OTP code cleaned up");
        }
    }
    next();
};
exports.userOtpExpiration = userOtpExpiration;
//forgot-password
const userEmailVerifyOtp = (req, res, next) => {
    var _a, _b, _c;
    const now = Date.now();
    if (((_a = req.session) === null || _a === void 0 ? void 0 : _a.otp) && ((_b = req.session.otp) === null || _b === void 0 ? void 0 : _b.otp) && ((_c = req.session.otp) === null || _c === void 0 ? void 0 : _c.otpSetTimestamp)) {
        const timeElapsed = now - req.session.otp.otpSetTimestamp;
        if (timeElapsed >= 60000) { // Check if 1 minute has passed
            // Expire OTP code
            req.session.otp.otp = undefined;
            req.session.otp.otpSetTimestamp = undefined;
            console.log("Expired OTP code cleaned up");
        }
    }
    next();
};
exports.userEmailVerifyOtp = userEmailVerifyOtp;
const vendorOtpExpiration = (req, res, next) => {
    var _a, _b, _c, _d, _e;
    const now = Date.now();
    if (((_a = req.session) === null || _a === void 0 ? void 0 : _a.vendor) && ((_c = (_b = req.session) === null || _b === void 0 ? void 0 : _b.vendor) === null || _c === void 0 ? void 0 : _c.otpCode) && ((_e = (_d = req.session) === null || _d === void 0 ? void 0 : _d.vendor) === null || _e === void 0 ? void 0 : _e.otpSetTimestamp)) {
        const timeElapsed = now - req.session.vendor.otpSetTimestamp;
        if (timeElapsed >= 60000) { // Check if 1 minute has passed
            // Expire OTP code
            req.session.vendor.otpCode = undefined;
            req.session.vendor.otpSetTimestamp = undefined;
            console.log("Expired OTP code cleaned up");
        }
    }
    next();
};
exports.vendorOtpExpiration = vendorOtpExpiration;
