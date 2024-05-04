"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const messageController_1 = __importDefault(require("../Controller/messageController"));
exports.router = express_1.default.Router();
exports.router.post('/', messageController_1.default.createMessage);
exports.router.get('/', messageController_1.default.getMessages);
exports.default = exports.router;
