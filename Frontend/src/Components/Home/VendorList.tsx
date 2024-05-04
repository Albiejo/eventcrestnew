import { axiosInstance } from "../../Api/axiosinstance";
import {useState ,useEffect} from "react"

import {
    Typography,
  } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import VendorCard from "./VendorListingCard";
import LiveEvents from "./LiveEvents";



interface Vendors {
    _id: string;
    name: string;
    email: string;
    phone: string;
    city:string;
    isActive: boolean;
    totalBooking:number;
    logoUrl:string;
    coverpicUrl:string;
    OverallRating:number;
  }


const VendorList=()=> {

    const [vendors,setVendors]=useState<Vendors[]>([])
    const [search, setSearch] = useState("");
  
  



   



    useEffect(()=>{
        axiosInstance
      .get('/getvendors',{withCredentials:true})
      .then((response) => {
        const sortedVendors = response.data.vendors.sort((a: { OverallRating: number }, b: { OverallRating: number }) => b.OverallRating - a.OverallRating);
        setVendors(sortedVendors);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
    },[])




    return (
        <>
        <div style={{ padding:"40px"}} className="bg-white sm-flex ">
        <form className="flex items-center max-w-lg mx-auto">
      <div className="relative w-full">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 21 21"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M11.15 5.6h.01m3.337 1.913h.01m-6.979 0h.01M5.541 11h.01M15 15h2.706a1.957 1.957 0 0 0 1.883-1.325A9 9 0 1 0 2.043 11.89 9.1 9.1 0 0 0 7.2 19.1a8.62 8.62 0 0 0 3.769.9A2.013 2.013 0 0 0 13 18v-.857A2.034 2.034 0 0 1 15 15Z"
            />
          </svg>
        </div>
        <input
          type="text"
          id="voice-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-gray-50 border-2 border-blue-800 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Search vendors, book dates etc..."
          required
        />
      </div>

      <Link to={search?.length>0?`/vendors?search=${search}`:`/vendors`}>
      <button
        className="inline-flex items-center py-2.5 px-3 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
        <svg
          className="w-4 h-4 me-2"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 20"
          >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
        </svg>
        Search
      </button>
      </Link>
    </form>




            <section className="mt-10 mb-32 mx-20 items-center">
                <h1 style={{ fontFamily: 'playfair display', fontSize: '30px' }} className="text-center mb-10">
                EXPLORE &nbsp;LIVE &nbsp;EVENTS
                </h1>
              <LiveEvents />
            </section>  
       
            <Typography
                variant="h5"
                color="black"
                className="mx-auto w-full leading-snug text-center lg:max-w-xl lg:text-3xl mb-5 font-bold"
                placeholder={undefined}
                style={{ fontFamily: 'playfair display'}} 
              >
                 TOP RATED VENDORS
            </Typography>

        <div style={{ display: 'flex',flexWrap:"wrap"}}> 
        {vendors.map((vendor, index) => (
          <>    
          <Link key={index} to={`/viewVendor?vid=${vendor._id}`}>   
          <div className="ml-4 mr-4 mb-4">
            <VendorCard {...vendor} key={index}/>
          </div> 
          </Link> 
          </>
        ))}
         </div>
        </div>
        </>
    );
  }


  export default VendorList;



