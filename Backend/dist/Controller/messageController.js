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
const MessageModel_1 = __importDefault(require("../Model/MessageModel"));
const Conversation_1 = __importDefault(require("../Model/Conversation"));
const handleError_1 = require("../Util/handleError");
class messageController {
    createMessage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { conversationId, senderId, text, imageName, imageUrl } = req.body;
            const message = new MessageModel_1.default({
                conversationId,
                senderId,
                text,
                imageName,
                imageUrl
            });
            try {
                const response = yield message.save();
                yield Conversation_1.default.findByIdAndUpdate(conversationId, { latestMessageTimestamp: new Date() }, { new: true });
                res.status(200).json(response);
            }
            catch (error) {
                (0, handleError_1.handleError)(res, error, "createMessage");
            }
        });
    }
    getMessages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const conversationId = req.query.conversationId;
            try {
                const messages = yield MessageModel_1.default.find({ conversationId: conversationId });
                return res.status(200).json(messages);
            }
            catch (error) {
                (0, handleError_1.handleError)(res, error, "getMessages");
            }
        });
    }
}
exports.default = new messageController();
