import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, IconButton, Typography } from '@material-tailwind/react';
import  { useState } from 'react'
import DatePicker from 'react-datepicker';
import { useSelector } from 'react-redux';
import VendorRootState from '../../../Redux/rootstate/VendorState';










const Calendar = () => {


    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen((cur) => !cur);

    const vendor = useSelector((state:VendorRootState)=>state.vendor.vendordata)
    const bookedDates = vendor?.bookedDates;

    
  return (
   <>


        <Button
            className="w-fit bg-green-700 text-black font-bold border-2 border-gray-900"
            onClick={handleOpen}
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            Check Current Availability
          </Button>



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
            excludeDates={bookedDates?.map(date => new Date(date))}
            dayClassName={(date) => {
              const currentDate = new Date();
              const formattedDate = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
              const isPastDate = date < currentDate;              
              if (isPastDate) {
                return 'text-gray-400'; 
              } else if (bookedDates?.includes(formattedDate)) {
                return 'bg-red-500'; 
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
  )
}

export default Calendar