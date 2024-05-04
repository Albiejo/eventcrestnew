import {
  Card,
  
  CardBody,

  Typography,
 
 
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { axiosInstanceAdmin } from "../../Api/axiosinstance";
import Pagination from "../../Components/Common/Pagination";
import { payment } from "../../Types/commonTypes";
import { AdminData } from "../../Types/adminType";


function Wallet() {


  

  
  const formatDate = (createdAt:Date) => {
  const date = new Date(createdAt);

    const formattedDate = date.toLocaleDateString("en-US");
    return formattedDate;
  };


  const [payments,setPayments]=useState<payment[]>([])
  const [admin , setadmin] = useState<AdminData | null>(null)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);


  useEffect(()=>{
    axiosInstanceAdmin
      .get(`/getall-payment-details?page=${currentPage}`, { withCredentials: true })
      .then((response) => {
        setPayments(response.data.payment.result);
        setadmin(response.data.payment.AdminData);
        setTotalPages(response.data.totalPages);
      
      })
      .catch((error) => {
        console.log('here', error);
      });
  },[currentPage])

  
  return (
    <>
      <div className="flex justify-center items-center bg-gray-100 py-6 mt-20">
        <Card className="w-80 border-4 border-green-500"  placeholder={undefined}>
          <CardBody  placeholder={undefined}>
            <Typography variant="h5" className="mb-2"  placeholder={undefined}>
              Admin Wallet Amount
            </Typography>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mb-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 8.25H9m6 3H9m3 6-3-3h1.5a3 3 0 1 0 0-6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            <Typography variant="h4" color="green"  placeholder={undefined}>
             {admin?.Wallet}
            </Typography>
          </CardBody>
        </Card>
      </div>

      <div className="bg-white p-6 mt-4 mr-10 rounded-lg shadow">
        <table className="w-full min-w-max table-auto text-left">
          <thead className="bg-gray-900 border-4 border-gray-600">
            <tr>
              <th className="border-b border-gray-200 bg-gray-100 p-4">Payment ID</th>
              <th className="border-b border-gray-200 bg-gray-100 p-4">User</th>
              <th className="border-b border-gray-200 bg-gray-100 p-4">Vendor</th>
              <th className="border-b border-gray-200 bg-gray-100 p-4">Event</th>
              <th className="border-b border-gray-200 bg-gray-100 p-4">Date</th>
              <th className="border-b border-gray-200 bg-gray-100 p-4">Amount</th>
            </tr>
          </thead>
          <tbody className=" border-4 border-gray-600">
            {payments.map((payment, index) => (
              <>
              <tr key={index} className={(index % 2 === 0) ? 'bg-gray-50' : 'bg-white'}>
                <td className="p-4">{payment._id}</td>
                <td className="p-4">{payment.userId.name}</td>
                <td className="p-4">{payment.vendorId.name}</td>
                <td className="p-4">{payment.bookingId.eventName}</td>
                <td className="p-4">{formatDate(payment.createdAt)}</td>
                <td className="p-4">{payment.amount}</td>
              </tr>
           
              </>
            ))}

           
          </tbody>
         
        </table>
        <Pagination
               currentPage={currentPage}
               totalPages={totalPages}
               onPageChange={setCurrentPage}
            />
      </div>
    </>
  )
}

export default Wallet
