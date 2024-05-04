
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Input,
    Button,
} from "@material-tailwind/react";

import { toast } from "react-toastify";
import { useFormik } from "formik";
import { validate } from "../../Validations/resetPassword";
import { axiosInstance, axiosInstanceVendor } from "../../Api/axiosinstance";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

interface FormValues {
  password: string;
  confirm_password: string;
}

const initialValues: FormValues = {
  password: "",
  confirm_password: "",
};



const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const formik = useFormik({
    initialValues,
    validate,
    onSubmit: (values) => {
     {
      location.pathname === "/vendor/reset-password"
      ? axiosInstanceVendor
      .post("/resetpassword", values, { withCredentials: true })
        .then(() => {
          toast.success("password updated successfully..")
          navigate("/");
     })
     .catch((error) => {
      toast.error(error.response.data.message);
      console.log(error.response.data.message);
    })
    :
      axiosInstance
        .post("/resetpassword", values, { withCredentials: true })
        .then(() => {
          toast.success("password updated successfully..")
          navigate("/");
        })
        .catch((error) => {
          toast.error(error.response.data.message);
          console.log("error", error);
        });
    }}
  });

  return (
    <div className="w-full h-screen flex flex-col md:flex-row items-start">
    <div className="w-full md:w-1/2 h-full object-cover" style={{backgroundImage:`url('https://img.freepik.com/premium-vector/password-reset-icon-apps-vector_116137-6219.jpg')`,backgroundSize:"cover",backgroundRepeat:"no-repeat",backdropFilter:"revert-layer"}}>
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
          Reset Password
        </Typography>
      </CardHeader>
      <form onSubmit={formik.handleSubmit}>
        <CardBody className="flex flex-col gap-4" placeholder={undefined}>
          <Input
            label="New Password"
            size="md"
            type="password"
            crossOrigin={undefined}
            color="pink"
            className="bg-white bg-opacity-50"
            onChange={formik.handleChange}
            value={formik.values.password}
            name="password"
          />
          {formik.errors.password ? (
            <p
              className="text-sm"
              style={{ color: "red", padding: 0, marginTop: -10 ,marginBottom:-10}}
            >
              {formik.errors.password}
            </p>
          ) : null}
          <Input
            label="Confirm Password"
            size="md"
            type="password"
            crossOrigin={undefined}
            color="pink"
            className="bg-white bg-opacity-50"
            onChange={formik.handleChange}
            value={formik.values.confirm_password}
            name="confirm_password"
          />
          {formik.errors.confirm_password ? (
            <p
              className="text-sm"
              style={{ color: "red", padding: 0, marginTop: -10 }}
            >
              {formik.errors.confirm_password}
            </p>
          ) : null}
          <Button variant="gradient" fullWidth placeholder={undefined} type="submit">
            Update Password
          </Button>
        </CardBody>
      </form>
    </Card>
    </div>
    </div>
  );
};

export default ResetPassword;