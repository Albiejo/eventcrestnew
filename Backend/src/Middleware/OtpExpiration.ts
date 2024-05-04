import { NextFunction, Request , Response } from "express";


export const userOtpExpiration = (req: Request, res: Response, next: NextFunction) => {
    const now = Date.now();
    if (req.session?.user && req.session?.user?.otpCode && req.session?.user?.otpSetTimestamp) {
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



//forgot-password
export const userEmailVerifyOtp = (req: Request, res: Response, next: NextFunction) => {
    const now = Date.now();
    if (req.session?.otp && req.session.otp?.otp && req.session.otp?.otpSetTimestamp) {
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


export const vendorOtpExpiration = (req: Request, res: Response, next: NextFunction) => {
    const now = Date.now();
    if (req.session?.vendor  && req.session?.vendor?.otpCode && req.session?.vendor?.otpSetTimestamp) {
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




