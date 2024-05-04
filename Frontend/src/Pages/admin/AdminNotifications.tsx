
import { useDispatch, useSelector } from 'react-redux';
import AdminRootState from '../../Redux/rootstate/AdminState';
import { axiosInstanceAdmin } from '../../Api/axiosinstance';
import { useEffect, useState } from 'react';
import { Button, Card } from '@material-tailwind/react';
import { format } from 'date-fns';
import Pagination from '../../Components/Common/Pagination';
import { toast } from 'react-toastify';
import ClearButton from '../../Components/Common/ClearButton';
import { setAdminInfo } from '../../Redux/slices/AdminSlice';
import axios , { AxiosError } from 'axios';
import { Notification } from '../../Types/notificationType';



const AdminNotifications = () => {



  const admin = useSelector((state: AdminRootState) => state.admin.admindata)
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
  
    await axiosInstanceAdmin.get(`/getadmin?adminId=${admin?._id}`).then((res)=>{
      
      const admin = res.data.data;
      setnotifications(admin.notifications);
     
    })
  }


  useEffect(()=>{

    fetchdata();
     
  },[])
  

  const handleClick = async(id: string | undefined ,notifiID: string ) => {
   
    try {
      await axiosInstanceAdmin.patch( `/MarkAsRead?id=${id}&notifid=${notifiID}`,{ withCredentials: true } )
      .then((res) => {
       
        dispatch(setAdminInfo(res.data.data.adminData));
        setnotifications(res.data.data.adminData.notifications);
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



  return (
    <>
    <ClearButton/>
    <span className='font-bold'>Notifications</span>
    <Card className="h-full overflow-scroll border-4 border-gray-700 mr-20 mt-16" placeholder={undefined}>
       
       <div className="overflow-x-auto">
         <table  className="min-w-full divide-y divide-gray-200" >
          
         <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Notification
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Times
            </th>
            <th className="px-6 py-3"></th>
          </tr>
        </thead>


        <tbody className="bg-white divide-y divide-gray-200">

          {Notifications.length > 0 ? 
          <>
      
            {rowsForPage.map((notification:Notification , index: React.Key | null | undefined)  => (
                
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{notification.message}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{format(new Date(notification.timestamp), 'MMMM dd, yyyy h:mm a')}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {
                              notification.Read ?  <Button color="blue-gray" className="font-bold " placeholder={undefined} onClick={() => handleClick(admin?._id, notification._id)} style={{background:'green'}}>
                                          Unread
                                      </Button> :
                                      <Button color="blue-gray" className="font-bold" placeholder={undefined} onClick={() => handleClick(admin?._id, notification._id)}style={{background:'blue'}}>
                                          Read
                                    </Button>
                          }
                    </td>
                  </tr>

                ))}
      </> :
      <>
        <tr>
                 <td className="p-4">
                   No new notifications.
                 </td>
               </tr>

      </>}

      
          
        </tbody>
         </table>
        </div>
         
          <Pagination
           currentPage={currentPage}
           totalPages={totalPages}
           onPageChange={handlePageChange}
         />
       </Card>
    </>
  )
}

export default AdminNotifications