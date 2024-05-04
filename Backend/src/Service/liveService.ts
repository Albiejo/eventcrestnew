import { CustomError } from "../Error/CustomError";
import { changeStatusById, createLive, findAllLive } from "../Repository/liveRepository";


export const addNewLive = async (url:string) => {
    try {
      const data = await createLive(url);
      return data;
    } catch (error) {
      console.error("Error fetching addNewLive", error);
      throw new CustomError("Unable to fetch addNewLive", 500);
    }
  };

export const changeStatus=async (url:string) => {
    try {
      const data = await changeStatusById(url);
      return data;
    } catch (error) {
      console.error("Error fetching changeStatus in live", error);
      throw new CustomError("Unable to fetch changeStatus in live", 500);
    }
  };


export const getAllLive= async() => {
    try {
      const data = await findAllLive();
      return data;
    } catch (error) {
        console.error("Error fetching getAllLive", error);
        throw new CustomError("Unable to fetch getAllLive", 500);
    }
  };