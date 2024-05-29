"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = __importDefault(require("../Controller/adminController"));
const userController_1 = __importDefault(require("../Controller/userController"));
const vendorTypeController_1 = __importDefault(require("../Controller/vendorTypeController"));
const vendorController_1 = __importDefault(require("../Controller/vendorController"));
const paymentController_1 = __importDefault(require("../Controller/paymentController"));
const AdminAuth_1 = __importDefault(require("../Middleware/AdminAuth"));
const adminController_2 = __importDefault(require("../Controller/adminController"));
const bookingController_1 = __importDefault(require("../Controller/bookingController"));
const router = express_1.default.Router();
router.post('/login', adminController_1.default.Adminlogin);
router.get('/logout', adminController_1.default.Adminlogout);
router.get('/getAllAdmins', adminController_2.default.getAllAdminData);
router.get('/users', userController_1.default.allUsers);
router.patch('/block-unblock', AdminAuth_1.default, userController_1.default.Toggleblock);
router.post('/refresh-token', adminController_1.default.createRefreshToken);
router.get('/getadmin', adminController_2.default.getFulldetails);
router.get('/getvendors', vendorController_1.default.getAllVendors);
router.get('/getVendor', vendorController_1.default.getVendor);
router.get('/getUser', userController_1.default.getUser);
router.patch('/vendorblock-unblock', AdminAuth_1.default, vendorController_1.default.Toggleblock);
router.post('/add-type', AdminAuth_1.default, vendorTypeController_1.default.addVendorType);
router.get('/vendor-types', AdminAuth_1.default, vendorTypeController_1.default.getVendorTypes);
router.delete('/deleteType', AdminAuth_1.default, vendorTypeController_1.default.DeleteVendorType);
router.get('/singleVendor', AdminAuth_1.default, vendorTypeController_1.default.getSingleVendor);
router.put('/updateType', AdminAuth_1.default, vendorTypeController_1.default.typeUpdate);
router.put('/update-verify-status', AdminAuth_1.default, vendorController_1.default.updateVerifyStatus);
router.get('/all-payment-details', AdminAuth_1.default, paymentController_1.default.getAllPayments);
router.patch('/MarkasRead', AdminAuth_1.default, adminController_1.default.MarkasRead);
router.get('/getall-payment-details', AdminAuth_1.default, paymentController_1.default.getAllPayments);
router.get('/getallBookings', AdminAuth_1.default, bookingController_1.default.getallBookings);
router.get('/revenue', AdminAuth_1.default, adminController_2.default.getRevenue);
router.get('/notificationCount', AdminAuth_1.default, adminController_2.default.countNotifications);
router.patch('/ClearAll', AdminAuth_1.default, adminController_2.default.clearAllNotification);
router.post('/createAdmin', adminController_2.default.AdmincreateAdmin);
exports.default = router;
