import {  Typography } from "@material-tailwind/react";
import { Link } from "react-router-dom";


const currentYear = new Date().getFullYear();
 
const Footer=()=> {






  return (
    <footer className="relative w-full bg-black" >

          <div className="mx-auto w-full max-w-7xl px-8  border-gray-300">
           
          <div className="flex flex-wrap justify-between items-center space-x-4">
  <div className="flex justify-center md:justify-end">
    <Link to='/'>
      <Typography variant="h5" color="white" className="text-sm sm:text-base md:text-lg lg:text-xl"  placeholder={undefined}>
        Event Crest
      </Typography>
    </Link>
  </div>

  <div className="flex justify-center">
    <Link to='/about'>
      <Typography variant="h5" color="white" className="text-sm sm:text-base md:text-lg lg:text-xl"  placeholder={undefined}>
        About us
      </Typography>
    </Link>
  </div>

  <div className="flex justify-center md:justify-start">
    <Typography
              variant="h5"
              color="white"
              className="cursor-pointer text-sm sm:text-base md:text-lg lg:text-xl"  placeholder={undefined}    >
      Subscribe to us
    </Typography>
  </div>
</div>


         
            <div className="mt-10   flex w-full flex-col items-center justify-center border-t border-gray-500 py-4 md:flex-row md:justify-center">
              <Typography variant="small" className="mb-4 text-center font-normal text-white md:mb-0"  placeholder={undefined}>
                &copy; {currentYear} <a href="https://material-tailwind.com/">Event Crest</a>. All Rights Reserved.
              </Typography>
            </div>

          </div>
    </footer>

  );
}


export default Footer;