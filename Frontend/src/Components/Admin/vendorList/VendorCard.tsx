import {
    Card,
    CardBody,
    Typography,
  } from "@material-tailwind/react";

   
  interface VendorCardProps {
    name: string;
    email: string;
    phone: number;
    city: string;
    verificationRequest:boolean;
    coverpicUrl:string;
    
  }


const VendorCard:React.FC<VendorCardProps> =({name , coverpicUrl ,verificationRequest  })=> {
  return (
    <Card
      shadow={false}
      className="relative w-full max-w-[16rem] border-4 border-gray-700" // Added border style
      placeholder={undefined}    >
    
      <CardBody className="relative py-14 px-6 md:px-12 text-center" placeholder={undefined}>
        <Typography variant="h5" className="mb-4 text-gray-900 truncate" title={name} placeholder={undefined}>
          {name}
        </Typography>
       
        <img src={coverpicUrl} alt={name} className="w-full h-auto" /> {/* Added image tag */}
        {verificationRequest && (
      <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
        <div className="w-6 h-6 rounded-full" style={{background:'red'}}></div>
      </div>
    )}
      </CardBody>
    </Card>
  );
};


export default VendorCard