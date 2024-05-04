import "react-toastify/dist/ReactToastify.css";
import { Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Toaster } from "react-hot-toast";
import VendorSignupForm from "./Authentication/Signup";
import VendorLoginForm from "./Authentication/Login";
import VendorPrivateRoute from "../../Components/Vendor/VendorPrivateRoute";
import Dashboard from "./Dashboard";
import { useEffect } from "react";
import PageTitle from "../../Components/Vendor/PageTitle";
import Profile from "./profile/Profile";
import EditProfile from "./profile/EditProfile";
import ChangePassword from "./profile/ChangePassword";
import Posts from "./Posts/Posts";
import CreatePost from "./Posts/CreatePost";
import BookingHistory from "./Booking/BookingHistory";
import { Reviews } from "./Reviews";
import VendorNotifications from "./VendorNotifications";

import ViewBooking from "./Booking/ViewBooking";
import Messenger from "./Messenger/Messenger";
import NotFound from "../../Components/Error/NotFound";
import VerifyEmail from "../../Components/Common/VerifyEmail";


const VendorApp = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <ToastContainer />
      <Toaster />
      <Routes>
        <Route path="/vendor/signup" element={<VendorSignupForm />} />
        <Route path="/vendor/login" element={<VendorLoginForm />} />
        <Route path="/vendor/verify" element={<VerifyEmail/>} />

        <Route path="" element={<VendorPrivateRoute />}>
          <Route
            index
            path="/vendor"
            element={
              <>
                <PageTitle title="eCommerce Dashboard | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <Dashboard />
              </>
            }
          />

          <Route
            index
            path="/vendor/dashboard"
            element={
              <>
                <PageTitle title="eCommerce Dashboard | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <Dashboard />
              </>
            }
          />

          <Route
            index
            path="/vendor/view-profile"
            element={
              <>
                <PageTitle title="Profile | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <Profile />
              </>
            }
          />

          <Route
            index
            path="/vendor/edit-profile"
            element={
              <>
                <PageTitle title="Profile | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <EditProfile />
              </>
            }
          />

          <Route
            index
            path="/vendor/change-password"
            element={
              <>
                <PageTitle title="Profile | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <ChangePassword />
              </>
            }
          />

          <Route
            index
            path="/vendor/view-posts"
            element={
              <>
                <PageTitle title="Profile | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <Posts />
              </>
            }
          />

          <Route
            index
            path="/vendor/add-post"
            element={
              <>
                <PageTitle title="Profile | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <CreatePost />
              </>
            }
          />

          <Route
            index
            path="/vendor/booking-history"
            element={
              <>
                <PageTitle title="Profile | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <BookingHistory />
              </>
            }
          />

          <Route
            index
            path="/vendor/view-booking"
            element={
              <>
                <ViewBooking />
              </>
            }
          />
          {/* <Route
          index
          path="/vendor/add-date"
          element={
            <>
             
              <AddDates/>
            </>
          }
        /> */}

          <Route
            index
            path="/vendor/reviews"
            element={
              <>
                <PageTitle title="Profile | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <Reviews />
              </>
            }
          />

          <Route
            index
            path="/vendor/notifications"
            element={
              <>
                <PageTitle title="Profile | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <VendorNotifications />
              </>
            }
          />

          <Route
            path="/vendor/chat"
            element={
              <>
                <PageTitle title="Profile | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <Messenger />
              </>
            }
          />
           <Route path="*" element={<NotFound role={"vendor"}/>}/>
        </Route>
      </Routes>
    </>
  );
};

export default VendorApp;
