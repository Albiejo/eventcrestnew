import { Request, Response } from "express";
import { CustomError } from "../Error/CustomError";
import { addNewLive, changeStatus, getAllLive } from "../Service/liveService";
import { handleError } from "../Util/handleError";




class LiveController{


  async getLive(req: Request, res: Response){

    try {
      console.log("live function called:")
      const data = await getAllLive();
      console.log("live data :",data)
      return res.status(200).json({ data: data });
    } catch (error) {
      handleError(res, error, "getLive");
    }
  }


  
  async addLive(req: Request, res: Response){
    try {
   
      const { url } = req.body;
      const data = await addNewLive(url);
      return res.status(200).json({ live: data });
    } catch (error) {
      handleError(res, error, "addLive");
    }
  }


  async changeLiveStatus(req: Request, res: Response){
    try {
    
      const { url } = req.body;
    
      const data = await changeStatus(url);
      return res.status(200).json({ live: data });
    } catch (error) {
      handleError(res, error, "changeLiveStatus");
    }
  }
};

export default new LiveController();