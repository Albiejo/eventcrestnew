
import React, { useEffect, useState } from "react";
import { Link ,useNavigate} from 'react-router-dom';
import {
  Navbar,
  Typography,
  Button,
  IconButton,
  MobileNav,
} from "@material-tailwind/react";
import { useSelector,useDispatch } from 'react-redux';
import AdminState  from '../../Redux/rootstate/AdminState';
import {axiosInstanceAdmin} from '../../Api/axiosinstance';
import { logout } from "../../Redux/slices/AdminSlice";
import { ADMINROUTES } from "../../Constants/constants";
import AdminRootState from "../../Redux/rootstate/AdminState";







const AdminNavbar=()=> {



  const [openNav, setOpenNav] = React.useState(false);
  const isAdminSignedIn = useSelector((state: AdminState) => state.admin.isAdminSignedIn);
  const[unreadlength , setunreadlength] = useState<number | undefined>(0);
  const navigate = useNavigate();
  const dispatch= useDispatch();


  const admin  = useSelector((state:AdminRootState)=>state.admin.admindata)
  
  
  useEffect(()=>{
    axiosInstanceAdmin.get(`/notificationCount?adminId=${admin?._id}`).then((res)=>{
      setunreadlength(res.data.data.notification)
    })
  },[admin]) 



  
  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);



  const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    axiosInstanceAdmin.get(ADMINROUTES.ADMIN_LOGOUT)
      .then(() => {
        dispatch(logout()); 
        navigate(ADMINROUTES.ADMIN_LOGIN);
      })
      .catch((error) => {
        console.log('here', error);
      });
  };
  

 
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 100 }} >
    <Navbar className="px-4 lg:px-8 lg:py-2 max-w-screen-3xl " placeholder={undefined} style={{ borderRadius: 0,border:0,backgroundColor:'#002F5E' }} >
      <div className="container mx-auto justify-between flex items-center  text-blue-gray-900">
        <Typography
                  className="mr-4 cursor-pointer py-1.5 font-medium " color="white" placeholder={undefined}        >
          Event Crest-Admin Panel
        </Typography>
       
       
        <div className="flex items-center gap-x-1">
        {isAdminSignedIn &&
        <>
          <Button variant="gradient" color="green" size="sm" className="hidden lg:inline-block" placeholder={undefined} onClick={handleLogout}>
            <span>Logout</span>
          </Button>
          <div style={{ position: 'relative' }}>
          <Link to='/admin/notifications'>
               <i className="fa-solid fa-bell ml-6 cursor-pointer" style={{ color: '#ffffff' }}></i>
          </Link>
                {unreadlength && unreadlength > 0 &&(
                  
                  <div style={{ position: 'absolute', top: '1%',right:'50%' , backgroundColor: 'red', borderRadius: '50%', padding: '3px ', fontSize: '10px', color: '#ffffff' }}>
                    {unreadlength}
                  </div>
                
                )}
         </div>  
        </>
        }
      </div>
        <IconButton
                  variant="text"
                  className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
                  ripple={false}
                  onClick={() => setOpenNav(!openNav)}  placeholder={undefined}        >
          {openNav ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="white"
              color="white"
              className="b h-6 w-6"
              viewBox="0 0 24 24"
              stroke="white"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="white"
              color="white"
              stroke="white"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </IconButton>
      </div>
      
      <MobileNav  open={openNav}>
        <div className="container mx-auto">
          <div className="flex items-center gap-x-1">
          {isAdminSignedIn &&
            <Button fullWidth variant="gradient" color="green" size="sm" className="w-1/6 " placeholder={undefined} onClick={handleLogout}>
              <span>Logout</span>
            </Button>
          }
          </div>
        </div>
      </MobileNav >
     
    </Navbar>
    </div>
  );
}
 export default AdminNavbar