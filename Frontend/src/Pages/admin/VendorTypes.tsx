import AddVendorType from '../../Components/Admin/vendor-types/AddVendorType'
import VendorTypeList from '../../Components/Admin/vendor-types/VendorTypeList'

function VendorTypes() {

  return (
    <div className="m-20">
        <AddVendorType/>
        <div className="mt-8">
        <VendorTypeList/>
        </div>
    </div>
  )
}

export default VendorTypes
