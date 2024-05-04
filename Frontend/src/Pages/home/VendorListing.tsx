 
import { Card, CardBody, Typography } from '@material-tailwind/react';
import VendorFilters from '../../Components/Home/VendorFilter';
import VendorSort from '../../Components/Home/VendorSort';
import Footer from '../../Components/Home/Footer';
import { Suspense, lazy, useEffect, useState } from 'react';
import { axiosInstance } from '../../Api/axiosinstance';
import LoadingSpinner from '../../Components/Common/LoadingSpinner';
const VendorCard = lazy(() => import('../../Components/Home/VendorListingCard'));
import { useLocation } from 'react-router-dom';
import debounce from 'lodash/debounce';
import { useMemo } from 'react';





interface Vendors {
  _id: string;
  name: string;
  email: string;
  phone: string;
  city:string;
  isActive: boolean;
  totalBooking:number;
  coverpicUrl:string;
  OverallRating:number;
}


const VendorsListing = () => {
  
  const [vendors,setVendors]=useState<Vendors[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [noResults, setNoResults] = useState(false);
  const [search, setSearch] = useState<string>("");
  const location = useLocation();
  const [vendorTypeData, setVendorTypeData] = useState([]);
  const [category, setCategory] = useState<string[]>([]);
  
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const searchParam = queryParams.get("search");
    memoizedFetchVendors(currentPage, searchParam);
    fetchVendorTypes();
  }, [currentPage , search , location.search , sortBy ,category]);


  const memoizedFetchVendors = useMemo(() => {
    return async (page: number, searchParam?: string | null) => {
      try {
        const response = await axiosInstance.get(`/getvendors?page=${page}&search=${searchParam || search}&sortBy=${sortBy}&category=${category.join(",")}`, { withCredentials: true });
        if (response.data.vendors.length === 0) {
          setNoResults(true);
        } else {
          setNoResults(false);
        }
        setVendors(response.data.vendors);
        const totalPagesFromResponse = response.data.totalPages;
        setTotalPages(totalPagesFromResponse);
      } catch (error) {
        console.error("Error fetching vendors:", error);
      }
    };
  }, [search, sortBy, category]); 



 const fetchVendorTypes = async () => {
  try {
    const response = await axiosInstance.get('/getVendorTypes', { withCredentials: true });
    setVendorTypeData(response.data);
  } catch (error) {
    console.error('Error fetching vendor types:', error);
  }

 }

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
};


  const handleSearch=()=>{
    debouncedFetchVendors(currentPage, search);
}
  

const handleSortChange = (value: string) => {
  setSortBy(value);
};



// implemented debouncing
const debouncedFetchVendors = debounce(memoizedFetchVendors, 300);



  return (

<>
<div className="relative min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/imgs/church.jpg')" }}>
  <div className="absolute inset-0 " />
  <div className="max-w-md mx-auto">
    <Card className="mt-6 bg-gray-300" placeholder={undefined}>
      <CardBody  placeholder={undefined}>
        <Typography variant="h5" color="black" className="mb-2"  placeholder={undefined}>
          Find Vendors
        </Typography>
        <Typography  placeholder={undefined}>
          Discover the perfect vendors for your perfect day. Start your search now!
        </Typography>
      </CardBody>
    </Card>
  </div>
</div>

<section className="mt-8 mb-20 px-4">    
        <div className="flex justify-between mb-6 ">
          <div>
            <h3 className="text-lg font-semibold">Found {vendors.length} Vendors</h3>
          </div>
          <div className="flex items-center space-x-4">

          <input
          type="text"
          name="search"
          placeholder="Search vendors..."    
          onChange={(e) =>setSearch(e.target.value)}  
          onKeyUp={handleSearch}    
          className="px-4 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
          />  
            <VendorSort onChange={handleSortChange}/>
          </div>
        </div>

      <div className="flex flex-wrap justify-center md:justify-between ">
      <div className="w-full md:w-1/6 mb-6 md:mb-0 flex-shrink-0 ">
          <h3 className="mt-4 mb-2 text-lg font-semibold">Filter By</h3>

          <VendorFilters  vendorTypeData={vendorTypeData}   setCategory={setCategory}/>
      </div>
      <div className="flex flex-wrap justify-center md:justify-start w-full md:w-3/4 flex-grow">
      {noResults ? (
        <p className="text-center w-full text-red-500 font-bold">Sorry, no search results found.</p>
      ) : (
        <Suspense fallback={<LoadingSpinner/>}>
          {vendors.map((vendor, index) => (
            <div key={index} className="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/4 p-4">
              <VendorCard {...vendor} />
            </div>
          ))}
        </Suspense>
      )}
      </div>
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


        
</section>




<div className="bg-white">
  <Footer />
</div>
</>
  );
};

export default VendorsListing;