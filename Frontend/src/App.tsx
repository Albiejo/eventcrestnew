// App.tsx

import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import MyNavbar from './Components/User/Navbar';
import Layout from './Layout/UserLayout';


const App: React.FC = () => {
  
  const location = useLocation();
  const isProfileRoute = location.pathname.startsWith('/profile');

  return (
    
    <>
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
          <MyNavbar />
          <Outlet/>
        </div>
      )}
    </>
  );
};

export default App;
