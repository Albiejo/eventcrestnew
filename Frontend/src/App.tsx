// App.tsx

import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import MyNavbar from './Components/User/Navbar';
import Layout from './Layout/UserLayout';
import { SnackbarProvider } from 'notistack';


const App: React.FC = () => {
  
  const location = useLocation();
  const isProfileRoute = location.pathname.startsWith('/profile');
  const isAuthRoute = location.pathname.startsWith('/login') || location.pathname.startsWith('/signup');


  return (
    
    <>
    <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
    <ToastContainer/>
      {isProfileRoute ? (
        <Layout>
           <div className="flex-1 bg-white mt-10">
              <div style={{ maxHeight: "calc(100vh - 120px)" }} >
                <Outlet/>
              </div>
          </div>
        </Layout>
      ) : ( 
        <div >
           {!isAuthRoute && <MyNavbar />}
          <Outlet/>
        </div>
      )}
      </SnackbarProvider>
    </>
  );
};

export default App;
