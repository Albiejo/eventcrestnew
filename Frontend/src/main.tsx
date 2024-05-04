
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  
} from "react-router-dom";

import { Provider } from 'react-redux';
import {store ,persistor} from './Redux/store.ts';
import { PersistGate } from 'redux-persist/integration/react';


//admin
import AdminApp from './Pages/admin/AdminApp.tsx'
import Dashboard from './Pages/admin/Dahboard.tsx';
import AdminLogin from './Components/Admin/Login.tsx'
import AdminPrivateRoute from './Components/Admin/AdminPrivateRoute.tsx';
import Wallet from './Pages/admin/Wallet.tsx';
import AdminNotifications from './Pages/admin/AdminNotifications.tsx';


//common routes
import HomePage from './Pages/home/HomePage.tsx'
import ForgotPassword from './Components/Common/ForgotPassword.tsx';
import ResetPassword from './Components/Common/ResetPassword.tsx';
import AboutPage from './Pages/home/AboutPage.tsx';
import NotFound from './Components/Error/NotFound.tsx';
import Room from './Components/Live/Room.tsx';


//user
import UserLoginForm from './Components/User/Login.tsx';
import UserSignupForm from './Components/User/Signup.tsx'
import VerifyEmail from './Components/Common/VerifyEmail.tsx'
import UsersList from './Pages/admin/UsersList.tsx';
import UserPrivateRoute from './Components/User/UserPrivateRoute.tsx';
import UserVendorProfile from './Pages/user/UserVendorProfile.tsx';
import LiveStreaming from './Pages/user/LiveStream.tsx';
//vendor
import VendorApp from './Pages/vendor/VendorApp.tsx';
import VendorsList from './Pages/admin/VendorsList.tsx';
import VendorTypes from './Pages/admin/VendorTypes.tsx';
import VendorProfile from './Components/Admin/vendorList/VendorProfile.tsx';
import VendorListing from './Pages/home/VendorListing.tsx';
import Profile from './Pages/user/Profile.tsx';
import BookEventForm from './Pages/user/BookEventForm.tsx';
import PaymentSuccess from './Pages/user/PaymentSuccess.tsx';
import Messenger from './Pages/user/messenger/Messenger.tsx';


//IMPORTING ROUTES FROM CONSTANTS
import { USERROUTES } from './Constants/constants.ts';
import { ADMINROUTES } from './Constants/constants.ts';




const router = createBrowserRouter(
  createRoutesFromElements(
  <>
    <Route path="/" element={<App/>}>
              <Route index={true}  path="/" element={<HomePage/>} />
              <Route path={USERROUTES.USER_LOGIN} element={<UserLoginForm />} />
              <Route path={USERROUTES.USER_SIGNUP} element={<UserSignupForm />} />
              <Route path={USERROUTES.VERIFY} element={<VerifyEmail />} />
              <Route path={USERROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
              <Route path={USERROUTES.RESET_PASSWORD} element={<ResetPassword />} />
              <Route path={USERROUTES.ABOUT}       element={<AboutPage/>} />
              <Route path={USERROUTES.VIEW_VENDOR} element={<UserVendorProfile/>}/>
              <Route path={USERROUTES.VENDORS} element={<VendorListing/>}/>
              <Route path={USERROUTES.CHAT} element={<Messenger/>}/>
              <Route path="*" element={<NotFound role={"user"}/>}/>
           {/* User Private Routes */}
          <Route path="" element={<UserPrivateRoute/>}>
              <Route path="/profile/*" element={<Profile/>}/>
              <Route path={USERROUTES.BOOKEVENT} element={<BookEventForm/>}/>
              <Route path={USERROUTES.PAYMENT_SUCCESS} element={<PaymentSuccess/>}/> 
              <Route path={USERROUTES.LIVE} element={<LiveStreaming/>}/>
              <Route path={USERROUTES.ROOM} element={<Room/>}/>
          </Route>
    </Route>



    
    <Route path={ADMINROUTES.ADMIN_LOGIN}  element={<AdminApp/>}>
            <Route index={true} path={ADMINROUTES.ADMIN_LOGIN} element={<AdminLogin />} />
            <Route path="*" element={<NotFound role={"admin"}/>}/>
      {/* Admin Private Routes */}
       <Route path="" element={<AdminPrivateRoute/>}>
            <Route path={ADMINROUTES.ADMIN_DASHBOARD} element={<Dashboard />} />
            <Route path={ADMINROUTES.ADMIN_VENDORS} element={<VendorsList />} />
            <Route path={ADMINROUTES.ADMIN_VENDORTYPES} element={<VendorTypes />} />
            <Route path={ADMINROUTES.ADMIN_USERS} element={<UsersList />} />
            <Route path={ADMINROUTES.ADMIN_VENDOR} element={<VendorProfile />} />
            <Route path={ADMINROUTES.ADMIN_WALLET} element={<Wallet />} />
            <Route path={ADMINROUTES.ADMIN_NOTIFICATIONS} element={<AdminNotifications />} />
       </Route>
    </Route>
  

 
   
    <Route path="" element={<VendorApp/>}>
      <Route path="/vendor/*" element={<VendorApp/>} />
    </Route>
    
    </>
  )
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
     <PersistGate persistor={persistor}>
  {/* <React.StrictMode> */}
   <RouterProvider router={router} />
  {/* </React.StrictMode> */}
  </PersistGate>
  </Provider>
)
