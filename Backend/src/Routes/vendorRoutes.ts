import express from 'express';
import VendorController  from '../Controller/vendorController';
import  VendorTypeController  from '../Controller/vendorTypeController';  
import PostController  from '../Controller/postController';
import multer from 'multer';
import BookingController  from '../Controller/bookingController';
import authenticate from '../Middleware/VendorAuth';


const router = express.Router();


const storage = multer.memoryStorage()
const upload = multer({ storage: storage })






router.post('/signup' , VendorController.vendorSignup);
router.post('/verifyotp' ,VendorController.verifyOtp)

router.post('/login' , VendorController.VendorLogin)
router.get('/logout' , VendorController.VendorLogout)
router.get('/resendOtp' , VendorController.resendOtp)
router.post('/refresh-token' , VendorController.createRefreshToken)

router.get('/vendor-types' , VendorTypeController.getVendorTypes);
router.post('/vgetotp' , VendorController.VendorForgotPassword);

router.post('/verifyVendorotp' , VendorController.VerifyOtpForPassword);
router.post('/resetVendorPassword' , VendorController.ResetVendorPassword);


router.get('/getvendors',VendorController.getAllVendors );
router.get('/getVendor', VendorController.getVendor)
router.patch('/updateProfilePassword' ,authenticate , VendorController.UpdateProfilePassword);

router.post('/add-post' ,upload.single('image'),authenticate ,PostController.addNewPost);
router.get('/posts', PostController.getPosts);
router.delete('/posts/:id',authenticate,PostController.deletePost);

router.put('/updateProfile',authenticate ,upload.fields([{ name: 'coverpic', maxCount: 1 }, { name: 'logo', maxCount: 1 }]) ,VendorController.updateProfiledetails );                                                                                                                                                                                                                                                  

router.put('/add-review-reply',authenticate ,VendorController.addReviewReply)


router.get('/booking-details',authenticate ,BookingController.getAllBookingsbyvendor);
router.get('/single-booking-details',authenticate ,BookingController.getBookingsById);
router.put('/update-booking-status',authenticate ,BookingController.updateStatus)
router.get('/getallBookings',authenticate ,BookingController.getallBookings)
router.post('/verification-request',authenticate ,VendorController.sendVerifyRequest)

router.patch('/MarkAsRead' , authenticate , VendorController.MarkasRead)
router.patch('/ClearAll' ,authenticate ,VendorController.clearAllNotifications)


router.get("/revenue", VendorController.getRevenue);


export default router;