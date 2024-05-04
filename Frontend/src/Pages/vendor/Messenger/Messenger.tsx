import './vendorMessenger.css';
import Conversation from '../../../Components/Vendor/Conversations/Conversation';
import Message from '../../../Components/User/messages/Message';
import { useSelector } from 'react-redux';
import UserRootState from '../../../Redux/rootstate/UserState';
import VendorRootState from '../../../Redux/rootstate/VendorState';
import { useEffect, useRef, useState } from 'react';
import { axiosInstanceChat, axiosInstanceMsg } from '../../../Api/axiosinstance';
import {io} from 'socket.io-client';
import DefaultLayout from '../../../Layout/VendorLayout';
import Picker from '@emoji-mart/react';
import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
  } from "@aws-sdk/client-s3";
  import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
  import { v4 as uuidv4 } from "uuid";
import { IconButton } from '@material-tailwind/react';
import { MessageType } from '../../../Types/messageType';
import  { MouseEvent } from 'react';
import { ChangeEvent } from 'react';

  const ACCESS_KEY = import.meta.env.VITE_ACCESS_KEY || "";
  const BUCKET_REGION = import.meta.env.VITE_BUCKET_REGION || "";
  const BUCKET_NAME = import.meta.env.VITE_BUCKET_NAME || "";
  const SECRET_ACCESS_KEY = import.meta.env.VITE_SECRET_ACCESS_KEY || "";


  interface conversationType{
    _id:string;
    members: string[];
    latestMessageTimestamp:Date;
    timestamps: Date;
  }


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
    const vendorData = useSelector(
        (state: VendorRootState) => state.vendor.vendordata,
      );


    const [conversation , setconversation] = useState([]);
    const [currentchat , setcurrentchat]  =  useState<conversationType | null>(null);
    const [messages , setmessages] = useState<MessageType[]>([]);
    const [arrivalMessage , setArrivalMessage] = useState<MessageType | null>(null);
    const [newMessage, setnewMessage] = useState("");

    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [typing , setTyping] = useState(false);
    const [filemodal, setFileModal] = useState(false);
    const [file, setFile] = useState<FileState | null>(null);

    const scrollRef = useRef<HTMLDivElement>(null);
    const socket = useRef(io("ws://localhost:8900")); 



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
            setTyping(true);

        })

        socket.current.on("stopTypingsent" , (senderId)=>{
            console.log(senderId)
            setTyping(false);
        })


     
    },[typing])


    useEffect(()=>{
        arrivalMessage && currentchat?.members.includes(arrivalMessage.senderId) &&
        setmessages((prev)=>[...prev , arrivalMessage])  
    },[arrivalMessage , currentchat])


    useEffect(()=>{
     
        socket.current.emit("adduser" , vendorData?._id);
        socket.current.on("getUsers" , (users)=>{
            console.log(users)
        })
    },[user])

    //getting conversations
    useEffect(()=>{
        const getconversation = async()=>{  
            try {
                const res = await axiosInstanceChat.get(`/?userId=${vendorData?._id}`)
                setconversation(res.data)
                
            } catch (error) {
                console.log(error)
            }
        }
        getconversation();

    } , [user?._id])

    //gettin messages
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
    },[currentchat])
    
    const receiverId = currentchat?.members.find((member)=>member !==vendorData?._id)



     const handleSubmit=async(e: MouseEvent<HTMLButtonElement>)=>{
        e.preventDefault();

        const message = {
            senderId: vendorData?._id,
            text:newMessage,
            conversationId: currentchat?._id
        };
        
        socket.current.emit("sendMessage" , {
            senderId : vendorData?._id,
            receiverId,
            text:newMessage
        })
        
        try {
                axiosInstanceMsg.post('/' , message).then((res)=>{
                setmessages([...messages , res.data]);
                setnewMessage("")
            })
          
        } catch (error) {
            console.log(error)
        }

     };



     //scrolling to bottom when new msg arrives
     useEffect(()=>{
        scrollRef.current?.scrollIntoView({ behavior:"smooth"})
    
     },[messages])

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


        const handleRemoveFile = () => {
            setFileModal(false);
            setFile(null); 
          };

        const fileInputRef =  useRef<HTMLInputElement>(null);

          
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

        const handleButtonClick = () => {
            // When the IconButton is clicked, trigger the hidden file input
            if (fileInputRef.current) {
              fileInputRef.current.click();
            }
          };

        const handleSend = async  (e: React.MouseEvent<HTMLButtonElement>) => {
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


  return (
   <>
   <DefaultLayout>

            <div className="messenger">
            
                        <div className="chatmenu">
                            <div className="chatmenuWrapper" >
                                
                            {conversation.map((c) => (
                                    <div onClick={()=> setcurrentchat(c)}>
                                    <Conversation  conversation={c} currentUser={{ _id: vendorData?._id || '' }}/>
                                    </div>
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
                                                <Message message={m} own={m.senderId === vendorData?._id} />
                                            </div>
                                        ))}

                                    {typing && (
                                        <div className='userTyping'>Typing...</div>
                                        )}
                                        
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

                                    <textarea className='chatMessageInput' placeholder='write something..'onChange={handleInputChange} value={newMessage}  onBlur={handleStopTyping}></textarea>
                                    <button className='chatSubmitButton' onClick={handleSubmit}>send</button>

                                    {showEmojiPicker && (
                                            <Picker
                                                set='apple'
                                                onSelect={handleEmojiSelect} 
                                                style={{ position: 'absolute', bottom: '70px', right: '10px' }}
                                            />
                                        )}
                                    <button onClick={() => setShowEmojiPicker(prev => !prev)}>😀</button>
                                    
                                </div>
                                    </> ):( <span className='noConversationtext'>open a conversation to start a chat</span>)
                                }
                                
                            </div>
                        </div>
                        ) :
                        ( 
                        <>
                            <div className="relative bg-gray-100 h-screen flex flex-col  justify-center items-center">
                             
                
                              <button
                                onClick={handleRemoveFile}
                                className="absolute top-2 left-2 pt-20"
                              >
                                <i className="fa-solid fa-xmark"></i>
                              </button>
                
                              {/* Centered image */}
                              {file && (
                                <img
                                  src={file?.filename}
                                  alt="Selected"
                                  className="w-80 h-80 rounded object-cover"
                                />
                              )}
                
                            
                
                              <button
                                type="button"
                                className="rounded-full p-2 absolute bottom-4 right-4 cursor-pointer hover:bg-blue-gray-200"
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
                        </> 
                        )}

            </div>

   </DefaultLayout>
   </>
  )
}

export default Messenger