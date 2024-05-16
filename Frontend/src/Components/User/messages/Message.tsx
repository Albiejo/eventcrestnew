import './Message.css'
import {format} from 'timeago.js'
import { MessageType } from '../../../Types/messageType';


interface MessageProps {
  message: MessageType;
  own: boolean;
}



const Message: React.FC<MessageProps> = ({message,own}) => {


    return (
        <div className={own ? "message own" : "message"}>
        <div className="messageTop">
       
        { message?.imageUrl ? (
                  <img
                    className="w-40 h-30 rounded-lg"
                    src={message?.imageUrl}
                    alt="Bonnie Green image"
                  ></img>
                ) :(
                    <p className="messageText">{message.text}</p>
        )}
      
        </div>
        <div className="messageBottom">{format(message.createdAt)}</div>
        </div>
        );
}

export default Message