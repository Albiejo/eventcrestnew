import React from "react";
import {
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Drawer,
  Card,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  PowerIcon,
} from "@heroicons/react/24/solid";
import {
  Bars3Icon,
  BookmarkIcon,
  HeartIcon,
  LockClosedIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { axiosInstance } from "../../../Api/axiosinstance";
import { logout } from "../../../Redux/slices/UserSlice";
import { USERROUTES } from "../../../Constants/constants";

export default function Sidebar() {
  
  const navigate =useNavigate();
  const dispatch= useDispatch();



  const handleLogout=(e: React.MouseEvent<HTMLDivElement , MouseEvent>)=>{
    e.preventDefault();
    axiosInstance.get(USERROUTES.LOGOUT)
      .then(() => {
        dispatch(logout());
        navigate(USERROUTES.USER_LOGIN);
      })
      .catch((error) => {
        console.log('here', error);
      });
  }

  
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
 
 
 
  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);
 
  return (
    <>
      <IconButton variant="text" size="lg" onClick={openDrawer}  className="md:mt-18 sm:mt-10 xsm:ml-20 w-full bottom-0 right-0 fixed top-0 left-0 z-10"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
        {isDrawerOpen ? (
          <XMarkIcon className="h-8 w-8 stroke-2" />
        ) : (
          <Bars3Icon className="h-8 w-8 stroke-2" />
        )}
      </IconButton>


      <Drawer open={isDrawerOpen} onClose={closeDrawer} className="fixed"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
        <Card
         style={{background:"#002F5E" , border:'10px solid white' }}
          shadow={false}
          className="h-[calc(100vh-2rem)] w-full h-full p-4 rounded-none"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}        >
          <div className="mb-2 flex items-center gap-4 p-4 bg-white">
            <Typography variant="h5" color="black"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              Event Crest
            </Typography>
          </div>
          
          <List  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            
         
            <hr className="my-2 border-blue-gray-50" />
            
            <Link to={USERROUTES.USER_PROFILE} >
            <ListItem  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} className="text-white">
              <ListItemPrefix  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <UserCircleIcon className="h-5 w-5" />
              </ListItemPrefix>
              Profile
            </ListItem>
            </Link>

            <Link to={USERROUTES.PROFILE_CHANGEPASSWORD}>
            <ListItem  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} className="text-white">
              <ListItemPrefix  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <LockClosedIcon className="h-5 w-5" />
              </ListItemPrefix>
              Change Password
            </ListItem>
            </Link>

            <Link to={USERROUTES.FAVORITES}>
            <ListItem  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} className="text-white">
              <ListItemPrefix  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <HeartIcon className="h-5 w-5" />
              </ListItemPrefix>
              Favourites
            </ListItem>
            </Link>

            <Link to={USERROUTES.BOOKINGS}>
            <ListItem  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} className="text-white">
              <ListItemPrefix  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <BookmarkIcon className="h-5 w-5" />
              </ListItemPrefix>
              Vendor Bookings
            </ListItem>
            </Link>

            <Link to={USERROUTES.USER_NOTIFICATIONS}>
            <ListItem  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} className="text-white">
              <ListItemPrefix  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              <i className="fa-solid fa-bell mr-2 cursor-pointer" style={{ color: '#ffffff' }}></i>
              </ListItemPrefix>
              Notifications
            </ListItem>
            </Link>

          
        
           
            <hr className="my-2 border-blue-gray-50" />
            <ListItem  placeholder={undefined} onClick={handleLogout} className="text-white">
                <ListItemPrefix  placeholder={undefined}>
                  <PowerIcon className="h-5 w-5" />
                </ListItemPrefix>
                Log Out
            </ListItem>


          </List>
      
        </Card>
      </Drawer>
      
    </>
  );
}