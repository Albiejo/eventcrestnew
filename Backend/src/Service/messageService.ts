import { CustomError } from "../Error/CustomError";
import MessageModel from "../Model/MessageModel";
import messageRepository from "../Repository/messageRepository";



class MessageService {


    async createMessage(conversationId: string, senderId: string, text: string,imageName:string,imageUrl:string) {
        try {
          return await messageRepository.create({ conversationId, senderId, text,imageName,imageUrl});
        } catch (error) {
          console.error("Error in createMessage:", error);
          throw new CustomError("Failed to create message.", 500);
        }
      }


      async findMessages(conversationId: string) {
        try {
          return await messageRepository.findByCondition({ conversationId });
        } catch (error) {
          console.error("Error in findMessages:", error);
          throw new CustomError("Failed to retrieve messages.", 500);
        }
      }



      async changeReadStatus(chatId:string,senderId:string){
        try {
          return messageRepository.updateReadStatus(chatId,senderId)
        } catch (error) {
          console.error("Error in changeReadStatus:", error);
          throw new CustomError("Failed to change the status.", 500);
        }
      }

      

}



export default new MessageService();