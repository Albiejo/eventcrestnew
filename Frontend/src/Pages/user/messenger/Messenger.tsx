import  { MouseEvent } from 'react';
import './Messenger.css';
import Conversation from '../../../Components/User/conversations/Conversation';
import { useSelector } from 'react-redux';
import UserRootState from '../../../Redux/rootstate/UserState';
import { useEffect, useRef, useState } from 'react';
import { axiosInstanceAdmin, axiosInstanceChat, axiosInstanceMsg } from '../../../Api/axiosinstance';
import {io} from 'socket.io-client'
import Message from '../../../Components/User/messages/Message';
import Picker from '@emoji-mart/react'
import { IconButton } from '@material-tailwind/react';
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



interface conversationType{
  _id:string;
  members: string[];
  latestMessageTimestamp:Date;
  timestamps: Date;
}

const ACCESS_KEY = import.meta.env.VITE_ACCESS_KEY|| "";
const BUCKET_REGION = import.meta.env.VITE_BUCKET_REGION || "";
const BUCKET_NAME = import.meta.env.VITE_BUCKET_NAME || "";
const SECRET_ACCESS_KEY = import.meta.env.VITE_SECRET_ACCESS_KEY || "";

interface FileState {
  filename: string;
  originalFile: File;
}

const Messenger = () => {


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
    const scrollRef = useRef<HTMLDivElement>(null);
    const socket = useRef(io("ws://localhost:8900")); 

    //typing status state
    const [typingstatus , settypingstatus] = useState(false);

    //checking user active or not active
    const [Active , setActive] = useState(false);
    const [lastseen ,setlastseen] = useState("");
    const [notActive ,setNotActive] = useState("");
    const [filemodal, setFileModal] = useState(false);
    const [file, setFile] =  useState<FileState | null>(null);


    
    //for checking lastseen
    const sendHeartbeat = () => {
        socket.current.emit("heartbeat");
    };

    //for checking lastseen
    setInterval(sendHeartbeat, 60000);



    //setting typing and no typing status
    useEffect(()=>{

        socket.current = io("ws://localhost:8900")
       
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
   

    },[typingstatus ,messages])



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




    //getting conversations
    useEffect(()=>{
        const getconversation = async()=>{  
            try {
                const res = await axiosInstanceChat.get(`/?userId=${user?._id}`)
                setconversation(res.data)
            } catch (error) {
                console.log(error)
            }
        }
        getconversation();

        const getmessages = async()=>{
            try {
                const res = await axiosInstanceMsg.get(`/?conversationId=${currentchat?._id}`)
                setmessages(res.data)
                
            } catch (error) {
                console.log(error)
            }
        }
        getmessages();

    } , [user?._id ,currentchat])








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

  axiosInstanceMsg.post('/' , message).then((res)=>{
   setmessages([...messages , res.data]);
   setnewMessage("")
 }).catch ((error)=>{
console.log(error)
 })
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
          if (typeof emoji === 'string') {
            setnewMessage(prev => prev + emoji);
          } else {
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
      
   


        // image input
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

      console.log("here")

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









   return (
   <>
   
   <div className='navbar'>

   </div>

   <div className="messenger">
    
            <div className="chatmenu w-50">
                <div className="chatmenuWrapper" >
               
              
                {conversation.map((c) => (
                    <>
                       
                        <div onClick={()=>handleDivClick(c)}>
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
                                {/* Hidden file input that triggers the file selection dialog */}
                                <input
                                  type="file"
                                  ref={fileInputRef}
                                  style={{ display: "none" }}
                                  onChange={handleFileChange}
                                />

                                {/* IconButton that triggers the hidden file input */}
                                <IconButton
                                  onClick={handleButtonClick}
                                  variant="text"
                                  className="rounded-full"
                                  placeholder={undefined}
                                  onPointerEnterCapture={undefined}
                                  onPointerLeaveCapture={undefined}
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
                                    style={{ position: 'absolute', bottom: '70px', right: '10px' }}
                                />
                            )}
                        <button onClick={() => setShowEmojiPicker(prev => !prev)}>😀</button>
                        <button className='chatSubmitButton' onClick={handleSubmit}>send</button>
                    
                    </div>
                        </> ):( <>
                        <span className='noConversationtext'>open a conversation to start a chat</span>
                        
                        <img src='data:image/jpeg;base64,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'
                        alt='no conversation' className='h-1/2 w-1/2 ml-36 mt-28'/>
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
                                {notActive ? "Not Active" : (
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
                                        src='/imgs/banner1.jpg'
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
                    <p className="mt-2 text-center  text-sm text-black-700 font-bold">No Conversations selected</p>
                    }
                </div>
            </div>


   </div>

   </>
  )

}

export default Messenger