import { Request, Response } from "express";
import { CustomError } from "../Error/CustomError";
import { addNewLive, changeStatus, getAllLive } from "../Service/liveService";
import { handleError } from "../Util/handleError";

class LiveController{

  async getLive(req: Request, res: Response){

    try {
      const data = await getAllLive();
      return res.status(200).json({ data: data });
    } catch (error) {
      handleError(res, error, "getLive");
    }
  }


  
  async addLive(req: Request, res: Response){
    try {
      console.log("inside live controller 2 and adding live to db")
      const { url } = req.body;
      const data = await addNewLive(url);
      return res.status(200).json({ live: data });
    } catch (error) {
      handleError(res, error, "addLive");
    }
  }


  async changeLiveStatus(req: Request, res: Response){
    try {
      console.log("inside live controller 3")
      const { url } = req.body;
      console.log(url)
      const data = await changeStatus(url);
      return res.status(200).json({ live: data });
    } catch (error) {
      handleError(res, error, "changeLiveStatus");
    }
  }
};

export default new LiveController();