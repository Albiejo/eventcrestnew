import { Typography,  Button, Card, CardBody } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

const Hero = () => {

const navigate = useNavigate()
  return (
    <>
       <header  style={{ marginBottom: -40 }}>

       <div className="grid min-h-[70vh]  w-full  lg:h-[50rem] md:h-[40rem] bg-[url('/imgs/herosea.jpg')] bg-cover bg-no-repeat ">

          <div className="container mx-auto text-center md:text-right my-auto">

              <Card style={{ background: "#002F5E" }} className="inline-flex text-xs rounded-lg font-medium text-primary md:w-1/2 hidden sm:inline-flex" placeholder={undefined}>
              <CardBody placeholder={undefined}>   
                <div className="flex justify-center md:justify-end"> {/* Center text on small screens */}
                  <Typography
                    variant="h1"
                    color="white"
                    className="mx-5 w-full leading-snug text-2xl md:text-3xl lg:max-w-xl" // Adjust text size for different screens
                    placeholder={undefined}  
                    style={{ fontFamily: 'playfair display'}}        
                  >
                    Make Your Events Memorable
                  </Typography>
                </div>
              </CardBody>
            </Card>


            <div className="mt-8 grid w-full place-items-center md:place-items-start md:justify-end ">
              <div className="mb-2 flex w-full flex-col gap-4 md:flex-row justify-center md:justify-end"> {/* Center buttons on small screens */}
                <Button
                          color="gray"
                          className="w-full px-4 md:w-[15rem]"
                          style={{ fontFamily: 'playfair display'}} 
                          onClick={() => { navigate('/vendors'); } }  placeholder={undefined}        >
                  I'm looking for a vendor
                </Button>
              </div>
            </div>
    
          </div>

        </div>



      </header>
    </>
  );
};

export default Hero;
