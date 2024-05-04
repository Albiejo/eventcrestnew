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
exports.UpdateTypeById = exports.getVendorById = exports.VendorfindByIdAndDelete = exports.findVerndorIdByType = exports.findVerndorTypes = exports.findVerndorTypeByName = exports.createVendorType = void 0;
const VendorType_1 = __importDefault(require("../Model/VendorType"));
const createVendorType = (vendorData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield VendorType_1.default.create(vendorData);
    }
    catch (error) {
        throw error;
    }
});
exports.createVendorType = createVendorType;
const findVerndorTypeByName = (type) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield VendorType_1.default.findOne({ type });
    }
    catch (error) {
        throw error;
    }
});
exports.findVerndorTypeByName = findVerndorTypeByName;
const findVerndorTypes = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield VendorType_1.default.find();
    }
    catch (error) {
        throw error;
    }
});
exports.findVerndorTypes = findVerndorTypes;
const findVerndorIdByType = (type) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield VendorType_1.default.findOne({ type: type });
        return data;
    }
    catch (error) {
        throw error;
    }
});
exports.findVerndorIdByType = findVerndorIdByType;
const VendorfindByIdAndDelete = (vendorId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedVendor = yield VendorType_1.default.findByIdAndDelete(vendorId);
        if (!deletedVendor) {
            throw Error;
        }
        else {
            return "deleted type";
        }
    }
    catch (error) {
        throw error;
    }
});
exports.VendorfindByIdAndDelete = VendorfindByIdAndDelete;
const getVendorById = (vendorId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield VendorType_1.default.findOne({ _id: vendorId });
    }
    catch (error) {
        throw error;
    }
});
exports.getVendorById = getVendorById;
const UpdateTypeById = (vendortypeId, update) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedData = yield VendorType_1.default.findByIdAndUpdate(vendortypeId, update, { new: true });
        return updatedData;
    }
    catch (error) {
        throw new Error('Failed to update vendor type in the Db , try again !!');
    }
});
exports.UpdateTypeById = UpdateTypeById;
