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
exports.findAllLive = exports.changeStatusById = exports.createLive = void 0;
const Live_1 = __importDefault(require("../Model/Live"));
const createLive = (url) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield Live_1.default.create({ url });
    }
    catch (error) {
        throw error;
    }
});
exports.createLive = createLive;
const changeStatusById = (url) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield Live_1.default.updateOne({ url: url }, { $set: { finished: true } });
    }
    catch (error) {
        throw error;
    }
});
exports.changeStatusById = changeStatusById;
const findAllLive = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield Live_1.default.find({ finished: false });
    }
    catch (error) {
        throw error;
    }
});
exports.findAllLive = findAllLive;
