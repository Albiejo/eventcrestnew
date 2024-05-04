"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const MessageSchema = new mongoose_1.Schema({
    conversationId: String,
    senderId: String,
    text: String,
    imageName: String,
    imageUrl: String
}, {
    timestamps: true
});
exports.default = (0, mongoose_1.model)("Message", MessageSchema);
