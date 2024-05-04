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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateVendorType = exports.getSingleVendordata = exports.deleteVendorType = exports.getTypes = exports.addType = void 0;
const CustomError_1 = require("../Error/CustomError");
const vendorTypeRepository_1 = require("../Repository/vendorTypeRepository");
const addType = (type, status) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingType = yield (0, vendorTypeRepository_1.findVerndorTypeByName)(type);
        if (existingType) {
            throw new Error("Type already exist!");
        }
        const new_type = yield (0, vendorTypeRepository_1.createVendorType)({ type, status: status === "Active" });
        return { message: "New Type added...", new_type };
    }
    catch (error) {
        console.error("Error fetching addType", error);
        throw new CustomError_1.CustomError("Unable to fetch addType", 500);
    }
});
exports.addType = addType;
const getTypes = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const availableTypes = yield (0, vendorTypeRepository_1.findVerndorTypes)();
        return availableTypes;
    }
    catch (error) {
        console.error("Error fetching getTypes", error);
        throw new CustomError_1.CustomError("Unable to fetch getTypes", 500);
    }
});
exports.getTypes = getTypes;
const deleteVendorType = (vendorId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("service", vendorId, typeof vendorId);
        const deletedVendor = yield (0, vendorTypeRepository_1.VendorfindByIdAndDelete)(vendorId);
        if (!deletedVendor) {
            throw new Error('Vendor not found');
        }
    }
    catch (error) {
        console.error("Error fetching deleteVendorType", error);
        throw new CustomError_1.CustomError("Unable to fetch deleteVendorType", 500);
    }
});
exports.deleteVendorType = deleteVendorType;
const getSingleVendordata = (vendorId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield (0, vendorTypeRepository_1.getVendorById)(vendorId);
    }
    catch (error) {
        console.error("Error fetching getSingleVendordata", error);
        throw new CustomError_1.CustomError("Unable to fetch getSingleVendordata", 500);
    }
});
exports.getSingleVendordata = getSingleVendordata;
const updateVendorType = (vendorTypeId, type, status) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updateddata = yield (0, vendorTypeRepository_1.UpdateTypeById)(vendorTypeId, { type, status: status === "Active" ? true : false });
        return updateddata;
    }
    catch (error) {
        console.error("Error fetching updateVendorType", error);
        throw new CustomError_1.CustomError("Unable to fetch updateVendorType", 500);
    }
});
exports.updateVendorType = updateVendorType;
