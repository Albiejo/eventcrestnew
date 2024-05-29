"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Conversation_1 = __importDefault(require("../Model/Conversation"));
const baseRepository_1 = require("./baseRepository");
const MAX_MESSAGE_LENGTH = 10;
class ConversationRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(Conversation_1.default);
    }
    findByIdAndUpdate(id, text) {
        const slicedText = text.length > MAX_MESSAGE_LENGTH ? `${text.slice(0, MAX_MESSAGE_LENGTH)}...` : text;
        return Conversation_1.default.findOneAndUpdate({ _id: id }, { $set: { latestMessage: slicedText } });
    }
    findConversations(userId) {
        return Conversation_1.default.find({ members: { $in: [userId] } }).sort({ updatedAt: -1 });
    }
}
exports.default = new ConversationRepository();
