import { useEffect, useState } from "react";
import VendorListingCard from "../../Home/VendorListingCard";
import { axiosInstance } from "../../../Api/axiosinstance";
import UserRootState from "../../../Redux/rootstate/UserState";
import { useSelector } from "react-redux";



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

  
function Favorites() {

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
      });
    },[currentPage])


    const handlePageChange = (page: number) => {
      setCurrentPage(page);
    };

  return (

    <>
    <div className="m-20 flex flex-row flex-wrap gap-4 mb-10">
         {vendors.map((vendor, index) => (
            <VendorListingCard {...vendor} key={index}/>
        ))}    
    </div>
    {vendors.length > 0 && (
  <div className="flex justify-center mt-8">
    <div className="space-x-2">
      {currentPage > 1 && (
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-4 py-2 rounded-md bg-blue-900 text-gray-700"
        >
          Previous
        </button>
      )}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`px-4 py-2 rounded-md ${page === currentPage ? 'bg-blue-900 text-white' : 'bg-gray-300 text-gray-700'}`}
        >
          {page}
        </button>
      ))}
      {currentPage < totalPages && (
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-4 py-2 rounded-md bg-blue-900 text-gray-700"
        >
          Next
        </button>
      )}
    </div>
  </div>
)}

    </>
  )
}

export default Favorites

   