import { Typography } from "@material-tailwind/react";
import  {Card , CardBody } from '@material-tailwind/react';


const Hero3 = () => {
 
  return (
    <>
    <header style={{ marginBottom: -40, marginTop: -2 }}>
      <div className="grid min-h-[30vh] w-full lg:h-[45rem] md:h-[30rem] place-items-stretch bg-[url('/imgs/herokissing.jpg')] bg-cover bg-no-repeat">
         <div className="w-full lg:w-8/12 md:w-5/12 px-4 md:px-20 lg:px-20 md:mt-8 lg:mt-0 p-20 ">
    <div className="flex justify-center">
      {/* Ensure the card is centered on smaller screens */}
      <div className="w-full md:w-auto lg:w-[600px]">
        <Card
          className="shadow-lg border shadow-gray-500/10 rounded-lg mx-auto lg:mx-0"
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
              variant="small"
              color="blue-gray"
              className="font-normal"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              Why Event Crest?
            </Typography>
            <Typography
                    variant="h5"
                    color="blue-gray"
                    className="mb-3 mt-2 font-bold"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}  onPointerLeaveCapture={undefined}              >
              Professional Event Planning
            </Typography>
            <Typography
              className="font-normal text-blue-gray-500"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              Experience the convenience of personalized service, tailored to meet your company's unique needs. Our experts handle everything from venue selection to logistics, so you can focus on your business.
            </Typography>
          </CardBody>
        </Card>
      </div>
    </div>
  </div>
      </div>
    </header>



</>
  );
};

export default Hero3;
