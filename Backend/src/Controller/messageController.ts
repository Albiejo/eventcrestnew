import { Request, Response } from "express";
import messageModel from '../Model/MessageModel';
import { ErrorMessages } from "../Util/enums";
import Conversation from "../Model/Conversation";
import { handleError } from "../Util/handleError";



class messageController{


    async createMessage (req: Request, res: Response):Promise<void>{

        const {conversationId , senderId , text , imageName,imageUrl } = req.body;
    
        const message = new messageModel({
            conversationId,
            senderId,
            text,
            imageName,
            imageUrl
        })   
        try {
            const response = await message.save();

            await Conversation.findByIdAndUpdate(
                conversationId,
                { latestMessageTimestamp: new Date() },
                { new: true } 
            );

            res.status(200).json(response);
        } catch (error) {
            handleError(res, error, "createMessage");
        }
    }



    async getMessages (req: Request, res: Response){
        const conversationId = req.query.conversationId;
        try {
            const messages = await messageModel.find({conversationId: conversationId});
            return res.status(200).json(messages);
        } catch (error) {
            handleError(res, error, "getMessages");
            
        }
    }


}

export default new messageController();


