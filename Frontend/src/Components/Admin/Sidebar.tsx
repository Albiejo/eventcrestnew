
import React from "react";
import {
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Drawer,
  Card,
  Button,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  PowerIcon,
} from "@heroicons/react/24/solid";
import {
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { axiosInstanceAdmin } from "../../Api/axiosinstance"; 
import { logout } from "../../Redux/slices/AdminSlice";
import {  useDispatch } from "react-redux";
import { ADMINROUTES } from "../../Constants/constants";






export default function Sidebar() {
  
  const navigate =useNavigate();
  const dispatch= useDispatch();

  const handleLogout=(e: React.MouseEvent<HTMLButtonElement>)=>{
    e.preventDefault();
    axiosInstanceAdmin.get(ADMINROUTES.ADMIN_LOGOUT)
      .then(() => {
        dispatch(logout());
        navigate(ADMINROUTES.ADMIN_LOGOUT);
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


      <IconButton variant="text" size="lg" onClick={openDrawer} className="mt-14 fixed " placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
        
        {isDrawerOpen ? (
          <XMarkIcon className="h-8 w-8 stroke-2" />
        ) : (
          <Bars3Icon className="h-8 w-8 stroke-2" />
        )}

      </IconButton>



      <Drawer open={isDrawerOpen} onClose={closeDrawer} className="fixed"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
        <Card
          shadow={false}
          className="h-full w-full p-4 rounded-none border-8 border-white"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}   style={{background:'#002F5E'}}     >
          
          <div className="mb-2 flex items-center justify-between p-4"> 
      <Typography variant="h5" color="white" placeholder={undefined}>
        Admin panel
      </Typography>

      <div className="cursor-pointer" onClick={closeDrawer}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-chevron-left" style={{ width: '24px', height: '24px' }}>
          <circle cx="12" cy="12" r="10" fill="rgba(0, 0, 0, 0.5)" />
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </div>
    </div>
          
          <List  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            
         
            <hr className="my-2 border-blue-gray-50" />
            
            <Link to={ADMINROUTES.ADMIN_DASHBOARD}>
            <ListItem style={{ color: 'white' }} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              <ListItemPrefix  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <UserCircleIcon className="h-5 w-5" />
              </ListItemPrefix>
              Dashboard
            </ListItem>
            </Link>

            <Link to={ADMINROUTES.ADMIN_USERS}>
            <ListItem  placeholder={undefined} style={{ color: 'white' }}>
              <ListItemPrefix  placeholder={undefined}>
              <i className="fa-solid fa-users"></i>
              </ListItemPrefix>
              Users
            </ListItem>
            </Link>

            <Link to={ADMINROUTES.ADMIN_VENDORS}>
            <ListItem  placeholder={undefined} style={{ color: 'white' }}>
              <ListItemPrefix  placeholder={undefined}>
              <i className="fa-solid fa-user-tie"></i>
              </ListItemPrefix>
                Vendors
            </ListItem>
            </Link>

            <Link to={ADMINROUTES.ADMIN_NOTIFICATIONS}>
            <ListItem  placeholder={undefined} style={{ color: 'white' }}>
              <ListItemPrefix  placeholder={undefined}>
              <i className="fa-solid fa-bell"></i>
              </ListItemPrefix>
                Notifications
            </ListItem>
            </Link>


            <Link to={ADMINROUTES.ADMIN_WALLET}>
              <ListItem  placeholder={undefined} style={{ color: 'white' }}>
              <ListItemPrefix  placeholder={undefined}>
              <i className="fa-solid fa-wallet"></i>
              </ListItemPrefix>
                Wallet        
            </ListItem>
            </Link>

            <hr className="my-2 border-blue-gray-50" />


          
        
           
            <ListItem  placeholder={undefined} style={{ color: 'white' }}>
          <ListItemPrefix  placeholder={undefined}>
            <PowerIcon className="h-5 w-5" />
          </ListItemPrefix>
          <Button variant="outlined" color="white" size="sm" className="" placeholder={undefined} onClick={handleLogout} style={{border:"none"}}>
          <span className="text-white">Logout</span>
        </Button>
        </ListItem>

          </List>
      
        </Card>
      </Drawer>
    </>
  );
}