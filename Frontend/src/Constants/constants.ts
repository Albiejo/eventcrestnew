//user routes


export const USERROUTES = { 
   
    USER_HOME : '/',
    USER_LOGIN :'/login',
    USER_SIGNUP :'/signup',
    VERIFY :'/verify',
    FORGOT_PASSWORD:'/forgot-password',
    RESET_PASSWORD : "/reset-password",
    ABOUT :'/about',
    VIEW_VENDOR :'/viewVendor',
    VENDORS :'/vendors',
    CHAT :'/chat/',
    BOOKEVENT:'/bookevent',
    PAYMENT_SUCCESS:'/payment-success',
    LIVE:'/live',
    ROOM:'/room/:roomId/:role_str',
    LOGOUT:'/logout',
    USER_NOTIFICATIONS:'/profile/notifications',
    USER_PROFILE:'/profile',
    PROFILE_CHANGEPASSWORD:'/profile/change-password',
    FAVORITES:'/profile/Favorites',
    BOOKINGS:'/profile/Bookings',




}



//ADMIN routes

export const ADMINROUTES = {

        ADMIN_LOGIN :'/admin',
        ADMIN_DASHBOARD :'/admin/dashboard',
        ADMIN_VENDORS :'/admin/vendors',
        ADMIN_VENDORTYPES :'/admin/vendor-types',
        ADMIN_USERS:'/admin/users',
        ADMIN_VENDOR:'/admin/vendor',
        ADMIN_WALLET:'/admin/wallet',
        ADMIN_NOTIFICATIONS:'/admin/notifications',
        ADMIN_LOGOUT:'/logout',


}


//VENDOR routes

export const VENDORROUTES = {

        VENDOR_SIGNUP:'/vendor/signup',
        VENDOR_LOGIN:'/vendor/login',
        VENDOR_LOGOUT:'/logout',
        VENDOR_VERIFY:'/vendor/verify',
        VENDOR_DASHBOARD:'/vendor',
        VENDOR_PROFILE:'/vendor/view-profile',
        VENDOR_EDITPROFILE:'/vendor/edit-profile',
        VENDOR_CHANGEPASSWORD:'/vendor/change-password',
        VENDOR_VIEWPOST:'/vendor/view-posts',
        VENDOR_ADDPOST:'/vendor/add-post',
        VENDOR_BOOKINGHISTORY:'/vendor/booking-history',
        VENDOR_VIEWBOOKING:'/vendor/view-booking',
        VENDOR_REVIEWS:'/vendor/reviews',
        VENDOR_NOTIFICATIONS:'/vendor/notifications',
        VENDOR_CHAT:'/vendor/chat'
        
}