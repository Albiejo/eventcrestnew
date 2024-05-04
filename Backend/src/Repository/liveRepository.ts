import mongoose, { Types } from "mongoose";
import Live from "../Model/Live";



export const createLive = async (url: string) => {
  try {
    return await Live.create({ url });
  } catch (error) {
    throw error;
  }
};

export const changeStatusById=async(url:string)=>{
    try {
        return await Live.updateOne({url:url},{$set:{finished:true}});
      } catch (error) {
        throw error;
      }
}

export const findAllLive=async()=>{
    try {
        return await Live.find({finished:false});
      } catch (error) {
        throw error;
      }
}

