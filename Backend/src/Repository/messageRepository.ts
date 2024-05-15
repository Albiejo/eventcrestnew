import MessageModel , {MessageDocument} from "../Model/MessageModel";
import { BaseRepository } from "./baseRepository";




class MessageRepository extends BaseRepository<MessageDocument>{
    constructor(){
        super(MessageModel)
    }

    async updateReadStatus(chatId:string,senderId:string){
        return MessageModel.updateMany({conversationId:chatId,senderId:senderId},{$set:{isRead:true}})
    }
}

export default new MessageRepository()



