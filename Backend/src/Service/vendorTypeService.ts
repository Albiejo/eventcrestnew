import { CustomError } from "../Error/CustomError";
import { createVendorType, findVerndorTypeByName ,findVerndorTypes , VendorfindByIdAndDelete , getVendorById , UpdateTypeById} from "../Repository/vendorTypeRepository";

export const addType = async (type: string, status: string)=> {
  try {
    const existingType = await findVerndorTypeByName(type);
    if (existingType) {
      throw new CustomError("Type already exist!" , 400);
    }
    
    const new_type=await createVendorType({type,status:status==="Active"})
    return {  message: "New Type added..." ,new_type};
  } catch (error) {
    console.error("Error fetching addType", error);
    throw error;
  }
};



export const getTypes = async ()=> {
  try {
    const availableTypes=await findVerndorTypes()
    return availableTypes;
  } catch (error) {
    console.error("Error fetching getTypes", error);
    throw new CustomError("Unable to process get Types now , try after some time", 500);
  }
};


export const deleteVendorType = async(vendorId:string): Promise<void> =>{
  try {
    
    
    const deletedVendor = await VendorfindByIdAndDelete(vendorId);
    
    if (!deletedVendor) {
      throw new Error('Vendor not found');
    }
  } catch (error) {
    console.error("Error fetching deleteVendorType", error);
    throw error;
  }

}


export const getSingleVendordata = async(vendorId:string)=>{
try {
  return await getVendorById(vendorId)
} catch (error) {
  console.error("Error fetching getSingleVendordata", error);
  throw error;
}
}


export const updateVendorType= async(vendorTypeId: string, type: string, status: string):Promise<any>=>{
try {
  const updateddata = await UpdateTypeById(vendorTypeId , {type , status:status==="Active"?true:false});
  return updateddata;
} catch (error) {
  console.error("Error fetching updateVendorType", error);
  throw error;
}
}

