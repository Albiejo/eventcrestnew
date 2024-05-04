import DefaultLayout from '../../../Layout/VendorLayout'
import Breadcrumb from '../../../Components/Vendor/Breadcrumbs/Breadcrumb';
import BookingTable from '../../../Components/Vendor/Tables/BookingTable';

const BookingHistory = () => {
  return (
    <DefaultLayout>
    <Breadcrumb pageName="History" folderName='Booking'/>

    <div className="flex flex-col gap-10">
      
      <BookingTable/>
      
    </div>
  </DefaultLayout>
  )
}

export default BookingHistory