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
const vendorTypeService_1 = require("../Service/vendorTypeService");
const handleError_1 = require("../Util/handleError");
class VendorTypeController {
    addVendorType(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { type, status } = req.body;
                const vendor = yield (0, vendorTypeService_1.addType)(type, status);
                return res.status(201).json(vendor);
            }
            catch (error) {
                (0, handleError_1.handleError)(res, error, "addVendorType");
            }
        });
    }
    getVendorTypes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const vendorTypes = yield (0, vendorTypeService_1.getTypes)();
                return res.status(200).json(vendorTypes);
            }
            catch (error) {
                (0, handleError_1.handleError)(res, error, "getVendorTypes");
            }
        });
    }
    DeleteVendorType(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const Id = req.query.Id;
                if (!Id) {
                    return res.status(400).json({ error: "Vendor ID is required." });
                }
                yield (0, vendorTypeService_1.deleteVendorType)(Id);
                return res.status(200).json({ message: "vendor deleted" });
            }
            catch (error) {
                (0, handleError_1.handleError)(res, error, "DeleteVendorType");
            }
        });
    }
    getSingleVendor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const vendorTypeId = (_a = req.query) === null || _a === void 0 ? void 0 : _a.id;
                if (!vendorTypeId) {
                    return res.status(400).json({ message: "Invalid vendor type Id" });
                }
                const result = yield (0, vendorTypeService_1.getSingleVendordata)(vendorTypeId);
                return res.status(200).json(result);
            }
            catch (error) {
                (0, handleError_1.handleError)(res, error, "getSingleVendor");
            }
        });
    }
    typeUpdate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const vendorTypeId = (_a = req.query) === null || _a === void 0 ? void 0 : _a.id;
                if (!vendorTypeId) {
                    return res.status(400).json({ message: "Invalid vendor id.." });
                }
                const { type, status } = req.body;
                const result = yield (0, vendorTypeService_1.updateVendorType)(vendorTypeId, type, status);
                return res.status(200).json(result);
            }
            catch (error) {
                (0, handleError_1.handleError)(res, error, "typeUpdate in vendor");
            }
        });
    }
}
;
exports.default = new VendorTypeController();
