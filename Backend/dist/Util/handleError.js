"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = void 0;
const CustomError_1 = require("../Error/CustomError");
function handleError(res, error, contextMessage) {
    if (error instanceof CustomError_1.CustomError) {
        res.status(error.statusCode).json({ message: error.message });
    }
    else {
        console.error(`${contextMessage}:`, error);
        res.status(500).json({ message: error.message });
    }
}
exports.handleError = handleError;
