import DefaultLayout from '../../Layout/VendorLayout'
import Breadcrumb from '../../Components/Vendor/Breadcrumbs/Breadcrumb'
import { useDispatch, useSelector } from 'react-redux'
import VendorRootState from '../../Redux/rootstate/VendorState'
import { useEffect, useState } from 'react'
import { axiosInstanceAdmin, axiosInstanceVendor } from '../../Api/axiosinstance'
import {  Typography } from '@material-tailwind/react'
import Pagination from '../../Components/Common/Pagination';
import { format } from 'date-fns';
import { toast } from 'react-toastify'
import ClearButton from '../../Components/Common/ClearButton'
import { setVendorInfo } from '../../Redux/slices/VendorSlice'
import axios , { AxiosError } from 'axios';
import { Notification } from '../../Types/notificationType';










const VendorNotifications = () => {



 const vendor  = useSelector((state:VendorRootState)=>state.vendor.vendordata)
 const [Notifications, setnotifications] = useState([]);

 const sortedNotifications = Notifications.slice().sort((a: { timestamp: string | number | Date; }, b: { timestamp: string | number | Date; }) => {
  const dateA = new Date(a.timestamp).getTime();
  const dateB = new Date(b.timestamp).getTime();
  return dateB - dateA;
});


const [currentPage, setCurrentPage] = useState(1);
const notificationsPerPage = 5;
const totalPages = Math.ceil(Notifications.length / notificationsPerPage);
const startIndex = (currentPage - 1) * notificationsPerPage;
const rowsForPage = sortedNotifications.slice(startIndex, startIndex + notificationsPerPage);
const dispatch = useDispatch();

const handlePageChange = (pageNumber: React.SetStateAction<number>) => {
  setCurrentPage(pageNumber);
  };

  const fetchdata=async()=>{
    await axiosInstanceAdmin.get(`/getVendor?Id=${vendor?._id}`).then((res)=>{
      setnotifications(res.data.data.notifications)
    })
  }


  const handleClick = async(id:  string | undefined ,notifiID: string ) => {
   
    try {
      await axiosInstanceVendor.patch( `/MarkAsRead?Id=${id}&notifiId=${notifiID}`,{ withCredentials: true } )
      .then((res) => {
        dispatch(setVendorInfo(res.data.data.vendordata))
        setnotifications(res.data.data.vendordata.notifications);
      })
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        toast.warning(axiosError.message);
      } else {
        console.error('Non-Axios error occurred:', error);
      }
    }
  }


  
  useEffect(()=>{

    fetchdata();
     
  },[])
  
  return (
    <DefaultLayout>
    <Breadcrumb pageName="Notifications" folderName="" />
    <>

          {Notifications.length > 0 ? 
          (
            <div className="col-span-6 xl:col-span-4 mx-10 lg:mx-20">
             
             
    
                <div className='justify-end mb-2'>
                  <ClearButton/>
                </div>
    
              {rowsForPage?.map((data:Notification, key :React.Key | null | undefined) => (
                <div
                  className="block rounded-sm border border-warning border-stroke bg-white mb-4 shadow-default dark:border-strokedark dark:bg-boxdark hover:shadow-lg"
                  key={key}
                >
                  <div
                    className={`${!data.Read ? "bg-gray-400 p-4  bg-opacity-30" : "bg-gray-100 p-4  bg-opacity-30"}`}
                  >
                    <div className="flex items-center gap-5">
                      <div className="relative flex flex-1 items-center justify-between">
                        <div>
                          <h5 className="font-medium text-black dark:text-white">
                            {data?.message}
                          </h5>
                          <p>
                            <span className="text-xs">
                              {" "}
                              {format(new Date(data.timestamp), 'MMMM dd, yyyy h:mm a')}
                            </span>
                          </p>
                          {!data?.Read ? (
                            <button
                              className="absolute top-6 right-1 bg-blue-600 text-white text-xs px-2 py-1 rounded-full"
                              onClick={() => handleClick(vendor?._id, data?._id)}
                            >
                              Mark as read
                            </button>
                          ) : (
                            <button
                              className="absolute top-6 right-1 bg-gray-900 text-white text-xs px-2 py-1 rounded-full"
                              onClick={() => handleClick(vendor?._id, data?._id)}
                            >
                              Mark as unread
                            </button>
                          )}
                         
                         
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
               {Notifications.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            
            />
          )}
            </div>
          ) :
      <>
         <Typography
          variant="h6"
          color="red"
          className="text-center mt-4"
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          No notifications yet
        </Typography>

      </>}

      </>
    </DefaultLayout>
  )
}

export default VendorNotifications