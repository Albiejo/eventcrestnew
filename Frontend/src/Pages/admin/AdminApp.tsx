// AdminApp.tsx

import { Outlet } from "react-router-dom";
import { useSelector } from 'react-redux';
import AdminState  from '../../Redux/rootstate/AdminState';
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Layout from "../../Layout/AdminLayout";
import LoadingSpinner from "../../Components/Common/LoadingSpinner";
import { useEffect, useState } from "react";

const AdminApp: React.FC = () => {
  const isAdminSignedIn = useSelector((state: AdminState) => state.admin.isAdminSignedIn);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <>
    
     
        <ToastContainer/>
        {isAdminSignedIn ? (
           <Layout>
           {loading ?<LoadingSpinner/>:
             <Outlet />}
           </Layout>
        ) : (
          <div className="mainContent flex-1 ml-50">
          <Outlet />
        </div>
        ) }
    
    </>
  );
};

export default AdminApp;
