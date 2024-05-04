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
const Conversation_1 = __importDefault(require("../Model/Conversation"));
const handleError_1 = require("../Util/handleError");
class conversationController {
    createChat(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { senderId, receiverId } = req.body;
            try {
                let chat = yield Conversation_1.default.findOne({ members: [senderId, receiverId] });
                if (!chat) {
                    const newChat = new Conversation_1.default({ members: [senderId, receiverId] });
                    chat = yield newChat.save();
                }
                return res.status(200).json(chat);
            }
            catch (error) {
                (0, handleError_1.handleError)(res, error, "createChat");
            }
        });
    }
    findUserchats(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.query;
            try {
                const chats = yield Conversation_1.default.find({ members: { $in: [userId] } });
                chats.sort((a, b) => (b.latestMessageTimestamp || new Date()).getTime() - (a.latestMessageTimestamp || new Date()).getTime());
                return res.status(200).json(chats);
            }
            catch (error) {
                (0, handleError_1.handleError)(res, error, "findUserchats");
            }
        });
    }
}
;
exports.default = new conversationController();
