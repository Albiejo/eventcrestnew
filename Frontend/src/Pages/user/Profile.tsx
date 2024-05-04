import { Routes, Route } from "react-router-dom";
import ChangePassword from "../../Components/User/Profile/ChangePassword";
import Favorites from "../../Components/User/Profile/Favorites";
import UserSidebar from "../../Components/User/Profile/Sidebar";
import  ProfileCard  from "../../Components/User/Profile/ProfileCard";
import BookingDetails from "../../Components/User/Profile/BookingDetails";
import SingleBooking from "../../Components/User/Profile/SingleBooking";
import NotificationPage from "./NotificationPage";
import NotFound from "../../Components/Error/NotFound";
const Profile = () => {
  return (
    <div style={{ display: 'flex' }}>
      <UserSidebar />
      <div style={{ marginLeft: '200px', flex: 1 ,marginTop:"50px"}}>
        <Routes>
          <Route path="/" element={<ProfileCard />} />
          <Route path="/change-password" element={<ChangePassword/>} />
          <Route path="/Favorites" element={<Favorites/>} />
          <Route path="/Bookings" element={<BookingDetails/>} />
          <Route path="/booking" element={<SingleBooking />} />
          <Route path="/notifications" element={<NotificationPage/>} />
          <Route path="*" element={<NotFound role={'user'}/>}/>
        </Routes>
      </div>
    </div>
  );
};

export default Profile;