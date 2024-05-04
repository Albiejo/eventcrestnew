// App.tsx

import React from 'react';
import { Outlet    } from 'react-router-dom';
import Layout from './Components/Layout';
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import MyNavbar from './Components/User/Navbar';



const App: React.FC = () => {
  const role = 'user'; 

  return (
    
    <>
    
      <Layout role={role}>
        <ToastContainer/>
        <div className='pb-20'>
          <MyNavbar />
        </div>
        <Outlet/>
      </Layout>
     
    </>
  );
};

export default App;
