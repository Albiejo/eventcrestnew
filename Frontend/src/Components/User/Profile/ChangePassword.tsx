import {
    Card,
    CardBody,
    Input,
    Button,
    Typography,
  } from "@material-tailwind/react";
  import { axiosInstance } from "../../../Api/axiosinstance";
  import { toast } from "react-toastify";
  import { useNavigate } from "react-router-dom";
  import { validate } from "../../../Validations/changePwdValidation";
  import { useSelector } from "react-redux";
  import UserRootState from "../../../Redux/rootstate/UserState";
  import { useState } from "react";
  
  interface FormValues {
    current_password: string;
    new_password: string;
    confirm_password: string;
  }
  
  const initialValues: FormValues = {
    current_password:"",
    new_password: "",
    confirm_password: "",
   
  };
  
  
  
  const ChangeUserPassword = () => {
    const user = useSelector((state: UserRootState) => state.user.userdata);
    const [formValues, setFormValues] = useState(initialValues);
    const [formErrors, setFormErrors] = useState<FormValues>(initialValues);
    
    const navigate = useNavigate();
  
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

      console.log(Object.values(errors))

      if (Object.values(errors).every((error) => error === "")) {
        axiosInstance
          .patch(`/updatePassword?userid=${user?._id}`, formValues,{withCredentials:true})
          .then((response) => {
            console.log(response);
            toast.success("Password updated Successfully!")
            navigate("/profile/change-password");
          })
          .catch((error) => {
            toast.error(error.response.data.message)
            console.log("couldnt update password , error is:", error);
          });
      }
    };
  
    return (
      <Card
        className="w-96  m-auto mt-20  border-4 border-gray-600"
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
  
      >
        <form onSubmit={submitHandler}>
        <CardBody
          className="flex flex-col gap-4"
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
           <Typography variant="h4" className="text-center" placeholder={undefined}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            Change Password
          </Typography>
          <Input
          type="password"
           color="black"
          variant="standard"
            label="Current Password"
            size="md"
            name="current_password"
            onChange={handleChange}
            value={formValues.current_password}
            crossOrigin={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          />
           {formErrors.current_password ? <p className="text-sm" style={{color:"red",marginBottom:-10,marginTop:-10}}>{formErrors.current_password}</p> : null}
          <Input
          type="password"
          color="black"
          variant="standard"
           label="New Password"
           size="md"
           name="new_password"
           onChange={handleChange}
            value={formValues.new_password}
            crossOrigin={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          />
           {formErrors.new_password ? <p className="text-sm" style={{color:"red",marginBottom:-10,marginTop:-10}}>{formErrors.new_password}</p> : null}
          <Input
          type="password"
           color="black"
          variant="standard"
           label="Confirm Password"
           size="md"
           name="confirm_password"
           onChange={handleChange}
            value={formValues.confirm_password}
            crossOrigin={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          />
           {formErrors.confirm_password ? <p className="text-sm" style={{color:"red",marginBottom:-10,marginTop:-10}}>{formErrors.confirm_password}</p> : null}
           <Button
          
          variant="gradient"
          className="justify-center"
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
          type="submit"
        >
          Update
        </Button>
        
        </CardBody>
      
        </form>
       
      </Card>
    );
  };
  
  
  export default ChangeUserPassword