import React, { useState } from 'react';
import { Button, Input, Typography } from '@material-tailwind/react';
import Footer from '../../Components/Home/Footer';
import 'react-datepicker/dist/react-datepicker.css';
import { validate } from '../../Validations/BookingValidation';
import { axiosInstance } from '../../Api/axiosinstance';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import UserRootState from '../../Redux/rootstate/UserState';
import { useSelector } from 'react-redux';
import { FormValues } from '../../Types/commonTypes';


const initialValues: FormValues = {
  eventName: '',
  name: '',
  date: '',
  city: '',
  pin: '',
  mobile: '',
};

const BookEventForm: React.FC = () => {

  const user = useSelector((state: UserRootState) => state.user.userdata);
  const navigate=useNavigate()
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('vid');
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState<FormValues>({
    eventName: '',
    name: '',
    date: '',
    city: '',
    pin: '',
    mobile: '',
  });


  const handleChange = (e: { target: { name: string; value: string; }; }) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    const errors = validate({ ...formValues, [name]: value });
    setFormErrors((prevErrors) => ({ ...prevErrors, ...errors }));
  };



  const submitHandler = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const errors = validate(formValues);
    setFormErrors(errors)
    if (Object.values(errors).every((error) => error === "")) {
      axiosInstance
        .post(`/bookevent?vendorId=${id}&userId=${user?._id}`, formValues, { withCredentials: true })
        .then((response) =>{
        
          if (response.status === 201) {
            toast.success(response.data.message);
            navigate("/profile/Bookings");
          } else if (response.status === 400) {
            toast.error(response.data.message);
          } else {
            toast.error("An error occurred while processing your Booking , try again later");
          }
        })
        .catch((error) => {
          if (error.response.status === 400) {
            toast.error(error.response.data.message);
            console.log("error",error.response.data.message)
          }
          else{
            console.error("Error:", error);
            toast.error("An error occurred while processing your request");
          }
        });
    }
  };
  

  function getCurrentDate(): string {
    const today: Date = new Date();
    const year: number = today.getFullYear();
    let month: number | string = today.getMonth() + 1;
    let day: number | string = today.getDate();

    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;

    return `${year}-${month}-${day}`;
}



  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gray-100 ">
        <div className="bg-white shadow-md rounded px-6 pt-8 pb-8 w-full max-w-3xl mt-30 mb-30">
          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="flex flex-col justify-center items-center  border-2 border-blue-600">

              <Typography
                variant="h5"
                color="blue-gray"
                className="mb-3"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                BOOK AN EVENT 
              </Typography>
              <form
                onSubmit={submitHandler}
                className="border border-gray-300 shadow-lg p-10 w-full"
              >
                <div className="mb-4">
                  <Input
                    label="Date"
                    type="date"
                    onChange={handleChange}
                    value={formValues.date}
                    name="date"
                    min={getCurrentDate()}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                    crossOrigin={undefined}
                  />
                   
                 
                </div>
                <div className="mb-4">
                  <Input
                    label="Event name"
                    type="text"
                    size="md"
                    onChange={handleChange}
                    value={formValues.eventName}
                    name="eventName"
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                    crossOrigin={undefined}
                  />
                   {formErrors.eventName ? (
                    <p
                      className="text-sm"
                      style={{
                        color: 'red',
                      }}
                    >
                      {formErrors.eventName}
                    </p>
                  ) : null}
                </div>
                <div className="mb-4">
                  <Input
                    type="text"
                    size="md"
                    label="Name"
                    onChange={handleChange}
                    value={formValues.name}
                    name="name"
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                    crossOrigin={undefined}
                  />
                        {formErrors.name ? (
                    <p
                      className="text-sm"
                      style={{
                        color: 'red',
                      }}
                    >
                      {formErrors.name}
                    </p>
                  ) : null}
                </div>
                <div className="mb-4">
                  <Input
                    label="City"
                    type="text"
                    size="md"
                    onChange={handleChange}
                    value={formValues.city}
                    name="city"
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                    crossOrigin={undefined}
                  />
                        {formErrors.city ? (
                    <p
                      className="text-sm"
                      style={{
                        color: 'red',
                      }}
                    >
                      {formErrors.city}
                    </p>
                  ) : null}
                </div>
                <div className="mb-4">
                  <Input
                    label="Pin"
                    type="text"
                    size="md"
                    onChange={handleChange}
                    value={formValues.pin}
                    name="pin"
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                    crossOrigin={undefined}
                  />
                        {formErrors.pin ? (
                    <p
                      className="text-sm"
                      style={{
                        color: 'red',
                      }}
                    >
                      {formErrors.pin}
                    </p>
                  ) : null}
                </div>
                <div className="mb-4">
                  <Input
                    label="Mobile"
                    type="text"
                    size="md"
                    onChange={handleChange}
                    value={formValues.mobile}
                    name="mobile"
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                    crossOrigin={undefined}
                  />
                        {formErrors.mobile ? (
                    <p
                      className="text-sm"
                      style={{
                        color: 'red',
                      }}
                    >
                      {formErrors.mobile}
                    </p>
                  ) : null}
                </div>

                <div className="flex items-center justify-between">
                  <Button
                    color="blue-gray"
                    size="sm"
                    type="submit"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    Book Now
                  </Button>
                </div>
              </form>
            </div>
            {/* Image container */}
            <div className="hidden md:block p-5">
              <img
                className="h-full w-full object-cover object-center shadow-lg"
                src="https://e1.pxfuel.com/desktop-wallpaper/816/177/desktop-wallpaper-electronic-music-pc-full.jpg"
                alt="nature image"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white">
        <Footer />
      </div>
    </>
  );
};

export default BookEventForm;