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
        <img
        className="messageImg"
        src={own ? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLe5PABjXc17cjIMOibECLM7ppDwMmiDg6Dw&usqp=CAU' :"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBwgu1A5zgPSvfE83nurkuzNEoXs9DMNr8Ww&usqp=CAU"}
        alt="image"
        />
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