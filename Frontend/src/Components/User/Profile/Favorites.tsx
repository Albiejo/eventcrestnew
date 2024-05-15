import { useEffect, useState } from "react";
import VendorListingCard from "../../Home/VendorListingCard";
import { axiosInstance } from "../../../Api/axiosinstance";
import UserRootState from "../../../Redux/rootstate/UserState";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Typography } from "@material-tailwind/react";
import Pagination from "../../Common/Pagination";


interface Vendors {
    _id: string;
    name: string;
    email: string;
    phone: string;
    city:string;
    isActive: boolean;
    totalBooking:number;
    coverpicUrl:string;
    OverallRating:number
  }

  
function  Favorites() {

    const [vendors,setVendors]=useState<Vendors[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);

    const user = useSelector(
      (state: UserRootState) => state.user.userdata)


    useEffect(()=>{
        axiosInstance
      .get(`/get-favorite-vendor?userid=${user?._id}&&page=${currentPage}`,{withCredentials:true})
      .then((response) => {
        setVendors(response.data.data);
        const totalPagesFromResponse =response.data.totalPages
        setTotalPages(totalPagesFromResponse);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        toast.error("some issue occured , please try again later.." , {style:{background:'red'}})
      });
    },[currentPage])


    const handlePageChange = (page: number) => {
      setCurrentPage(page);
    };



  return (

    <>


<div className="m-20 mb-10">
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
    {vendors.length !== 0 ?  (
      vendors.map((vendor, index) => (
        <VendorListingCard {...vendor} key={index}/>
      ))
    ) : (
      <div className="flex items-center col-span-2 sm:col-span-2 lg:col-span-3">
        <Typography
          variant="h5"
          color="red"
          className="text-center mt-4"
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          No Favourite Profiles added!
        </Typography>
      </div>
    ) }
  </div>

  {vendors.length > 0 && (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
    />
  )}
</div>

    </>
  )
}

export default Favorites

   