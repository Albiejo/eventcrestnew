import  { MouseEvent } from 'react';
import './Messenger.css';
import Conversation from '../../../Components/User/conversations/Conversation';
import { useSelector } from 'react-redux';
import UserRootState from '../../../Redux/rootstate/UserState';
import { useEffect, useRef, useState } from 'react';
import { axiosInstanceAdmin, axiosInstanceChat, axiosInstanceMsg } from '../../../Api/axiosinstance';
import {io } from 'socket.io-client'
import Message from '../../../Components/User/messages/Message';
import Picker from '@emoji-mart/react'
import { Button, IconButton } from '@material-tailwind/react';
import { v4 as uuidv4 } from "uuid";
import { ChangeEvent } from 'react';
import React from 'react';
import { MessageType } from '../../../Types/messageType';
import { VendorData } from '../../../Types/vendorType';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { conversationType } from '../../../Types/ConversationType';
import { useNavigate } from 'react-router-dom';


const ACCESS_KEY = import.meta.env.VITE_ACCESS_KEY|| "";
const BUCKET_REGION = import.meta.env.VITE_BUCKET_REGION || "";
const BUCKET_NAME = import.meta.env.VITE_BUCKET_NAME || "";
const SECRET_ACCESS_KEY = import.meta.env.VITE_SECRET_ACCESS_KEY || "";


interface FileState {
  filename: string;
  originalFile: File;
}






