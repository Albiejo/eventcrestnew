import { useEffect, useState } from 'react'
import '../../../public/css/vendor-unauth.css'
import { axiosInstance } from '../../Api/axiosinstance';
import { axiosInstanceAdmin } from '../../Api/axiosinstance';
import CardDataStats from '../../Components/Vendor/CardDataStats';
import RevenueChart from '../../Components/Admin/Revenuechart';

function Dashboard() {

  
  
  const [vendorcount , SetvendorCount] = useState(0);
  const [usercount , SetuserCount] = useState(0);
  const [booking, setBooking] = useState(0);

  

  useEffect(()=>{
    fetchData();
  },[vendorcount ,usercount,booking ])



  const fetchData = async()=>{
    await axiosInstance.get('/getvendors').then((res)=>{
      SetvendorCount(res.data.vendors.length)
    })
    await axiosInstanceAdmin.get('/users').then((res)=>{
      SetuserCount(res.data.users.length);
    })
    await axiosInstanceAdmin.get('/getallBookings').then((res)=>{
      setBooking(res.data.bookings.length);
    })
  }


  return (
    <>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-7.5 mb-3">
        
        <CardDataStats title="Users" value={usercount}>
          <i
            className="fa-solid fa-users justify-center text-white"
            style={{ fontSize: "36px" }}
          ></i>
        </CardDataStats>

        <CardDataStats title="Vendors" value={vendorcount}>
        <i className="fa-solid fa-user-tie text-white" style={{ fontSize: "36px" }}></i>
      
        </CardDataStats>

        <CardDataStats title="Booking" value={booking}>
        <i className="fa-regular fa-calendar-check text-white"
            style={{ fontSize: "36px" }}
          ></i>
        </CardDataStats>
        
    </div>


    <RevenueChart/>
    </>

  )
}

export default Dashboard
