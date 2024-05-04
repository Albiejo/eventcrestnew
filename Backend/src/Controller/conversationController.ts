import ConversationModel from '../Model/Conversation';
import { Request, Response } from "express";
import { ErrorMessages } from '../Util/enums';
import { handleError } from '../Util/handleError';




class conversationController{

  
  async createChat(req: Request, res: Response){

    const {senderId , receiverId} = req.body;

    try {

      let chat = await ConversationModel.findOne({ members: [senderId, receiverId] });

      if (!chat) {
        const newChat = new ConversationModel({ members: [senderId, receiverId] });
        chat = await newChat.save();
      }

     return res.status(200).json(chat);

    } catch (error) {
      handleError(res, error, "createChat");
    }
}




  async findUserchats(req: Request, res: Response){

    const {userId }  = req.query;
    try {

      const chats = await ConversationModel.find({ members: { $in: [userId] } });
    
      chats.sort((a, b) => (b.latestMessageTimestamp || new Date()).getTime() - (a.latestMessageTimestamp || new Date()).getTime());
      
      return res.status(200).json(chats);
    } catch (error) {
      handleError(res, error, "findUserchats");
    }

}


};

export default new conversationController();












