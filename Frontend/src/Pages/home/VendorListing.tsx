import { Card, CardBody, Typography } from "@material-tailwind/react";
import VendorFilters from "../../Components/Home/VendorFilter";
import VendorSort from "../../Components/Home/VendorSort";
import Footer from "../../Components/Home/Footer";
import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { axiosInstance } from "../../Api/axiosinstance";
import LoadingSpinner from "../../Components/Common/LoadingSpinner";
const VendorCard = lazy(
  () => import("../../Components/Home/VendorListingCard")
);
import { useLocation } from "react-router-dom";
import debounce from "lodash/debounce";
import { useMemo } from "react";
import Pagination from "../../Components/Common/Pagination";





interface Vendors {
  _id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  isActive: boolean;
  totalBooking: number;
  coverpicUrl: string;
  OverallRating: number;
}

const VendorsListing = () => {
  const [vendors, setVendors] = useState<Vendors[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [noResults, setNoResults] = useState(false);
  const [search, setSearch] = useState<string>("");
  const location = useLocation();
  const [vendorTypeData, setVendorTypeData] = useState([]);
  const [category, setCategory] = useState<string[]>([]);
  const topRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const searchParam = queryParams.get("search");

    memoizedFetchVendors(currentPage, searchParam);
    fetchVendorTypes();
  }, [currentPage, search, location.search, sortBy, category]);

  const memoizedFetchVendors = useMemo(() => {
    return async (page: number, searchParam?: string | null) => {
      try {
        const response = await axiosInstance.get(
          `/getvendors?page=${page}&search=${
            searchParam || search
          }&sortBy=${sortBy}&category=${category.join(",")}`,
          { withCredentials: true }
        );
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
      const response = await axiosInstance.get("/getVendorTypes", {
        withCredentials: true,
      });
      setVendorTypeData(response.data);
    } catch (error) {
      console.error("Error fetching vendor types:", error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = () => {
    debouncedFetchVendors(currentPage, search);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  // implemented debouncing
  const debouncedFetchVendors = debounce(memoizedFetchVendors, 300);

  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <>

      <div className="relative flex h-screen content-center items-center justify-start lg:pt-16 pt-6 pb-20">
      <div className="absolute  inset-0 lg:h-3/4 w-full bg-[url('/imgs/sea.jpg')] bg-cover bg-top transform" />

        <div className="absolute top-0 h-100 w-full bg-black/30 bg-cover bg-center" />
        <Card
          className="mt-6 m-6 lg:justify-start"
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
                variant="h5"
                color="black"
                className="mb-2"
                placeholder={undefined}
              >
                Find Your Ideal Vendor.
              </Typography>
            <Typography
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
             Find the Ideal Vendors for Your Special Day. Begin Your Search Today!
            </Typography>
          </CardBody>
        </Card>
      </div>


      <section className="mx-20 -mt-15 mb-20">
        
        
        <div className="flex justify-end gap-6 md:flex-row flex-col mb-10 mr-5">
              <div>
                <h3>Found {vendors.length} Vendors</h3>
              </div>
          <div className="relative flex w-full gap-2 md:w-max">
            <input
              type="text"
              name="search"
              placeholder="Search by name,location.."
              onChange={(e) => setSearch(e.target.value)}
              onKeyUp={handleSearch}
              className="px-4 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>
          <h3>Sort By:</h3>
            <div>
              <VendorSort onChange={handleSortChange} />
            </div>
        </div>



        <div className="flex md:flex-row flex-col">
          
          <div>
            <h3 className="-mt-10 mb-5 font-semibold">Filter By</h3>

            <VendorFilters
              vendorTypeData={vendorTypeData}
              setCategory={setCategory}
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5 md:ml-10">
            {noResults ? (
              <p className="text-center w-full text-red-500 font-bold">
                Sorry, no search results found.
              </p>
            ) : (
              <Suspense fallback={<LoadingSpinner />}>
                {vendors.map((vendor, index) => (
                  <div key={index} className="w-full">
                    <VendorCard {...vendor} />
                  </div>
                ))}
              </Suspense>
            )}
          </div>

        </div>

      </section>

        <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        />


      <div className="mt-10 bg-white">
        <Footer />
      </div>
    </>
  );
};

export default VendorsListing;
