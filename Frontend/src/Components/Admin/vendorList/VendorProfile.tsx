import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Typography,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { axiosInstanceAdmin } from "../../../Api/axiosinstance";
import { useLocation } from 'react-router-dom';
import { toast } from "react-toastify";


interface Vendor {
  _id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  isActive: boolean;
  totalBooking: number;
  logoUrl: string;
  coverpicUrl: string;
  verificationRequest: boolean;
  isVerified:boolean;
  }

const VendorProfile = () => {

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const Id = queryParams.get('Id');
  const [vendor,setVendor]=useState<Vendor>()

    useEffect(()=>{
        axiosInstanceAdmin
      .get(`/getvendor?Id=${Id}`,{withCredentials:true})
      .then((response) => {
        
        setVendor(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
    },[vendor])

    const handleBlock = () => {
      axiosInstanceAdmin
        .patch(`/vendorblock-unblock?VendorId=${Id}`)
        .then((response) => {
         
          toast.success(response.data.message);
         
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
        });
    };


    const updateVerifyStatus = async(status:string) => {
      axiosInstanceAdmin
        .put(`/update-verify-status`,{vendorId:vendor?._id,status:status},{withCredentials:true})
        .then((response) => {
          console.log(response);
          handleOpen();
          toast.success(response.data.message);
        })
        .catch((error) => {
          console.error('Error fetching users:', error);
        });
    };

    

  return (
    <>
     {vendor?.verificationRequest ? (
        <div>
          <Card
           style={{ border: '8px solid #002F5E' }}
            className="mt-6 w-1/2 m-auto mr-30 mb-4 bg-gray-900 text-center"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <CardBody
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <Typography
                variant="h5"
                color="white"
                className="mb-2"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Request for Profile Verification
              </Typography>
            </CardBody>
            <CardFooter
              className="pt-0"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <Button
               onClick={()=>updateVerifyStatus("Rejected")}
                className="mr-5"
               style={{background:'red'}}
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Reject
              </Button>
              <Button
               onClick={handleOpen}
               style={{background:'green'}}
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Accept
              </Button>
            </CardFooter>
          </Card>
        </div>
      ) : (
        ''
      )}
   
    <div className="w-85 mr-10">
      <Card
        className="h-96 "
        placeholder={undefined}
      style={{
            backgroundColor: '#E7E3E0',
            backgroundImage: `url(${vendor?.coverpicUrl})`,
            backgroundSize: 'cover',
          }}
      >
        <CardBody placeholder={undefined} className="h-40" children={undefined}>
       
        </CardBody>
      </Card>


      <Card  style={{border:'2px solid black'}} placeholder={undefined}>
      <CardHeader
            style={{
              backgroundImage: `url(${vendor?.logoUrl})`,
              backgroundSize: 'cover',
              border: '5px solid black'
            }}
            color="gray"
            className="mb-4 grid h-28 place-items-center w-40"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined} children={undefined}          ></CardHeader>

        <CardBody className="flex flex-col gap-4" placeholder={undefined}>
          <Typography
            variant="h4"
            style={{ marginTop: "-90px", marginLeft: "170px" }}
            color="blue-gray"
            placeholder={undefined}
          >
            {vendor?.name}
           

            {vendor?.isVerified?
          <>
          <Typography className="font-bold text-black"  placeholder={undefined}>Verified</Typography>
          <svg
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          width="48"
          height="48"
          viewBox="0 0 48 48"
          className="absolute top-2 right-120 h-10 w-10"
        >
          <polygon
            fill="#42a5f5"
            points="29.62,3 33.053,8.308 39.367,8.624 39.686,14.937 44.997,18.367 42.116,23.995 45,29.62 39.692,33.053 39.376,39.367 33.063,39.686 29.633,44.997 24.005,42.116 18.38,45 14.947,39.692 8.633,39.376 8.314,33.063 3.003,29.633 5.884,24.005 3,18.38 8.308,14.947 8.624,8.633 14.937,8.314 18.367,3.003 23.995,5.884"
          ></polygon>
          <polygon
            fill="#fff"
            points="21.396,31.255 14.899,24.76 17.021,22.639 21.428,27.046 30.996,17.772 33.084,19.926"
          ></polygon>
         
        </svg></>:""}


          </Typography>
          <div
            className="mt-5"
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap:"wrap",
              justifyContent: "space-between",
            }}
          >
            <div>
              <Typography
                variant="h6"
                color="blue-gray"
                className="mb-2"
                placeholder={undefined}
              >
                VENDOR-EMAIL
              </Typography>
              <Typography
                color="black"
                className="mb-2"
                placeholder={undefined}
              >
                 {vendor?.email}
              </Typography>
            </div>
            <div>
              <Typography
                variant="h6"
                color="blue-gray"
                className="mb-2"
                placeholder={undefined}
              >
                CITY
              </Typography>
              <Typography
               
                color="black"
                className="mb-2"
                placeholder={undefined}
              >
                {vendor?.city}
              </Typography>
            </div>
            <div>
            <Typography
              variant="h6"
              color="blue-gray"
              className="mb-2"
            
              placeholder={undefined}
            >
              TOTAL WORKS
            </Typography>
            <Typography
                
                color="black"
                className="mb-2"
                placeholder={undefined}
              >
                 {vendor?.totalBooking}
              </Typography>
            </div>
            <div>
            <Typography
              variant="h6"
              color="blue-gray"
              className="mb-2"
              //   textGradient
              placeholder={undefined}
            >
              CONTACTS
            </Typography>
            <Typography
                
                color="black"
                className="mb-2"
                placeholder={undefined}
              >
                +91{vendor?.phone}
              </Typography>
            </div>
          </div>
          <div className="m-0">
          {vendor?.isActive ? (
            <Button variant="gradient" onClick={() => handleBlock()} size="sm" color="red" className="hidden lg:inline-block" placeholder={undefined}>
              <span>Block Vendor</span>
            </Button>
          ) : (
            <Button variant="gradient" onClick={() => handleBlock()} size="sm" className="hidden lg:inline-block" placeholder={undefined}>
              <span>Unblock vendor</span>
            </Button>
          )}
          </div>
        </CardBody>
      </Card>


    </div>

    <Dialog
   
      size='xs'
        open={open}
        handler={handleOpen}
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <DialogHeader
        
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
          className="text-black font-bold"
        >
         Confirmation
        </DialogHeader>
        <DialogBody
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
          className="text-black font-bold"
        >
          Are you sure want to accept the request?
        </DialogBody>
        <DialogFooter
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <Button
            variant="text"
            style={{background:'red' , color:'white'}}
            onClick={handleOpen}
            className="mr-1"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <span>Cancel</span>
          </Button>
          <Button
            variant="gradient"
            style={{background:'green'}}
            onClick={()=>updateVerifyStatus("Accepted")}
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <span>Confirm</span>
          </Button>
        </DialogFooter>
    </Dialog>

    
    </>
  );
};

export default VendorProfile;
