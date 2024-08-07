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
exports.deletePostById = exports.findPostById = exports.findPostsByVendorId = exports.createNewPost = void 0;
const Post_1 = __importDefault(require("../Model/Post"));
const createNewPost = (postData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield Post_1.default.create(postData);
        return result;
    }
    catch (error) {
        throw error;
    }
});
exports.createNewPost = createNewPost;
const findPostsByVendorId = (vendor_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield Post_1.default.find({ vendor_id: vendor_id });
        return result;
    }
    catch (error) {
        throw error;
    }
});
exports.findPostsByVendorId = findPostsByVendorId;
const findPostById = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield Post_1.default.findById({ _id });
        return result;
    }
    catch (error) {
        throw error;
    }
});
exports.findPostById = findPostById;
const deletePostById = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield Post_1.default.findByIdAndDelete({ _id });
        return result;
    }
    catch (error) {
        throw error;
    }
});
exports.deletePostById = deletePostById;
