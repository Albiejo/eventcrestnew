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
const CustomError_1 = require("../Error/CustomError");
const messageRepository_1 = __importDefault(require("../Repository/messageRepository"));
class MessageService {
    createMessage(conversationId, senderId, text, imageName, imageUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield messageRepository_1.default.create({ conversationId, senderId, text, imageName, imageUrl });
            }
            catch (error) {
                console.error("Error in createMessage:", error);
                throw new CustomError_1.CustomError("Failed to create message.", 500);
            }
        });
    }
    findMessages(conversationId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield messageRepository_1.default.findByCondition({ conversationId });
            }
            catch (error) {
                console.error("Error in findMessages:", error);
                throw new CustomError_1.CustomError("Failed to retrieve messages.", 500);
            }
        });
    }
    changeReadStatus(chatId, senderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return messageRepository_1.default.updateReadStatus(chatId, senderId);
            }
            catch (error) {
                console.error("Error in changeReadStatus:", error);
                throw new CustomError_1.CustomError("Failed to change the status.", 500);
            }
        });
    }
}
exports.default = new MessageService();
