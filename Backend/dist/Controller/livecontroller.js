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
const liveService_1 = require("../Service/liveService");
const handleError_1 = require("../Util/handleError");
class LiveController {
    getLive(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield (0, liveService_1.getAllLive)();
                return res.status(200).json({ data: data });
            }
            catch (error) {
                (0, handleError_1.handleError)(res, error, "getLive");
            }
        });
    }
    addLive(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("inside live controller 2 and adding live to db");
                const { url } = req.body;
                const data = yield (0, liveService_1.addNewLive)(url);
                return res.status(200).json({ live: data });
            }
            catch (error) {
                (0, handleError_1.handleError)(res, error, "addLive");
            }
        });
    }
    changeLiveStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("inside live controller 3");
                const { url } = req.body;
                console.log(url);
                const data = yield (0, liveService_1.changeStatus)(url);
                return res.status(200).json({ live: data });
            }
            catch (error) {
                (0, handleError_1.handleError)(res, error, "changeLiveStatus");
            }
        });
    }
}
;
exports.default = new LiveController();
