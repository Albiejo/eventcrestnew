import VendorCard from "../../Components/Admin/vendorList/VendorCard"
import { Button } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { axiosInstanceAdmin } from "../../Api/axiosinstance";
import Pagination from "../../Components/Common/Pagination";
import { VendorData } from "../../Types/vendorType";



function VendorsList() {


  const [vendors,setVendors]=useState<VendorData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const vendorsPerPage = 8;


  useEffect(()=>{
    axiosInstanceAdmin
    .get("/getvendors", { withCredentials: true })
    .then((response) => {
      setVendors(response.data.vendors)
    })
    .catch((error) => {
      console.log("error occurred", error);
    })
  },[vendors])

  const indexOfLastVendor = currentPage * vendorsPerPage;
  const indexOfFirstVendor = indexOfLastVendor - vendorsPerPage;
  const currentVendors = vendors.slice(indexOfFirstVendor, indexOfLastVendor);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  
  return (
    <div className="m-20">
      <div className="mb-5 flex justify-between items-center">

        <h3 className="block font-sans text-3xl font-semibold leading-snug text-inherit">
          Vendors List
        </h3>

        <Button variant="gradient" className="rounded-full"  placeholder={undefined}>
          <Link to="/admin/vendor-types">
            View Vendor Types
          </Link>
        </Button>

      </div>

      <div className="flex flex-wrap">
        {currentVendors.map((vendor, index) => (
          <Link key={index} to={`/admin/vendor?Id=${vendor._id}`} className="m-3">
            <VendorCard {...vendor} />
          </Link>
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(vendors.length / vendorsPerPage)}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default VendorsList
