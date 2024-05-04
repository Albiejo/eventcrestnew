import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Input,
    Button,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate  , useLocation} from "react-router-dom";
import { axiosInstance , axiosInstanceVendor } from "../../Api/axiosinstance";
import { setUserInfo } from "../../Redux/slices/UserSlice";
import { setVendorInfo } from "../../Redux/slices/VendorSlice";
import {toast} from "react-toastify";
import { useFormik } from "formik";
import { validate } from "../../Validations/otpValidation";




interface FormValues {
  otp: string;
}

const initialValues: FormValues = {
  otp:""
};

const VerifyEmail=()=> {
  

  const location = useLocation();
  const [timer, setTimer] = useState(60); 
  const [isTimerActive, setIsTimerActive] = useState(true);

  useEffect(() => {
    const countdown = setInterval(() => {
      if (isTimerActive) {
        setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
      }
    }, 1000);

    return () => clearInterval(countdown);
  }, [isTimerActive]);

  useEffect(() => {
    startTimer();
  }, []);

  const startTimer = () => {
    setTimer(60);
    setIsTimerActive(true);
  };




  const navigate = useNavigate();
  const dispatch = useDispatch();



const formik = useFormik({
    initialValues,
    validate,
    onSubmit: (values) => {
      {
        location.pathname === "/vendor/verify"
          ? axiosInstanceVendor
              .post("/verifyotp", values, { withCredentials: true })
              .then((response) => {
                dispatch(setVendorInfo(response.data.vendor));
                toast.success("Successfully registered..! Login now");
                navigate("/vendor/login");
              })
              .catch((error) => {
                toast.error(error.response.data.message);
                console.log(error.response.data.message);
              })
          : axiosInstance
              .post("/verify", values, { withCredentials: true })
              .then((response) => {
                dispatch(setUserInfo(response.data.user));
                toast.success("Successfully registered..! Login now");
                navigate("/login");
              })
              .catch((error) => {
                console.log("error received:", error)
                toast.error(error.response.data.message);
              });
      }
    },
});


const handleResendOtp=()=>{
 location.pathname === "/vendor/verify"
          ? axiosInstanceVendor
              .get("/resendOtp", { withCredentials: true })
              .then(() => {
                startTimer();
                toast.success("Successfully resend otp..!");
                navigate("/verify");
              })
              .catch((error) => {
                toast.error(error.message);
                console.log("here", error);
              })
          : axiosInstance
              .get("/resendOtp",  { withCredentials: true })
              .then(() => {
                startTimer();
                toast.success("Successfully resend otp..!");
                navigate("/verify");
              })
              .catch((error) => {
                console.log("error received:", error)
                toast.error(error.response.data.message);
              });
} 

  return (
    <div className="w-full h-screen flex flex-col md:flex-row items-start">
    <div className="w-full md:w-1/2 h-full object-cover" style={{backgroundImage:`url('https://ds9xi3hub5xxi.cloudfront.net/cdn/farfuture/otEn1mSO8Tk3mLVPFxYMCMwRn-qtie_ueonsviYMy0w/mtime:1608563955/sites/default/files/nodeicon/plugins_email-verification-plugin.png')`,backgroundSize:"cover",backgroundRepeat:"no-repeat",backdropFilter:"revert-layer"}}>
      {/* <h1 className="text-4xl md:text-4xl text-white font-bold mt-20 mx-4">Elevate Your Event Experience</h1>
      <p className="text-xl md:text-2xl text-white font-normal mt-5 mx-4">Find, Connect, and Collaborate with Top Event Planners</p> */}
    </div>
    <div className="w-full md:w-1/2 mt-10 md:mt-0">
    <Card
      className="w-96 mt-50 m-auto bg-dark border border-black"
      placeholder={undefined}
      shadow={false}
    >
      <CardHeader
        floated={false}
        shadow={false}
        color="transparent"
        className="mt-10 rounded-none text-center"
        placeholder={undefined}
      >
        <Typography variant="h4" color="white" placeholder={undefined}>
          Verify OTP
        </Typography>
      </CardHeader>
      <form onSubmit={formik.handleSubmit}>
        <CardBody className="flex flex-col gap-4" placeholder={undefined}>
          <Input
            label="Enter OTP"
            size="md"
            name="otp"
            value={formik.values.otp}
            onChange={formik.handleChange}
            crossOrigin={undefined}
            color="pink"
            className="bg-white bg-opacity-50"
          />
          {formik.errors.otp ? (
            <p
              className="text-sm"
              style={{ color: "red", marginBottom: -10, marginTop: -10 }}
            >
              {formik.errors.otp}
            </p>
          ) : null}

          {timer > 0 ? (
            <p className="text-sm" style={{ color: "red" ,marginTop:-10}}>
              Resend OTP in {timer}s
            </p>
          ) : (
            <Button
                variant="text"
                className="text-center inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                type="button"
                size="sm"
                onClick={handleResendOtp}  placeholder={undefined}          >
            Resend OTP
          </Button>
          
          )}

          <Button
            variant="gradient"
            fullWidth
            placeholder={undefined}
            type="submit"
          >
            Verify and Login
          </Button>
        </CardBody>
      </form>
    </Card>
    </div>
    </div>
  );
}


export default VerifyEmail;