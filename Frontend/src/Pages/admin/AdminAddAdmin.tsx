import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  List,
  ListItem,
  Typography,
} from "@material-tailwind/react";
import { useState ,ChangeEvent, FormEvent, useEffect } from "react";
import swal from 'sweetalert';
import { axiosInstanceAdmin } from "../../Api/axiosinstance";
import { toast } from "react-toastify";
import { AdminData } from "../../Types/adminType";


const AdminAddAdmin = () => {

  const confirmDelete = (_id:string) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this admin!",
      icon: "warning",
      buttons: {
        cancel: true,
        confirm: {
          text: "Delete",
          value: true,
          visible: true,
          className: "btn-danger",
          closeModal: true,
        },
      },
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        handleDelete(_id);
        swal("Poof! Admin has been deleted!", {
          icon: "success",
        });
      } else {
        swal("Admin is safe!");
      }
    });
  };

  const handleDelete = async (_id: string) => {
    await axiosInstanceAdmin.delete(`/deleteAdmin/${_id}`)
        .then(() => {
            setAdminList(adminList.filter(admin => admin._id !== _id));
        })
        .catch((error) => {
            console.log(error);
        });
};




    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [adminList , setAdminList] = useState<AdminData[]>([]);

     const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
      };
    
      const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
      };
    
      const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);
      };


      const handleSubmit = async(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        
        if (!email || !password || !confirmPassword) {
          setError('All fields are required');
          return;
        }

     
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
        setError('Please enter a valid email address');
        return;
        }

    
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          return;
        }
    

        const passwordRegex = /^.{8,}$/;
        if (!passwordRegex.test(password)) {
          setError('Password must be at least 8 characters long');
          return;
        }
       
        setError('');
    
       await axiosInstanceAdmin.post('/createAdmin' , {email , password} ).then((res)=>{
        console.log("new admin:",res.data)
        toast.success("successfully created new Admin..!")
       }).catch((error)=>{
        console.log(error);
        toast.error("some issue occured during admin signup. " , {style:{background:'red'}});
       })
      
      };
    

      useEffect(()=>{
        axiosInstanceAdmin.get('/getAllAdmins',{withCredentials:true}).then((res)=>{
          console.log(res.data)
          setAdminList(res.data)
        }).catch((error)=>{
          console.log(error)
        })
      },[])

    return (

      <div className="flex flex-col md:flex-row items-start mt-8">
          <div className="md:w-1/2 mb-8 md:mb-0 md:mr-4">
            <Card className="w-96" placeholder={undefined}>
              <List  placeholder={undefined}>
                {adminList.map((admin, index) => (
                  <ListItem key={index} className="flex justify-between items-center"  placeholder={undefined}>
                    <Typography variant="h6" color="black"  placeholder={undefined}>
                      {index + 1} : {admin.email}
                    </Typography>
                    <Button color="blue"  placeholder={undefined} onClick={() => confirmDelete(admin._id)}>
                      Delete
                    </Button>
                  </ListItem>
                ))}
              </List>
            </Card>
          </div>
  
        <div className="md:w-1/2">
            <div className="bg-white p-8 rounded-lg shadow-md border-2">
                <Card  placeholder={undefined}>
                <CardHeader color="transparent" placeholder={undefined}>
                    <Typography variant="h4"  placeholder={undefined}>ADD NEW ADMIN</Typography>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardBody className="flex flex-col gap-4" placeholder={undefined}>
                    <Input
                                            label="Email"
                                            size="md"
                                            color="red"
                                            name="email"
                                            value={email}
                                            onChange={handleEmailChange} crossOrigin={undefined}              />
                    <Input
                                            label="Password"
                                            size="md"
                                            color="pink"
                                            name="password"
                                            type="password"
                                            value={password}
                                            onChange={handlePasswordChange} crossOrigin={undefined}              />
                    <Input
                                            label="Confirm Password"
                                            size="md"
                                            color="pink"
                                            name="confirmPassword"
                                            type="password"
                                            value={confirmPassword}
                                            onChange={handleConfirmPasswordChange} crossOrigin={undefined}              />
                    {error && <p className="text-red-500">{error}</p>}
                    <Button variant="gradient" fullWidth type="submit"  placeholder={undefined}>
                        ADD NOW
                    </Button>
                    </CardBody>
                </form>
                </Card>
            </div>
        </div>
       
       </div>
  );
};

export default AdminAddAdmin;
