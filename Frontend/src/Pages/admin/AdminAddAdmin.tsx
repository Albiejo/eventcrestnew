import {
    Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  List,
  ListItem,
  ListItemPrefix,
  Typography,
} from "@material-tailwind/react";
import { useState ,ChangeEvent, FormEvent } from "react";

import { axiosInstanceAdmin } from "../../Api/axiosinstance";
import { toast } from "react-toastify";



const AdminAddAdmin = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

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
    


    return (

        <div className="flex flex-col md:flex-row items-start mt-8">
       
        <div className="md:w-1/3 mb-8 md:mb-0 md:mr-">
        <Card className="w-96"  placeholder={undefined}>
      <List  placeholder={undefined}>
        <ListItem  placeholder={undefined}>
          <ListItemPrefix  placeholder={undefined}>
            <Avatar variant="circular" alt="candice" src="https://docs.material-tailwind.com/img/face-1.jpg" placeholder={undefined} />
          </ListItemPrefix>
          <div>
            <Typography variant="h6" color="blue-gray"  placeholder={undefined}>
              Tania Andrew
            </Typography>
            <Typography variant="small" color="gray" className="font-normal" placeholder={undefined}>
              Software Engineer @ Material Tailwind
            </Typography>
          </div>
        </ListItem>
        <ListItem  placeholder={undefined}>
          <ListItemPrefix  placeholder={undefined}>
            <Avatar variant="circular" alt="alexander" src="https://docs.material-tailwind.com/img/face-2.jpg" placeholder={undefined} />
          </ListItemPrefix>
          <div>
            <Typography variant="h6" color="blue-gray" placeholder={undefined}>
              Alexander
            </Typography>
            <Typography variant="small" color="gray" className="font-normal"  placeholder={undefined}>
              Backend Developer @ Material Tailwind
            </Typography>
          </div>
        </ListItem>
        <ListItem  placeholder={undefined}>
          <ListItemPrefix placeholder={undefined}>
            <Avatar variant="circular" alt="emma" src="https://docs.material-tailwind.com/img/face-3.jpg" placeholder={undefined} />
          </ListItemPrefix>
          <div>
            <Typography variant="h6" color="blue-gray"  placeholder={undefined}>
              Emma Willever
            </Typography>
            <Typography variant="small" color="gray" className="font-normal" placeholder={undefined}>
              UI/UX Designer @ Material Tailwind
            </Typography>
          </div>
        </ListItem>
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
