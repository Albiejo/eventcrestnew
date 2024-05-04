import express from "express";
import  AdminController  from "../Controller/adminController";
import  UserController  from "../Controller/userController";
import VendorTypeController  from "../Controller/vendorTypeController";
import  VendorController  from "../Controller/vendorController";
import  PaymentController  from "../Controller/paymentController";
import authenticate from "../Middleware/AdminAuth";
import adminController from "../Controller/adminController";
import bookingController from "../Controller/bookingController";



const router = express.Router();


router.post('/login' , AdminController.Adminlogin);
router.get('/logout' , AdminController.Adminlogout);

router.get('/users' , UserController.allUsers);
router.patch('/block-unblock' ,authenticate, UserController.Toggleblock)
router.post('/refresh-token' , AdminController.createRefreshToken)
router.get('/getadmin',adminController.getFulldetails)

router.get('/getvendors' ,VendorController.getAllVendors )
router.get('/getVendor', VendorController.getVendor)
router.get('/getUser', UserController.getUser)
router.patch('/vendorblock-unblock' ,authenticate, VendorController.Toggleblock)


router.post('/add-type' , authenticate ,VendorTypeController.addVendorType);
router.get('/vendor-types' ,authenticate,VendorTypeController.getVendorTypes);
router.delete('/deleteType' ,authenticate,VendorTypeController.DeleteVendorType)
router.get('/singleVendor' ,authenticate, VendorTypeController.getSingleVendor)
router.put('/updateType' ,authenticate, VendorTypeController.typeUpdate)


router.put('/update-verify-status',authenticate,VendorController.updateVerifyStatus);

router.get('/all-payment-details',authenticate,PaymentController.getAllPayments);

router.patch('/MarkasRead' ,authenticate, AdminController.MarkasRead)
router.get('/getall-payment-details',authenticate,PaymentController.getAllPayments)
router.get('/getallBookings',authenticate ,bookingController.getallBookings)

router.get('/revenue' , authenticate , adminController.getRevenue)
router.get('/notificationCount' ,authenticate , adminController.countNotifications)


export default router;


