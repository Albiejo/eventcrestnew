'use client';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Input,
    Button,
} from "@material-tailwind/react";
import { useState,ChangeEvent ,FormEvent,useEffect} from 'react';
import {useNavigate} from 'react-router-dom'
import {axiosInstanceAdmin} from '../../Api/axiosinstance';
import {  useSelector,useDispatch } from 'react-redux';
import { setAdminInfo } from "../../Redux/slices/AdminSlice";
import AdminRootState from '../../Redux/rootstate/AdminState';
import { validate } from "../../Validations/loginVal";
import { toast } from "react-toastify";

interface FormValues {
  email: string;
  password: string;
}

const initialValues: FormValues = {
  email: '',
  password: '',
};

const AdminLogin=()=> {

  const [formValues,setFormValues]=useState<FormValues>(initialValues);
  const [formErrors,setFormErrors]=useState({email:"",password:""})

  const handleChange=(e:ChangeEvent<HTMLInputElement>)=>{
    const {name,value}=e.target
    setFormValues({...formValues,[name]:value})
  }


  const admin = useSelector((state : AdminRootState) => state.admin.isAdminSignedIn);

  const navigate = useNavigate();
  const dispatch= useDispatch();

  useEffect(() => {
    if(admin) {
      navigate('/admin/dashboard');
    }
  }, []) 

  const handleSubmit=(e:FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    const errors=validate(formValues)
    setFormErrors({ ...formErrors, ...errors });
    if(Object.values(errors).length===0){
    axiosInstanceAdmin.post("/login", formValues)
    .then((response) => {
      localStorage.setItem("adminToken",response.data.token);
      localStorage.setItem("adminrefreshToken",response.data.refreshToken);
      dispatch(setAdminInfo(response.data.adminData))
      navigate("/admin/dashboard")
    })
    .catch((error) => {
      toast.error(error.response.data.message)
      
    });
  }
  }
  
const image = "https://www.shutterstock.com/image-photo/admin-word-built-letter-cubes-600nw-1634303020.jpg"
  return (
    <div
    className="min-h-screen flex justify-center items-center"
    style={{ backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'fixed', width: '100%', height: '100%', top: 0, left: 0 }}
  >
    <div className="w-96">
      <Card className="mt-20 border-4 border-gray-900 bg-gray-200" shadow={false}  placeholder={undefined}>
        <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="mt-10 rounded-none text-center"  placeholder={undefined}        >
          <Typography variant="h4" color="black"  placeholder={undefined}>
            Admin - Login
          </Typography>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardBody className="flex flex-col gap-4"  placeholder={undefined}>
            <Input label="Email" size="md" crossOrigin={undefined} color="black" className="bg-white bg-opacity-50" value={formValues.email} onChange={handleChange} name="email" />
            <p style={{ color: 'red', fontSize: '12px', marginTop: "-12px" }}>{formErrors.email}</p>
            <Input label="Password" size="md" crossOrigin={undefined} color="black" className="bg-white bg-opacity-50" value={formValues.password} onChange={handleChange} name="password" type="password" />
            <p style={{ color: 'red', fontSize: '12px', marginTop: "-12px" }}>{formErrors.password}</p>
            <Button fullWidth type='submit' className="bg-gray-700"  placeholder={undefined}>
              Login
            </Button>
          </CardBody>
        </form>
      </Card>
    </div>
  </div>
   
  );
}


export default AdminLogin;