import { Request, Response } from "express";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import crypto from "crypto";
import sharp from "sharp";
import { createPost, deletePost, getAllPosts, getPostById } from "../Service/postService";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from 'dotenv';
dotenv.config();
import { CustomError } from "../Error/CustomError";
import { handleError } from "../Util/handleError";


//configuring s3
const s3 = new S3Client({
  credentials: {
    accessKeyId:process.env.ACCESS_KEY!,
    secretAccessKey:process.env.SECRET_ACCESS_KEY!,
  },
  region:process.env.BUCKET_REGION!,
});

const randomImage = (bytes = 32) => crypto.randomBytes(bytes).toString("hex");





class PostController {
  
  async addNewPost(req: Request, res: Response){
    
    try {
      const caption = req.body.caption;
      const vendor_id: string = req.query.vendorid as string;
      const buffer = await sharp(req.file?.buffer)
        .resize({ height: 1920, width: 1080, fit: "contain" })
        .toBuffer();

      const imageName = randomImage();

      const params = {
        Bucket: process.env.BUCKET_NAME!,
        Key: imageName,
        Body: buffer,
        ContentType: req.file?.mimetype,
      };

      const command = new PutObjectCommand(params);

      await s3.send(command);

      const post = await createPost(caption, imageName, vendor_id);
      return res.status(201).json(post);
    } catch (error) {
      handleError(res, error, "addNewPost");
    }
  }


  
  async getPosts(req: Request, res: Response){
    try {

      const vendor_id:string=req.query.vendorid as string;
      const posts=await getAllPosts(vendor_id)

      for(const post of posts){
        const getObjectParams={
          Bucket: process.env.BUCKET_NAME!,
          Key: post.image,
        }
  
        const command = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
        post.imageUrl=url;
      }

      console.log(posts)

      
      return  res.status(201).json(posts);
    } catch (error) {
      handleError(res, error, "getPosts");
    }
  }





  async deletePost(req: Request, res: Response){
    try {
      const id=req.params.id;
      const post=await getPostById(id);

      if(!post){
        throw new CustomError('Post not found!',404)
      }
      const params={
        Bucket: process.env.BUCKET_NAME!,
        Key: post.image,
      }
      
      const command=new DeleteObjectCommand(params);
      await s3.send(command);
      
      await deletePost(id);
      return res.status(200).json({message:"Post deleted successfully"});


    } catch (error) {
      handleError(res, error, "deletePost");
    }
  }
};



export default new PostController();

