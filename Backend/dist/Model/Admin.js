"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const adminSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    isAdmin: {
        type: Boolean,
        required: true
    },
    refreshToken: {
        type: String
    },
    Wallet: {
        type: Number
    },
    notifications: [{
            _id: { type: mongoose_1.Schema.Types.ObjectId, default: mongoose_1.Types.ObjectId },
            message: String,
            timestamp: { type: Date, default: Date.now },
            Read: { type: Boolean, default: false }
        }]
});
exports.default = (0, mongoose_1.model)('Admin', adminSchema);
