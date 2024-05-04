
import { CustomError } from "../Error/CustomError";
import Post,{PostDocument} from "../Model/Post";
import { createNewPost, deletePostById, findPostById, findPostsByVendorId } from '../Repository/postRepo';
import mongoose from "mongoose";



export const createPost=async(caption:string,imageName:string,vendor_id:string): Promise<object>=>{
    try{
      const vendorIdObjectId =new mongoose.Types.ObjectId(vendor_id) as unknown as mongoose.Schema.Types.ObjectId;
      const add= await createNewPost({caption , image:imageName, vendor_id:vendorIdObjectId});
      return {post:add};
    } catch (error) {
      console.error("Error fetching createPost", error);
      throw new CustomError("Unable to fetch createPost", 500);
    }
  }

export const getAllPosts=async(vendor_id:string):Promise<PostDocument[]>=>{
  try{
    const posts=await findPostsByVendorId(vendor_id)
    return posts;
  } catch (error) {
    console.error("Error fetching getAllPosts", error);
    throw new CustomError("Unable to fetch getAllPosts", 500);
  }
}


export const getPostById=async(_id:string):Promise<PostDocument| null>=>{
  try{
    const post=await findPostById(_id)
    return post;
  } catch (error) {
    console.error("Error fetching getPostById", error);
    throw new CustomError("Unable to fetch getPostById", 500);
  }
}


export const deletePost=async(_id:string):Promise<PostDocument| null>=>{
  try{
    const post=await deletePostById(_id)
    return post;
  } catch (error) {
      console.error("Error fetching deletePost", error);
      throw new CustomError("Unable to fetch deletePost", 500);
  }
}