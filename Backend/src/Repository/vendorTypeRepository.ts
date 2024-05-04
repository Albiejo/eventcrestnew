import { VendorDocument } from "../Model/Vendor";
import vendorType from "../Model/VendorType";
import VendorType , {VendorTypeDocument} from "../Model/VendorType";

export const createVendorType = async (vendorData : Partial<VendorTypeDocument>): Promise<VendorTypeDocument> => {
    try {
      return await VendorType.create(vendorData);
    } catch (error) {
      throw error;
    }
  };


  export const findVerndorTypeByName = async (type: string): Promise<VendorTypeDocument | null> => {
    try {
      return await VendorType.findOne({ type });
    } catch (error) {
      throw error;
    }
  };


  export const findVerndorTypes = async (): Promise<VendorTypeDocument[] | null> => {
    try {
      return await VendorType.find();
    } catch (error) {
      throw error;
    }
  };

  export const findVerndorIdByType = async (type:string): Promise<VendorTypeDocument | null> => {
    try {
      const data=await VendorType.findOne({type:type});
      return data;
    } catch (error) {
      throw error;
    }
  };

  
export const VendorfindByIdAndDelete = async (vendorId: string):Promise<string> => {
  try {
    const deletedVendor = await VendorType.findByIdAndDelete(vendorId);
    if(!deletedVendor){
      throw Error;
    }else{
      return "deleted type"
    }
  } catch (error) {
    throw error;
  }
};


export const getVendorById=async(vendorId:string):Promise<VendorTypeDocument | null> =>{
try {
  return await VendorType.findOne({_id:vendorId})
} catch (error) {
  throw error;
}
}


export const  UpdateTypeById=async(vendortypeId:string  , update: Partial<VendorTypeDocument>):Promise<any>=>{
try {

  const updatedData = await VendorType.findByIdAndUpdate(vendortypeId , update , {new:true})
  return updatedData;
} catch (error) {
  throw new Error('Failed to update vendor type in the Db , try again !!');
}
}

