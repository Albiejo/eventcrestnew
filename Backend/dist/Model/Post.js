"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const postSchema = new mongoose_1.Schema({
    caption: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    vendor_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true
    },
    image: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String
    }
});
exports.default = (0, mongoose_1.model)('Post', postSchema);
