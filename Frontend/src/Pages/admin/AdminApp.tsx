// AdminApp.tsx

import { Outlet } from "react-router-dom";
import AdminNavbar from '../../Components/Admin/Navbar';
import Sidebar from "../../Components/Admin/Sidebar";
import { useSelector } from 'react-redux';
import AdminState  from '../../Redux/rootstate/AdminState';
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"


const AdminApp: React.FC = () => {
  const isAdminSignedIn = useSelector((state: AdminState) => state.admin.isAdminSignedIn);

  return (
    <>
    
     
        <ToastContainer/>
        <AdminNavbar />
        {isAdminSignedIn && <Sidebar />}
        <div style={{ marginLeft: isAdminSignedIn ? '7%' : '35%', transition: 'margin 0.3s' }}>
          <Outlet />
        </div>
    
      
    </>
  );
};

export default AdminApp;
