import {
    Card,
    CardHeader,
    Typography,
    CardBody,
    Button,
    Alert,
    Dialog,
    DialogBody,
    DialogFooter,
    DialogHeader,
  } from '@material-tailwind/react';
  import { useEffect, useState } from 'react';
  import { axiosInstance } from '../../../Api/axiosinstance';
  import UserRootState from '../../../Redux/rootstate/UserState';
  import { useSelector } from 'react-redux';
  import { useLocation } from 'react-router-dom';
  import Swal from 'sweetalert2';


  interface Vendor {
    _id: string;
    name: string;
    email: string;
    phone: string;
    city: string;
    isActive: boolean;
    totalBooking: number;
    coverpic: string;
    logo: string;
    logoUrl: string;
    coverpicUrl: string;
    about: string;
  }
  
  interface Booking {
    _id:string;
    date: string;
    name: string;
    eventName: string;
    city: string;
    pin: number;
    mobile: number;
    vendorId: Vendor;
    status: string;
    payment_status: string;
  }
  



  function Icon() {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
        />
      </svg>
    );
  }
  




const SingleBooking = () => {


    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(!open);
    const user = useSelector((state: UserRootState) => state.user.userdata);
    const [booking, setBooking] = useState<Booking>(Object);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id');
    const vendorId = booking?.vendorId?._id;

  
    const { date } = booking;

    const handleCancelBooking = () => {
      Swal.fire({
        title: 'Are you sure?',
        text: 'You are about to cancel this booking.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, cancel it!',
      }).then((result) => {
        if (result.isConfirmed) {
          axiosInstance.patch(`/markCancel?bookingId=${id}&&vendorId=${vendorId}` ,{date:date} ).then(() => {
          });
          Swal.fire('Cancelled!', 'Your booking has been cancelled.', 'success');
        }
      });
    };



    useEffect(() => {
    
      axiosInstance
        .get(`/single-booking?bookingId=${id}`, { withCredentials: true })
        .then((response) => {
          setBooking(response.data.bookings[0]);
          console.log(booking.vendorId._id)
        })
        .catch((error) => {
          console.log('here', error);
        });
     
    }, [id]);
  


    const handleClick = async () => {
    
      axiosInstance.post(`/create-checkout-session`,{ userId: user?._id, ...booking?.vendorId,bookingId:booking?._id},
      { withCredentials: true },)
        .then((response) => {
          if (response.data.url) {
            window.location.href = response.data.url;
          }
        })
        .catch((error) => {
          console.log('here', error);
        });
    };
  


    return (

      <>
      <div className='flex flex-col md:flex-row justify-between gap-4 ' style={{ marginLeft: '-7vw' }}>
        <span className='font-bold text-black '>Booking Details</span>
      </div>

{booking.payment_status === 'Pending' && booking.status === "Accepted" ? (
         <div className="flex flex-col md:flex-row justify-between gap-4 mr-28 "style={{ marginLeft: '-8vw' }}>
         <Alert icon={<Icon />} color="red">
           Complete your payment!
         </Alert>
       </div>
       
        ) : (
          ''
        )}

<div className="flex flex-col md:flex-row justify-between gap-4 mr-28" style={{ marginLeft: '-8vw' }}>
<Card
    className="mt-6 w-full px-5 border-2 border-gray-700  text-black"
    placeholder={undefined}
    onPointerEnterCapture={undefined}
    onPointerLeaveCapture={undefined}
>
    <CardHeader
        floated={false}
        shadow={false}
        className="m-0 mb-1 rounded-none border-2 border-gray-500 mt-4 text-left p-5  text-black"
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
    >
        <div className="flex justify-between">
            <div>
                <Typography
                    variant="h5"
                    className="mb-2"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                >
                    Event
                </Typography>
                <Typography
                    variant="small"
                    className="mb-2"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                >
                    {booking?.eventName}
                </Typography>
            </div>
            <div>
                <Typography
                    variant="h5"
                    className="mb-2"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                >
                    Venue
                </Typography>
                <Typography
                    variant="small"
                    className="mb-2"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                >
                    {booking?.city}
                </Typography>
            </div>
            <div>
                <Typography
                    variant="h5"
                    className="mb-2"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                >
                    Date
                </Typography>
                <Typography
                    variant="small"
                    className="mb-2"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                >
                    {booking?.date}
                </Typography>
            </div>
            <div>
                <Typography
                    variant="h5"
                    className="mb-2 "
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                >
                    Status
                </Typography>
                <Typography
                    variant="small"
                    className="mb-2 text-blue-700 font-bold"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                >
                    {booking?.status}
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
                    className="mb-2"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                >
                    Vendor
                </Typography>
                <Typography
                    variant="small"
                    className="mb-2"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                >
                    {booking && booking.vendorId && booking.vendorId.name}
                </Typography>
            </div>
            <div>
                <Typography
                    variant="h6"
                    className="mb-2"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                >
                    Contact
                </Typography>
                <Typography
                    variant="small"
                    className="mb-2"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                >
                    {booking && booking.vendorId && booking.vendorId.phone}
                </Typography>
                <Typography
                    variant="small"
                    className="mb-2"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                >
                    {booking && booking.vendorId && booking.vendorId.email}
                </Typography>
            </div>
            <div>
                <Typography
                    variant="h6"
                    className="mb-2"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                >
                    Address
                </Typography>
                <Typography
                    variant="small"
                    className="mb-2"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                >
                    {booking && booking.vendorId && booking.vendorId.city}
                </Typography>
            </div>
        </div>
    </CardBody>
</Card>
</div>

<Card
    className="mt-2 mr-28 border-2 border-gray-700 text-black"
    style={{ marginLeft: '-8vw' }}
    placeholder={undefined}
    onPointerEnterCapture={undefined}
    onPointerLeaveCapture={undefined}
>
    <CardHeader
        floated={false}
        shadow={false}
        color="transparent"
        className="m-0 mb-1 rounded-none border-2 border-white/10 text-left p-5"
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
    >
        <div className="flex justify-between">
            <div>
                <Typography
                    variant="h5"
                    className="mb-2 text-black"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                >
                    Payment Details
                </Typography>
                <Typography
                    variant="h6"
                    className="mb-2 text-black"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                >
                    Status :{' '}
                    <span className={booking?.payment_status === "Completed" ? "text-green-500" : "text-red-800"}>
                        {booking?.payment_status}
                    </span>
                </Typography>

                <Typography
                variant="h6"
                className="mb-2 text-black"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                  Please note: Token amount is non-refundable.
              </Typography>


            </div>
            <div>
                {booking.status === "Accepted" && booking.payment_status === "Pending" && (
                    <Button
                        onClick={handleOpen}
                        style={{background:'green', border: '2px solid white'}}
                        placeholder={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                    >
                        Make Payment
                    </Button>
                )}

                {booking.status === "Pending" && booking.payment_status === "Pending" && (
                    <Button
                        onClick={handleCancelBooking}
                        style={{background:'red', border: '2px solid black'}}
                        placeholder={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                    >
                     Cancel Booking
                    </Button>
                )}

              {booking.status === "Cancelled" && booking.payment_status === "Cancelled" && (
                    <Typography
                       className='text-red-600 font-bold text-lg'
                        placeholder={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                    >
                  Your booking has been cancelled !
                    </Typography>
                )}  


            </div>
        </div>
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

        
        <Dialog
          size="xs"
          open={open}
          handler={handleOpen}
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <DialogHeader
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            Event Crest
          </DialogHeader>
          <DialogBody
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <Typography
              variant="h5"
              color="gray"
              className="mb-2"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              Token Amount : 1000
            </Typography>
          </DialogBody>
          <DialogFooter
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <Button
              variant="text"
              color="red"
              onClick={handleOpen}
              className="mr-1"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <span>Cancel</span>
            </Button>
            <Button
              variant="gradient"
              color="green"
              onClick={handleClick}
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <span>Proceed</span>
            </Button>
          </DialogFooter>
        </Dialog>
        
      </>
    );
  };
  
  export default SingleBooking;