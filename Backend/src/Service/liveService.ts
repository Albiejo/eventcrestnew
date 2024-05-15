import { CustomError } from "../Error/CustomError";
import { changeStatusById, createLive, findAllLive } from "../Repository/liveRepository";


export const addNewLive = async (url:string) => {
    try {
      const data = await createLive(url);
      return data;
    } catch (error) {
      console.error("Error fetching add New Live to database", error);
      throw new CustomError("unable to share stream link now , try after some time" , 400);
    }
  };

export const changeStatus=async (url:string) => {
    try {
      const data = await changeStatusById(url);
      return data;
    } catch (error) {
      console.error("Error fetching change Status in live", error);
      throw error;
    }
  };


export const getAllLive= async() => {
    try {
      const data = await findAllLive();
      return data;
    } catch (error) {
        console.error("Error fetching get All Live stream links from DB", error);
        throw new CustomError("unable to retrieve stream links now, try after some time" , 400);
    }
  };