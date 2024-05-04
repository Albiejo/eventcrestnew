import { Typography } from "@material-tailwind/react";
import SubsribeCard from "./SubsribeCard";


const currentYear = new Date().getFullYear();
 
const Footer=()=> {
  return (
    <footer className="relative w-full pt-5" style={{background:"#002F5E" }} >

          <div className="mx-auto w-full max-w-7xl px-8 ">
           
                  <div className="grid grid-cols-1 md:grid-cols-3">
                      <div className="flex justify-start md:justify-end">
                        <Typography variant="h5" color="white" placeholder={undefined}>
                          Event Crest
                        </Typography>
                      </div>

                      <div className="flex justify-center">
                        <Typography variant="h5" color="white" placeholder={undefined}>
                          About us
                        </Typography>
                      </div>

                      <div className="flex justify-end md:justify-start">
                        <Typography variant="h5" color="white" placeholder={undefined}>
                          Contact us
                        </Typography>
                      </div>
                  </div>


                  <div className="md:pt-10 max-w-4xl mx-auto text-center">
                       <SubsribeCard />
                  </div>


            <div className="flex w-full flex-col items-center justify-center border-t border-blue-gray-50 py-4 md:flex-row md:justify-center">
              <Typography variant="small" className="mb-4 text-center font-normal text-white md:mb-0"  placeholder={undefined}>
                &copy; {currentYear} <a href="https://material-tailwind.com/">Event Crest</a>. All Rights Reserved.
              </Typography>
            </div>
          </div>
    </footer>

  );
}


export default Footer;