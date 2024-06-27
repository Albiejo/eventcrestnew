import React, {  useState } from 'react';
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  IconButton,
  Typography,
} from '@material-tailwind/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate} from 'react-router-dom';
import { axiosInstanceChat } from '../../Api/axiosinstance';
import axios, { AxiosError } from 'axios';
import { useSelector } from 'react-redux';
import UserRootState from '../../Redux/rootstate/UserState';
import { toast } from 'react-toastify';
import { ProfileButtonsProps } from '../../Types/ProfileButtonTypes';







const ProfileButtons: React.FC<ProfileButtonsProps> = ({ vendorId,bookedDates,userId }) => {


  const user  = useSelector((state:UserRootState)=>state.user.userdata)
  const parseDate = (dateString: string): Date => {
    const [day, month, year] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  const parsedBookedDates = bookedDates?.map(parseDate);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen((cur) => !cur);
  const navigate = useNavigate();


  const handleChat =async()=>{
    if(!user){
      toast.error("Please login first!");
      return;
    }
    const body ={
      senderId :userId,
      receiverId:vendorId
    }
    try {
      await axiosInstanceChat.post('/' , body).then(()=>{
        navigate('/chat')
      })
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        console.log(axiosError.message);
      } else {
        console.log('Non-Axios error occurred:', error);
      }
    }
  }
  

  const handleredirection = ()=>{
    if(!user){
      toast.error("Please login first!");
      return;
    }
    navigate(`/bookevent?vid=${vendorId}`)
  }
  
  return (
    <>
      <div className="flex md:flex-row flex-col justify-start py-4 pt-8 lg:pt-4  rounded-lg mt-2">
       
       
        <div className="mr-1 p-3 text-center">
          <Button
            className="w-fit bg-black text-white"
            onClick={handleOpen}
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            Check Availability
          </Button>
        </div>


        <div className="mr-1 p-3 text-center">
          <Button
            className="w-fit bg-black"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            onClick={handleredirection}
          >
            Book Now
          </Button>
         </div>


        <div className="mr-1 p-3 text-center">
          <Button
            className="w-fit bg-black"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            onClick={handleChat}
          >
            Chat with us
          </Button>
        </div>
      </div>


      
      <Dialog
        size="sm"
        open={open}
        handler={handleOpen}
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <DialogHeader
          className="justify-between"
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <div >
            <Typography
              variant="h5"
              color="blue-gray"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              Available Dates
            </Typography>
            
            </div>

          <IconButton
            color="black"
            size="lg"
            variant="text"
            onClick={handleOpen}
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </IconButton>
        </DialogHeader>


        <DialogBody
          className="flex justify-center mb-10"
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
         <DatePicker
            selected={null}
            onChange={() => {}}
            inline
            minDate={new Date()}
            excludeDates={parsedBookedDates}
            dayClassName={(date) => {
              const currentDate = new Date();
              const formattedDate = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
              const isPastDate = date < currentDate;              
              if (isPastDate) {
                return 'text-gray-400'; 
              } else if (bookedDates?.includes(formattedDate)) {
                return 'bg-red-600'; 
              } else {
                return 'bg-green-500';
              }
            }}
          />

        </DialogBody>
     <DialogFooter  placeholder={undefined} className='flex justify-between'>
      <Button className='rouded-lg bg-red-500 w-auto h-auto text-black font-bold' placeholder={undefined}>Booked</Button>
      <Button className='rouded-lg bg-green-600 w-auto h-auto text-black font-bold'  placeholder={undefined}>available</Button>
     </DialogFooter>
      </Dialog>
     
    </>
  );
};

export default ProfileButtons;