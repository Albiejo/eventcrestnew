"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ConversationSchema = new mongoose_1.Schema({
    members: [String],
    latestMessageTimestamp: Date
}, {
    timestamps: true
});
exports.default = (0, mongoose_1.model)("conversation", ConversationSchema);
