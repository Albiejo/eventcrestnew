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
exports.AdminRepository = void 0;
const Admin_1 = __importDefault(require("../Model/Admin"));
const baseRepository_1 = require("./baseRepository");
class AdminRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(Admin_1.default);
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Admin_1.default.findOne({ email });
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Admin_1.default.findById(id);
        });
    }
}
exports.AdminRepository = AdminRepository;
