import React, { useEffect, useState } from "react";
import { Link ,useNavigate} from 'react-router-dom';
import {
  Navbar,
  Typography,
  Button,
  IconButton,
  MobileNav,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
} from "@material-tailwind/react";
import { useSelector,useDispatch } from 'react-redux';
import UserRootState from "../../Redux/rootstate/UserState";
import { axiosInstance } from "../../Api/axiosinstance";
import { logout } from "../../Redux/slices/UserSlice";
import {format} from 'timeago.js'
import { USERROUTES } from "../../Constants/constants";


interface Notification {
  _id: string; 
  message: string;
  timestamp: Date;
  Read: boolean;
}

const MyNavbar=()=> {
 

  const [openNav, setOpenNav] = React.useState(false);
  const isUserSignedIn = useSelector((state: UserRootState) => state.user.isUserSignedIn);
  const[unreadlength , setunreadlength] = useState(0);
  const user  = useSelector((state:UserRootState)=>state.user.userdata)

  const notifications: Notification[] = (user?.notifications || []) as Notification[];

  const unreadNotificationsCount = notifications?.filter(notification => notification.Read === false);

  const notification1=  user?.notifications[user?.notifications.length-1] as Notification | undefined;
  const notification2 = user?.notifications[user?.notifications.length-2] as Notification | undefined;
  const formattedTimestamp1 =  notification1 ? format(notification1.timestamp, 'yyyy-MM-dd HH:mm:ss') : '';
  const formattedTimestamp2 = notification2 ? format(notification2.timestamp, 'yyyy-MM-dd HH:mm:ss') : '';

 useEffect(()=>{
    setunreadlength(unreadNotificationsCount?.length)
  },[user]) 



  const navigate = useNavigate();
  const dispatch= useDispatch();

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);


  const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    axiosInstance.get(USERROUTES.LOGOUT)
      .then(() => {
        dispatch(logout());
        navigate(USERROUTES.USER_LOGIN);
      })
      .catch((error) => {
        console.log('here', error);
      });
  };

 

  const navList = (
    
    <ul className="mt-2 mb-9 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      <Typography
        as="li"
        variant="h6"
        className="flex items-center gap-x-2 p-1 font-medium font-bold" placeholder={undefined} color="white"  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}     >
       
        <Link to={USERROUTES.USER_HOME}>
          Home
        </Link>
      </Typography>
      <Typography
        as="li"
        variant="h6"
        className="flex items-center gap-x-2 p-1 font-medium font-bold" color="white" placeholder={undefined}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}    >
       
        <Link to={USERROUTES.VENDORS}>
          Vendors
          </Link>
      </Typography>
      <Typography as="li" variant="h6" color="white" className="flex items-center gap-x-2 p-1 font-medium font-bold" placeholder={undefined}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
        
      <Link to={USERROUTES.ABOUT}>
          About
          </Link>
      </Typography>
    
    </ul>
    
  );


  
  return (


    <Navbar className=" border-4 border-gray-600 lg:px-8 bg-dark lg:w-full fixed z-10 max-w-screen-3xl rounded-none" placeholder={undefined} style={{background:"#002F5E"}}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
      
      <div className="container mx-auto flex items-center justify-between text-blue-gray-900">
      
      
        <Typography
          className="mr-4 cursor-pointer py-1.5 font-medium font-bold" color="pink" placeholder={undefined}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}        >
          <Link to={USERROUTES.USER_HOME}>
          <img src="../../../public/imgs/log.jpeg" alt="" width={150}/>
          </Link>
        </Typography>
        
        <div className="hidden lg:block gap-x-4">{navList}</div>
       
        
        <div className="hidden  lg:flex items-center gap-x-1">

          {isUserSignedIn?
          <>
        <Menu>
        <MenuHandler>
        <div style={{ position: 'relative' }}>
               <i className="fa-solid fa-bell mr-6 cursor-pointer" style={{ color: '#ffffff' }}></i>
                {unreadlength > 0 && (
                  <div style={{ position: 'absolute', top: '1%',right:'50%' , backgroundColor: 'red', borderRadius: '50%', padding: '3px ', fontSize: '10px', color: '#ffffff' }}>
                    {unreadlength}
                  </div>
                )}
         </div>
        </MenuHandler>   

        <MenuList  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} className="w-1/4" >
            
            <MenuItem className="flex items-center gap-2"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>           
                  <Link to={USERROUTES.USER_NOTIFICATIONS}>
                  <Typography variant="small" className="font-medium font-bold"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                  {notification1 ? notification1.message : "No new notification"}
                  </Typography>
                  <Typography variant="small" className="font-medium font-bold"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                  {notification1 ? formattedTimestamp1 : ""}
                  </Typography>
                  </Link>
            </MenuItem>
           
            <MenuItem className="flex items-center gap-2"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            
                <Link to={USERROUTES.USER_NOTIFICATIONS}>
                  <Typography variant="small" className="font-medium font-bold"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                   {notification2 ? notification2.message : ""}
                  </Typography>
                  <Typography variant="small" className="font-medium font-bold"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                   {notification2 ? formattedTimestamp2 : ""}
                  </Typography>
                </Link>
                
            </MenuItem>
            
            <MenuItem  placeholder={undefined} className="text-center">
            <Link to={USERROUTES.USER_NOTIFICATIONS}>
              <Button className="px-2 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md" placeholder={undefined}>See all</Button>
            </Link>
            </MenuItem>

        </MenuList>

        </Menu>

        <Menu>
          <MenuHandler>
          <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 cursor-pointer"
              fill="white"
              stroke="white"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </MenuHandler>
         
          <MenuList  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            
            <MenuItem className="flex items-center gap-2"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            <i className="fa-solid fa-user"></i>
                <Link to={USERROUTES.USER_PROFILE}>
              <Typography variant="small" className="font-medium font-bold"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                My Profile
              </Typography>
              </Link>
            </MenuItem>

            <MenuItem className="flex items-center gap-2"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            <i className="fa-solid fa-message"></i>
                <Link to={USERROUTES.CHAT}>
              <Typography variant="small" className="font-medium font-bold"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                Messages
              </Typography>
              </Link>
            </MenuItem>


            <MenuItem className="flex items-center gap-2"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            <i className="fa-solid fa-video"></i>
                <Link to={USERROUTES.LIVE}>
              <Typography variant="small" className="font-medium font-bold"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                Go live
              </Typography>
              </Link>
            </MenuItem>


            <hr className="my-2 border-blue-gray-50" />
            <MenuItem className="flex items-center gap-2 "  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            <i className="fa-solid fa-right-from-bracket"></i>          
              <Button variant="text" size="sm" className="hidden lg:inline-block" placeholder={undefined}
              onClick={handleLogout}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              Logout
            </Button>
            
            </MenuItem>
          </MenuList>        
        </Menu>
        </>:<>
        <Link to={USERROUTES.USER_LOGIN}>
          <Button variant="text" color="white" size="sm" className="hidden lg:inline-block" placeholder={undefined}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            <span>Log In</span>
          </Button>
        </Link>
      <Link to={USERROUTES.USER_SIGNUP}>
        <Button variant="gradient" size="sm" className="hidden lg:inline-block" placeholder={undefined}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          <span>Sign up</span>
        </Button>
      </Link></>}
        </div>

        <IconButton
          variant="text"
          className="ml-auto h-6 w-6 text-inherit  active:bg-transparent lg:hidden"
          style={{backgroundColor:'white'}}
          ripple={false}
          onClick={() => setOpenNav(!openNav)} placeholder={undefined}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}        >
          {openNav ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              className="h-6 w-6"
              viewBox="0 0 24 24"
              stroke="currentColor"
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
              fill="none"
              stroke="currentColor"
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
          {navList}
          <div className="flex items-center gap-x-1">
            {isUserSignedIn ?<>
            <Button fullWidth variant="text" size="sm" className="" placeholder={undefined}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            <Link to={USERROUTES.USER_PROFILE}>
              Profile
            </Link>
          </Button> 
            <Button onClick={handleLogout}  fullWidth variant="gradient" size="sm" className="" placeholder={undefined}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            
                Logout
            
            </Button>
          </> : <><Button fullWidth variant="text" size="sm" className="" placeholder={undefined}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              <Link to={USERROUTES.USER_LOGIN}>
                Login
              </Link>
            </Button>
            <Button fullWidth variant="gradient" size="sm" className="" placeholder={undefined}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
             <Link to={USERROUTES.USER_SIGNUP}>
                Signup
              </Link>
            </Button></>
          }
            
          </div>
        </div>
      </MobileNav >
     
    </Navbar>

  );
}
 export default MyNavbar;