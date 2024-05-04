import DefaultLayout from '../../../Layout/VendorLayout';
import Breadcrumb from '../../../Components/Vendor/Breadcrumbs/Breadcrumb';
import {
  Card,
  CardBody,
  Typography,
  CardHeader,
} from '@material-tailwind/react';
import UpdateStatus from './UpdateStatus';
import { useEffect, useState } from 'react';
import { axiosInstanceVendor } from '../../../Api/axiosinstance';
import { useLocation } from 'react-router-dom';



interface Booking {
  _id: string;
  date: string;
  name: string;
  eventName: string;
  city: string;
  pin: number;
  mobile: number;
  status: string;
  payment_status: string;
}
const initialBookingState: Booking = {
  _id: "",
  date: "",
  name: "",
  eventName: "",
  city: "",
  pin: 0,
  mobile: 0,
  status: "",
  payment_status: ""
};


const ViewBooking = () => {




  const [bookings, setBookings] = useState<Booking>(initialBookingState);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id');
  const vid =  queryParams.get('vid');




  useEffect(() => {
    axiosInstanceVendor
      .get(`/single-booking-details?bookingId=${id}`, { withCredentials: true })
      .then((response) => {
        setBookings(response.data.bookings[0]);
      })
      .catch((error) => {
        console.log('here', error);
      });
  }, [id]);



  const handleStatusChange = (newStatus: string) => {
    setBookings((prevBookings) => ({
      ...prevBookings,
      status: newStatus,
    }));
  };


  
  return (
    <DefaultLayout>
      <Breadcrumb pageName="View" folderName="Booking" />
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <Card
          className="mt-6 w-full px-5 bg-gray-400 border-4 border-gray-900"
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 mb-1 rounded-none border-b border-white/10 text-left p-5"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <div className="flex justify-between">
              <div>
                <Typography
                  variant="h5"
                  color="black"
                  className="mb-2"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  Event
                </Typography>
                <Typography
                  variant="small"
                  color="black"
                  className="mb-2"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  {bookings.eventName}
                </Typography>
              </div>
              <div>
                <Typography
                  variant="h5"
                  color="black"
                  className="mb-2"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  Venue
                </Typography>
                <Typography
                  variant="small"
                  color="black"
                  className="mb-2"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  {bookings.city}
                </Typography>
              </div>
              <div>
                <Typography
                  variant="h5"
                  color="black"
                  className="mb-2"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  Date
                </Typography>
                <Typography
                  variant="small"
                  color="black"
                  className="mb-2"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  {bookings.date}
                </Typography>
              </div>
              <div>
                <Typography
                  variant="h5"
                  color="black"
                  className="mb-2"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  Status
                </Typography>
                <Typography
                  variant="small"
                  color="red"
                  className="mb-2 font-bold"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  {bookings.status}
                </Typography>
              </div>
            </div>
          </CardHeader>
          <hr />
          <CardBody
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <div className="flex flex-col md:flex-row justify-between">
              <div>
                <Typography
                  variant="h6"
                  color="black"
                  className="mb-2"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  Customer
                </Typography>
                <Typography
                  variant="small"
                  color="black"
                  className="mb-2"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  {bookings.name}
                </Typography>
              </div>
              <div>
                <Typography
                  variant="h6"
                  color="black"
                  className="mb-2"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  Contact
                </Typography>
                <Typography
                  variant="small"
                  color="black"
                  className="mb-2"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  {bookings.mobile}
                </Typography>
              </div>
              <div>
                <Typography
                  variant="h6"
                  color="black"
                  className="mb-2"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  Address
                </Typography>
                <Typography
                  variant="small"
                  color="black"
                  className="mb-2"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  {bookings.city}
                </Typography>
                <Typography
                  variant="small"
                  color="black"
                  className="mb-2"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  {bookings.pin}
                </Typography>
              </div>
            </div>
          </CardBody>
        </Card>
        
        <UpdateStatus
          bookingId={bookings._id}
          onStatusChange={handleStatusChange}
          vendorid={vid ?? ""} 
        />
      </div>

      <Card
        className="mt-6 w-full mb-20 bg-gray-400 border-4 border-gray-900"
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="m-0 mb-1 rounded-none border-b border-white/10 text-left p-5"
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <Typography
            variant="h5"
            color="black"
            className="mb-2 font-bold"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            Payment Details
          </Typography>
          <Typography
            variant="h6"
            color="black"
            className="mb-2"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            Status :{' '}
            <span className="text-red-900">{bookings.payment_status}</span>
          </Typography>
        </CardHeader>

        <CardBody
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <div className="flex flex-col md:flex-row justify-between">
            <div></div>
            <div></div>
          </div>
        </CardBody>
      </Card>
    </DefaultLayout>
  );
};

export default ViewBooking;