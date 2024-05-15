import { Typography } from "@material-tailwind/react";
import SubsribeCard from "./SubsribeCard";
import { Link } from "react-router-dom";


const currentYear = new Date().getFullYear();
 
const Footer=()=> {


  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };



  return (
    <footer className="relative w-full pt-5" style={{background:"#002F5E" }} >

          <div className="mx-auto w-full max-w-7xl px-8 ">
           
                  <div className="grid grid-cols-1 md:grid-cols-3">
                      <div className="flex justify-start md:justify-end">
                      <Link to='/'>
                        <Typography variant="h5" color="white" placeholder={undefined}>
                          Event Crest
                        </Typography>
                      </Link>
                      </div>

                      <div className="flex justify-center">
                        <Link to='/about'>
                          <Typography variant="h5" color="white" placeholder={undefined}>
                            About us
                          </Typography>
                        </Link>
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

            <button onClick={handleScrollToTop} className="fixed bottom-4 right-4 bg-white text-blue-600 px-4 py-2 rounded-full shadow-md hover:bg-blue-100 focus:outline-none border-4 border-blue-700 font-bold">Top</button>

          </div>
    </footer>

  );
}


export default Footer;