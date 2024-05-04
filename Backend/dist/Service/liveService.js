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
exports.getAllLive = exports.changeStatus = exports.addNewLive = void 0;
const CustomError_1 = require("../Error/CustomError");
const liveRepository_1 = require("../Repository/liveRepository");
const addNewLive = (url) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (0, liveRepository_1.createLive)(url);
        return data;
    }
    catch (error) {
        console.error("Error fetching addNewLive", error);
        throw new CustomError_1.CustomError("Unable to fetch addNewLive", 500);
    }
});
exports.addNewLive = addNewLive;
const changeStatus = (url) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (0, liveRepository_1.changeStatusById)(url);
        return data;
    }
    catch (error) {
        console.error("Error fetching changeStatus in live", error);
        throw new CustomError_1.CustomError("Unable to fetch changeStatus in live", 500);
    }
});
exports.changeStatus = changeStatus;
const getAllLive = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (0, liveRepository_1.findAllLive)();
        return data;
    }
    catch (error) {
        console.error("Error fetching getAllLive", error);
        throw new CustomError_1.CustomError("Unable to fetch getAllLive", 500);
    }
});
exports.getAllLive = getAllLive;
