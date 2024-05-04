import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import { Link ,useLocation} from "react-router-dom";
import { useSelector } from "react-redux";
import VendorRootState from "../../../Redux/rootstate/VendorState";
import UserRootState from "../../../Redux/rootstate/UserState";
import { HeartIcon } from "@heroicons/react/24/solid";
import { axiosInstance } from "../../../Api/axiosinstance";
import { toast } from "react-toastify";
import { useEffect } from "react";

export default function VendorDetails() {
  const location = useLocation();
  const path=location.pathname;
  
  const vendor = useSelector(
    (state: VendorRootState) => state.vendor.vendordata
  );
  const user = useSelector(
    (state: UserRootState) => state.user.userdata
  );

useEffect(()=>{
  console.log("user data ", user);
  console.log("vendor data is",vendor);
},[])

  const handleclick=()=>{
    axiosInstance.post(`/add-Favorite-Vendor?vendorId=${vendor?._id}&&userId=${user?._id}`,
    {withCredentials:true})
    .then(()=>{
      toast.success("vendor added to favorites.");
    })
    .catch((error) => {
      toast.error(error.response.data.message);
    });
  }

  return (
    <Card className=" ml-60 mr-60 lg:w-400 mb-20 mt-[-20] shadow-md hover:shadow-lg" placeholder={undefined} style={{ backgroundColor: "#EFF1FF", marginTop: "-30px" }}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
     
      <CardBody  placeholder={undefined}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          <div className="flex flex-row justify-between">
              <div>
        <Typography variant="h5" color="blue-gray" className="mb-2" placeholder={undefined}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
         {vendor?.name}
        </Typography>
        <Typography  placeholder={undefined}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          Location : {vendor?.city}
        </Typography>
        </div>
        <div>
        {path==="/viewVendor"? 
        <Button color="red" className="mr-5"  placeholder={undefined} onClick={handleclick}><HeartIcon className="h-5 w-5" /></Button>:""}
       
        <Button color="green" placeholder={undefined}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>4.7</Button>
        </div>
        </div>
      </CardBody>


      {path==="/viewVendor"? <CardFooter className="pt-0 flex justify-center " placeholder={undefined}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
        <Button  placeholder={undefined} color="pink" size="lg" className="mr-3"  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Chat with Us</Button>
        <Link to="#">
        <Button  placeholder={undefined} color="pink" size="lg" className="mr-3"  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Contact Us</Button>
        </Link>
        <Link to="#">
        <Button  placeholder={undefined} color="pink" size="lg" className="mr-3" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Check Availability</Button>
        </Link>
     
      </CardFooter>: <CardFooter className="pt-0 flex justify-center " placeholder={undefined}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
        <Button  placeholder={undefined} color="pink" size="lg" className="mr-3"  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Booking Details</Button>
        <Link to="/vendor/create-post">
        <Button  placeholder={undefined} color="pink" size="lg" className="mr-3"  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Create Post</Button>
        </Link>
        <Link to="/vendor/edit-profile">
        <Button  placeholder={undefined} color="pink" size="lg" className="mr-3" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Edit Profile</Button>
        </Link>
        <Link to="/vendor/change-password">
        <Button  placeholder={undefined} color="pink" size="lg"  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Change Password</Button>
        </Link>
      </CardFooter>}
    
    </Card>
  );
}