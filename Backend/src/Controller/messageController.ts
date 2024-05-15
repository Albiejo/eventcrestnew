import { Request, Response } from "express";
import messageModel from '../Model/MessageModel';
import messageService from "../Service/messageService";
import { handleError } from "../Util/handleError";
import conversationService from "../Service/conversationService";


class messageController{

    async createMessage (req: Request, res: Response):Promise<void>{ 
        try {
            const {conversationId , senderId , text , imageName,imageUrl } = req.body;
            const response = await messageService.createMessage(
                conversationId,
                senderId,
                text,
                imageName,
                imageUrl
              );

            await conversationService.updateConversation(
                conversationId,
                text
            );

            res.status(200).json(response);
        } catch (error) {
            handleError(res, error, "createMessage");
        }
    }


    async getMessages (req: Request, res: Response): Promise<any>{

        const conversationId: string = req.query.conversationId as string;
        try {
            const messages = await messageService.findMessages(conversationId);
            res.status(200).json(messages);
        } catch (error) {
            handleError(res, error, "getMessages");
            
        }
    }


    async changeRead(req: Request, res: Response): Promise<any> {
        try {
          const { chatId, senderId } = req.body;
          const messages = await messageService.changeReadStatus(chatId,senderId)
          res.status(200).json({ messages });
        } catch (error) {
          handleError(res, error, "changeRead");
        }
      }


}

export default new messageController();


