import { Button } from '@material-tailwind/react';
import Swal from 'sweetalert2';
import { useLocation } from 'react-router-dom';
import { axiosInstance, axiosInstanceVendor, axiosInstanceAdmin } from '../../Api/axiosinstance';
import { useSelector } from 'react-redux';
import UserRootState from '../../Redux/rootstate/UserState';
import AdminRootState from '../../Redux/rootstate/AdminState';
import VendorRootState from '../../Redux/rootstate/VendorState';
import { useEffect, useState } from 'react';

const ClearButton = () => {

    const user  = useSelector((state:UserRootState)=>state.user.userdata)
    const admin  = useSelector((state:AdminRootState)=>state.admin.admindata)
    const vendor = useSelector((state:VendorRootState)=>state.vendor.vendordata)
    const location = useLocation();
    const [state , setstate ] = useState(false);


    const handleclick = () => {
     

        if (location.pathname === '/profile/notifications') {
            axiosInstance.patch(`/ClearAll?userId=${user?._id}`)
            .then((res) => {
                setstate(true);
                Swal.fire('Success', 'All notifications cleared!', 'success');
                console.log(res.data);
            })
            .catch((err) => {
                Swal.fire('Error', err.message, 'error');
                console.log(err.message);
            });
        } 
        
        else if (location.pathname === '/vendor/notifications') {
            axiosInstanceVendor.patch(`/ClearAll?userId=${vendor?._id}`)
            .then((res) => {
                setstate(true);
                Swal.fire('Success', 'All notifications cleared!', 'success');
                console.log(res.data);
            })
            .catch((err) => {
                Swal.fire('Error', err.message, 'error');
                console.log(err.message);
            });
        } 
        
        else if (location.pathname === '/admin/notifications') {
            axiosInstanceAdmin.patch(`/ClearAll?userId=${admin?._id}`)
            .then((res) => {
                setstate(true);
                Swal.fire('Success', 'All notifications cleared!', 'success');
                console.log(res.data);
            })
            .catch((err) => {
                Swal.fire('Error', err.message, 'error');
                console.log(err.message);
            });
        }
    };


 useEffect(()=>{

 },[state])
     
    return (
        <div className='flex justify-end mr-10'>
            <Button placeholder={undefined} onClick={handleclick}>Clear All</Button>
        </div>
    );
};

export default ClearButton;
