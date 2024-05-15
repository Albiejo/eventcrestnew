import { Routes, Route } from "react-router-dom";
import ChangePassword from "../../Components/User/Profile/ChangePassword";
import Favorites from "../../Components/User/Profile/Favorites";
import  ProfileCard  from "../../Components/User/Profile/ProfileCard";
import BookingDetails from "../../Components/User/Profile/BookingDetails";
import SingleBooking from "../../Components/User/Profile/SingleBooking";
import NotificationPage from "./NotificationPage";
import NotFound from "../../Components/Error/NotFound";

const Profile = () => {


  return (
    
     
     
        <Routes>
          <Route path="/" element={<ProfileCard />} />
          <Route path="/change-password" element={<ChangePassword/>} /> 
          <Route path="/Favorites" element={<Favorites/>} />
          <Route path="/Bookings" element={<BookingDetails/>} />
          <Route path="/booking" element={<SingleBooking />} />
          <Route path="/notifications" element={<NotificationPage/>} />
          <Route path="*" element={<NotFound role={'user'}/>}/>
        </Routes>
      
    
  );
};

export default Profile;