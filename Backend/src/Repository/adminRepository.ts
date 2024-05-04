import Admin , { AdminDocument } from "../Model/Admin";
import { BaseRepository } from "./baseRepository";



export class AdminRepository extends BaseRepository<AdminDocument>{

  constructor(){
    super(Admin)
  }


  async findByEmail(email:string): Promise<AdminDocument | null> {
    return await Admin.findOne({ email });
  }

}




