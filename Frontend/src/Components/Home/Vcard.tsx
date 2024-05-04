import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Button,

  } from "@material-tailwind/react";

  
  interface VendorCardProps {
    name: string;
    email: string;
    phone: string;
    city: string;
    logoUrl:string;
    coverpicUrl:string
    OverallRating:number;
    
  }
   
  const VCard: React.FC<VendorCardProps> = ({
    name,city , coverpicUrl})=> {
    return (
      <Card className="w-60 mr-10 transition duration-300 ease-in-out transform hover:shadow-4xl hover:border-red-500 border-2 border-blue-600 " placeholder={undefined}>
      <CardHeader floated={false} className="h-50" placeholder={undefined}>
         <img src={coverpicUrl} />
      </CardHeader>
      <CardBody className="text-center" placeholder={undefined}>
        <Typography variant="h4" color="blue-gray" className="mb-2" placeholder={undefined}>
          {name}
        </Typography>
        <Typography color="blue-gray" className="font-medium" textGradient placeholder={undefined}>
          {city}
        </Typography>
        <Typography
                      color="blue-gray"
                      className="flex items-center gap-1.5 font-normal"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}            >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="green"
              className="-mt-0.5 h-5 w-5 text-yellow-700"
            >
              <path
                fillRule="evenodd"
                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                clipRule="evenodd"
              />
            </svg>
            5.0
          </Typography>
        <Button placeholder={undefined} className="bg-blue-600 hover:border-red-500 text-black hover:bg-red-500 hover:text-white">Click to View</Button>
      </CardBody>
    </Card>
    );
  }


  export default VCard;