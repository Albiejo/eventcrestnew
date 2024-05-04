

import React from 'react';
import "../../public/css/user-unauth.css"
import '../../public/css/userAuth.css'
import '../../public/css/vendor-unauth.css'
import '../../public/css/vendorAuth.css'
import '../../public/css/admin.css'
import { useSelector } from 'react-redux';
import UserRootState from '../Redux/rootstate/UserState';
import VendorRootState from '../Redux/rootstate/VendorState';



interface Props {
  role: string;
  children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ role, children }) => {

  const user = useSelector((state: UserRootState) => state.user.userdata);
  const vendor = useSelector((state: VendorRootState) => state.vendor.vendordata);


  const getCssFilePath = (role: string) => {
    
    if(role=='user' && !user){
      return "../../public/css/user-unauth.css"
    }else if(role=='user' && user){
      return ".././public/css/user-auth.css"
    }


    if(role=='admin'){
      return '../../public/css/admin.css';
    }

    if(role=='vendor' && !vendor){
      return "../../public/css/vendor-unauth.css";
    }else if(role=='vendor' && vendor){
      return "../../public/css/vendor-auclsth.css";
    }
  };

  const cssFilePath = getCssFilePath(role);

  return (
    <>
      <link rel="stylesheet" type="text/css" href={cssFilePath} />
      <div>{children}</div>
    </>
  );
};

export default Layout;
