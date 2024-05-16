import Conversation , {conversationDocument} from "../Model/Conversation";
import { BaseRepository } from "./baseRepository";

const MAX_MESSAGE_LENGTH = 10; 


class ConversationRepository extends BaseRepository<conversationDocument>{
    constructor(){
        super(Conversation)
    }

    

        findByIdAndUpdate(id:string,text:string){
            const slicedText = text.length > MAX_MESSAGE_LENGTH ? `${text.slice(0, MAX_MESSAGE_LENGTH)}...` : text;
            return Conversation.findOneAndUpdate({_id:id},{$set:{latestMessage:slicedText}})
        }
 
        findConversations(userId:string){
            return Conversation.find({ members: { $in: [userId] } }).sort({updatedAt:-1})
        }
}


export default new ConversationRepository();