import { CustomError } from "../Error/CustomError";
import { createVendorType, findVerndorTypeByName ,findVerndorTypes , VendorfindByIdAndDelete , getVendorById , UpdateTypeById} from "../Repository/vendorTypeRepository";


export const addType = async (type: string, status: string)=> {
  try {
    const existingType = await findVerndorTypeByName(type);
    if (existingType) {
      throw new Error("Type already exist!");
    }
    
    const new_type=await createVendorType({type,status:status==="Active"})

    return {  message: "New Type added..." ,new_type};
  } catch (error) {
    console.error("Error fetching addType", error);
    throw new CustomError("Unable to fetch addType", 500);
  }
};



export const getTypes = async ()=> {
  try {
    const availableTypes=await findVerndorTypes()
    return availableTypes;
  } catch (error) {
    console.error("Error fetching getTypes", error);
    throw new CustomError("Unable to fetch getTypes", 500);
  }
};


export const deleteVendorType = async(vendorId:string): Promise<void> =>{
  try {
    console.log("service" , vendorId , typeof vendorId);
    
    const deletedVendor = await VendorfindByIdAndDelete(vendorId);
    
    if (!deletedVendor) {
      throw new Error('Vendor not found');
    }
  } catch (error) {
    console.error("Error fetching deleteVendorType", error);
    throw new CustomError("Unable to fetch deleteVendorType", 500);
  }

}


export const getSingleVendordata = async(vendorId:string)=>{
try {
  return await getVendorById(vendorId)
} catch (error) {
  console.error("Error fetching getSingleVendordata", error);
  throw new CustomError("Unable to fetch getSingleVendordata", 500);
}
}


export const updateVendorType= async(vendorTypeId: string, type: string, status: string):Promise<any>=>{
try {
  const updateddata = await UpdateTypeById(vendorTypeId , {type , status:status==="Active"?true:false});
  return updateddata;
} catch (error) {
  console.error("Error fetching updateVendorType", error);
  throw new CustomError("Unable to fetch updateVendorType", 500);
}
}