const Messenger = () => {


  const navigate = useNavigate();
    const s3 = new S3Client({
        credentials: {
          accessKeyId: ACCESS_KEY!,
          secretAccessKey: SECRET_ACCESS_KEY!,
        },
        region: BUCKET_REGION!,
      });



    const user = useSelector((state: UserRootState) => state.user.userdata);
    const [conversation , setconversation] = useState([]);
    const [currentchat , setcurrentchat]  = useState<conversationType | null>(null);
    const [messages , setmessages] = useState<MessageType[]>([]);
    const [arrivalMessage , setArrivalMessage] = useState<MessageType | null>(null)
    const [newMessage, setnewMessage] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [receiverdata , setReceiverdata] = useState<VendorData | null>(null);
    const [typingstatus , settypingstatus] = useState(false);
    const [Active , setActive] = useState(false);
    const [lastseen ,setlastseen] = useState("");
    const [notActive ,setNotActive] = useState("");
    const [filemodal, setFileModal] = useState(false);
    const [file, setFile] =  useState<FileState | null>(null);


    const scrollRef = useRef<HTMLDivElement>(null);
    const socket = useRef(io("http://localhost:3001")); 

    


    const sendHeartbeat = () => {
        socket.current.emit("heartbeat");
    };

    setInterval(sendHeartbeat, 60000);


    useEffect(()=>{
        socket.current = io("http://localhost:3001");
        socket.current.on("getMessage" , (data)=>{
            setArrivalMessage({
              senderId : data.senderId , 
              conversationId: data.conversationId || "",
                text : data.text,
                imageName: "",
                imageUrl: "",
                createdAt : Date.now()
            });
        })

        socket.current.on("typingsent" , (senderId)=>{  
            console.log(senderId)
            settypingstatus(true)
        })
        socket.current.on("stopTypingsent" , (senderId)=>{
          console.log(senderId)
            settypingstatus(false)      
        })
   

    },[typingstatus ,messages , conversation])



    useEffect(()=>{
        socket.current.emit("adduser" , user?._id);
        socket.current.on("getUsers" , (users)=>{   
          console.log(users)         
        })
    },[user])


    
    useEffect(()=>{
        arrivalMessage && currentchat?.members.includes(arrivalMessage.senderId) &&
        setmessages((prev)=>[...prev , arrivalMessage])  
    },[arrivalMessage , currentchat])


    const getconversation = async()=>{  
      try {
          const res = await axiosInstanceChat.get(`/?userId=${user?._id}`)
          setconversation(res.data)
      } catch (error) {
          console.log(error)
      }
  }

  useEffect(()=>{
       
    getconversation();

  },[user?._id  , messages])


    useEffect(()=>{

        const getmessages = async()=>{
            try {
                const res = await axiosInstanceMsg.get(`/?conversationId=${currentchat?._id}`)
                setmessages(res.data)
                
            } catch (error) {
                console.log(error)
            }
        }
        
        getmessages();

    } , [currentchat])








    const receiverId = currentchat?.members.find((member)=>member !==user?._id)
   
   
    const handleDivClick = (conversation:conversationType) => {
        setcurrentchat(conversation)
        const receiverId = currentchat?.members.find((member)=>member !==user?._id)
        checkUserActiveStatus(receiverId as string);
        fetchreceiverdata();
        
    }

    const checkUserActiveStatus = (receiverId:string) => {
        socket.current.emit("checkUserActiveStatus", receiverId);
    };

    const fetchreceiverdata = async()=>{
        await axiosInstanceAdmin.get(`/getVendor?Id=${receiverId}`,{withCredentials:true})
        .then((res)=>{
            setReceiverdata(res.data.data)
        })
    }

    const handleSubmit=async(e: MouseEvent<HTMLButtonElement>)=>{
            e.preventDefault();
            sendHeartbeat();
            const message = {
                senderId: user?._id,
                text:newMessage,
                image: "",
                imageUrl: "",
                conversationId: currentchat?._id
            };
            socket.current.emit("sendMessage" , {
                senderId : user?._id,
                receiverId,
                text:newMessage
            })

            try {
              axiosInstanceMsg.post('/' , message).then((res)=>{
                setmessages([...messages , res.data]);
                setnewMessage("")
              }).catch ((error)=>{
              console.log(error)
              })
            } catch (error) {
              console.log(error)
            }
           getconversation();
    };

    const handleTyping = () => {
           
     socket.current.emit('typing', { receiverId: receiverId });
    };
  
    const handleStopTyping = () => {
     socket.current.emit('stopTyping', { receiverId: receiverId });
    };

    const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setnewMessage(e.target.value);
    handleTyping();
    };
        
  const handleEmojiSelect = (emoji: string | { native: string }) => {
          setnewMessage("hello")
          if (typeof emoji === 'string') {
            console.log("Emoji Selected:", emoji);
            setnewMessage(prev => prev + emoji);
            
          } else {
            console.log("Emoji Selected:", emoji.native);
            setnewMessage(prev => prev + emoji.native);
          }
  };
    
  useEffect(() => {

            socket.current.on("userActiveStatus", ({  active , lastSeen }) => {
                setActive(active);
                const timePart = lastSeen.split(", ")[1];
                setlastseen(timePart)
                setNotActive("")
            });

            socket.current.on("userNotACtive", ({  message }) => {               
                setNotActive(message);
            });

            scrollRef.current?.scrollIntoView({ behavior:"smooth"})

  }, [Active , lastseen ,notActive ,messages ,arrivalMessage]);
      
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFileModal(true);
      setFile({
        filename: URL.createObjectURL(selectedFile),
        originalFile: selectedFile,
      });
    }
  };

  const handleRemoveFile = () => {
    setFileModal(false);
    setFile(null); 
  };

  const handleSend = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (file) {
      const imageName = uuidv4();
      const params = {
        Bucket: BUCKET_NAME!,
        Key: imageName,
        Body: file.originalFile,
        ContentType: file.originalFile.type,
      };
      const command = new PutObjectCommand(params);
      await s3.send(command);
      const getObjectParams = {
        Bucket: BUCKET_NAME!,
        Key: imageName,
      };
      const command2 = new GetObjectCommand(getObjectParams);
      const url = await getSignedUrl(s3, command2, { expiresIn: 86400 * 3 });
      const message = {
        senderId: user?._id,
        text: "",
        conversationId: currentchat?._id,
        imageName: imageName,
        imageUrl: url,
      };

      socket.current?.emit("sendMessage", {
        senderId: user?._id,
        receiverId,
        text: "",
        image: imageName,
        imageUrl: url,
      });

      await axiosInstanceMsg
        .post("/", message)
        .then((res) => {
          setmessages([...messages, res.data]);
          setnewMessage("");
          setFileModal(false);
          setFile(null);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };


  const handleClick =()=>{
    navigate('/vendors')
  }
   return (
   <>
   
   <div className='navbar'>

   </div>

   <div className="messenger">
    
            <div className="chatmenu w-50">
                <div className="chatmenuWrapper" >
                {conversation.map((c ) => (
                    <>
                        <div onClick={()=>handleDivClick(c)} >
                        <Conversation  conversation={c}  currentUser={{ _id: user?._id || '' }}/>
                        </div>
                       
                    </>
                ))}
                </div>
            </div>

            {!filemodal ? (

            <div className="chatbox">
                <div className="chatboxWrapper"> 
                    {
                        currentchat ?
                        (
                        <>
                        <div className="chatboxTop">
                    
                            {messages.map((m)=>(
                            
                                <div ref={scrollRef}>
                                    <Message message={m} own={m.senderId === user?._id} />
                                </div>
                            ))}
                            { typingstatus ? (
                           <span className="text-black font-bold">Typing...</span>
                            ) : ""}

                        </div>

                    <div className="chatboxBottom">
                              <div className="flex">
                           
                                <input
                                  type="file"
                                  ref={fileInputRef}
                                  style={{ display: "none" }}
                                  onChange={handleFileChange}
                                />

                            
                                <IconButton
                                  onClick={handleButtonClick}
                                  variant="text"
                                  className="rounded-full"
                                  placeholder={undefined}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2}
                                    stroke="currentColor"
                                    className="h-5 w-5"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                                    />
                                  </svg>
                                </IconButton>
                              </div>

                        <textarea className='chatMessageInput' placeholder='write something..' onChange={handleInputChange} value={newMessage}  onBlur={handleStopTyping} ></textarea>
                           {showEmojiPicker && (
                                <Picker
                                    set='apple'
                                    onSelect={handleEmojiSelect} 
                                    style={{ position: 'absolute', bottom: '70px', right: '10px' ,  zIndex: 1}}
                                  
                                />
                            )}
                        <button onClick={() => setShowEmojiPicker(prev => !prev)}>😀</button>
                        <button className='chatSubmitButton' onClick={handleSubmit}>send</button>
                    
                    </div>
                        </> ):( <>
                        <span className='noConversationtext  text-black'>Select a Conversation</span>
                        <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7OjKKIJLTIMYuEY4zG9gDe0rmF9qtS0J2KQ&usqp=CAU'
                        alt='no conversation' className='h-1/2 w-1/2 ml-36 mt-28'/>
                         
                        <Button  placeholder={undefined} className='mx-auto bg-pink-600' onClick={handleClick}>EXPLORE VENDORS</Button>
                        
                    </>)
                    }
                    
                </div>
            </div>
            
            ) :   
            ( <>

            <div className="border-2 border-gray-900 relative w-1/2 bg-gray-100  flex flex-col  justify-center items-center">
            
              <button
                onClick={handleRemoveFile}
                className=" absolute top-2 left-6  pt-20"
              >
                <i className="fa-solid fa-xmark text-3xl"></i>
              </button>

              
              {file && (
                <img
                  src={file?.filename}
                  alt="Selected"
                  className="w-80 h-80 rounded object-cover" 
                />
              )}

         

              <button
                type="button"
                className="bg-green-700 rounded-full p-2 absolute bottom-14 right-4 cursor-pointer hover:bg-blue-gray-200"
                onClick={(e) => handleSend(e)}
                disabled={!file}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="h-10 w-10"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                  />
                </svg>
              </button>

            
            </div>
          </> )}

            <div className="w-1/4 bg-gray-200 border-l border-gray-300">
                <div className="p-4 mt-6">
                    { currentchat ? (
                        <>
                            
                            <p className="font-bold text-gray-700">{receiverdata?.name}</p>
                          
                           
                            <p className="mt-2 text-sm text-green-900 font-bold">
                                {notActive ? <span className="mr-1">Offline</span> : (
                                    Active ? (
                                        <>
                                            <span className="mr-1">Active now</span>
                                            <div className="inline-block w-2 h-2  bg-green-500 rounded-full"></div>
                                        </>
                                    ) : `Last seen at ${lastseen}`
                                )}
                            </p>
                         
                            {receiverdata && (
                                
                                <>
                              
                                <div className="mt-4">
                                    <img
                                        src={receiverdata.coverpicUrl}
                                        alt="image"
                                        className="w-full h-full "
                                    />
                                </div>
                                <div>
                                    <h4 className='text-center mt-2 font-bold text-gray-700'>ABOUT</h4>    
                                    <p className='text-sm text-gray-700 mt-4'>{receiverdata?.about}</p>
                                </div>  

                                </>
                                
                            )}
                          
                        </>
                    ) : 
                    <p className="mt-2 text-center  text-sm text-black-700 font-bold">No Conversations selected !!</p>
                    }
                </div>
            </div>


   </div>

   </>
  )

}

export default Messenger