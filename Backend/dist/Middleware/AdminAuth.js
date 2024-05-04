"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function authenticate(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
        console.log("error from middleware , Token not provided");
        return res.status(401).json({ message: 'Token not provided' });
    }
    // Extract token from header string (Bearer <token>)
    const accessToken = token.split(' ')[1];
    jsonwebtoken_1.default.verify(accessToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log("error from middleware , Invalid token");
            return res.status(401).json({ message: 'Invalid token' });
        }
        // Attach the decoded user information to the request object
        req.Admin = decoded;
        next();
    });
}
exports.default = authenticate;
