import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Button,
} from "@material-tailwind/react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstanceVendor } from "../../../Api/axiosinstance";
import { useSelector, useDispatch } from "react-redux";
import { setVendorInfo } from "../../../Redux/slices/VendorSlice";
import VendorRootState from "../../../Redux/rootstate/VendorState";
import { useFormik } from "formik";
import { validate } from "../../../Validations/loginVal";
import { toast } from "react-toastify";
import { VENDORROUTES } from "../../../Constants/constants";




interface FormValues {
  email: string;
  password: string;
}

const initialValues: FormValues = {
  email: "",
  password: "",
};

const VendorLoginForm = () => {

  const vendor = useSelector(
    (state: VendorRootState) => state.vendor.vendordata
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (vendor) {
      navigate("/vendor");
    }
  }, []);


  const formik = useFormik({
    initialValues,
    validate,
    onSubmit: (values) => {
      axiosInstanceVendor
        .post("/login", values)
        .then((response) => {
           localStorage.setItem("vendorToken",response.data.token);
           localStorage.setItem("vendorrefreshToken",response.data.refreshToken);
          dispatch(setVendorInfo(response.data.vendorData));
          navigate("/Vendor/dashboard");
        })
        .catch((error) => {
          toast.error(error.response.data.message)
          console.log("here", error);
        });
    },
  });

  return (
    <div className="w-full h-screen flex flex-col md:flex-row items-start">
      <div
        className="w-full md:w-1/2 h-full object-cover"
        style={{
          backgroundImage: `url('/public/imgs/dj3.jpg')`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backdropFilter: "revert-layer",
        }}
      >
      </div>
      <div className="w-full md:w-1/2 mt-10 md:mt-0">
        <Card
          className="w-full md:w-96 m-auto bg-dark"
          shadow={false}
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="mt-20 rounded-none text-center"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <Typography
              variant="h4"
              color="black"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              Vendor - Sign In
            </Typography>
          </CardHeader>
          <form onSubmit={formik.handleSubmit}>
            <CardBody
              className="flex flex-col gap-4 border border-gray-800 rounded-lg"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <Input
                label="Email"
                size="md"
                crossOrigin={undefined}
                color="black"
                className="bg-white bg-opacity-50"
                onChange={formik.handleChange}
                value={formik.values.email}
                name="email"
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
              {formik.errors.email ? (
                <p
                  className="text-sm"
                  style={{ color: "red", marginBottom: -10, marginTop: -10 }}
                >
                  {formik.errors.email}
                </p>
              ) : null}
              <Input
                label="Password"
                size="md"
                crossOrigin={undefined}
                color="black"
                className="bg-white bg-opacity-50"
                onChange={formik.handleChange}
                value={formik.values.password}
                name="password"
                type="password"
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
              {formik.errors.password ? (
                <p
                  className="text-sm"
                  style={{ color: "red", marginBottom: -10, marginTop: -10 }}
                >
                  {formik.errors.password}
                </p>
              ) : null}
              <div className="ml-2.5">
                <Link to="/vendor/forgot-password">
                  <Typography
                    variant="small"
                    color="black"
                    placeholder={undefined}
                    className="text-left"
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    Forgot password?
                  </Typography>
                </Link>
              </div>
              <Button
                 className="bg-black"
                variant="gradient"
                fullWidth
                placeholder={undefined}
                type="submit"
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Sign In
              </Button>
            </CardBody>
          </form>
          <CardFooter
            className="pt-0"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <Typography
              variant="small"
              color="black"
              className="mt-6 flex justify-center "
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              Don&apos;t have an account?
              <Link to={VENDORROUTES.VENDOR_SIGNUP}>
                <Typography
                  as="a"
                  href="#signup"
                  variant="small"
                  color="black"
                  className="ml-1 font-bold"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  Sign up
                </Typography>
              </Link>
            </Typography>
            <Typography
              variant="small"
              color="black"
              className="mt-3 flex justify-center"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              Are you a user?
              <Link to="/login">
                <Typography
                  as="a"
                  href="#signup"
                  variant="small"
                  color="black"
                  className="ml-1 font-bold"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  Login here
                </Typography>
              </Link>
            </Typography>
          </CardFooter>
        </Card>
      </div>
    </div>
    
   
  );
};

export default VendorLoginForm;
