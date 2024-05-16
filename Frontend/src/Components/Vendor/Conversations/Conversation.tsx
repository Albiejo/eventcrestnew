import { useEffect, useState } from 'react'
import './Conversation.css'
import { axiosInstance } from '../../../Api/axiosinstance';
import { conversation } from '../../../Types/ConversationType';
import { UserData } from '../../../Types/userType';
import { format } from 'date-fns';



interface currentuser{
  _id:string
}


const Conversation = ({conversation , currentUser}: { conversation: conversation, currentUser: currentuser }) => {


  const [user , setuser] = useState<UserData | null>(null)

  const latestMessageTime = format(new Date(conversation.updatedAt), 'h:mm a');



  useEffect(()=>{
    const friendId = conversation.members.find((m)=> m !== currentUser._id)
   
  
    const getVendor = async ()=>{
      try {
        const res = await axiosInstance.get(`/getUser?userId=${friendId}`)
        console.log(res.data)
        setuser(res.data)
      
      } catch (error) {
        console.log(error)
      }
    }
    getVendor();

  },[currentUser , conversation])





  return (
    <div className="flex items-center justify-between p-3 cursor-pointer mt-5 bg-white rounded-lg hover:bg-gray-300 ">
    <div className="flex items-center">
        <img
            className="w-10 h-10 rounded-full object-cover mr-4"
            src={user?.imageUrl ? user?.imageUrl : '/imgs/head.png'}
            alt=""
        />
        <div>
            <span className="block font-medium">{user?.name}</span>
            <span className="block text-sm text-gray-700">{conversation.latestMessage}</span>
        </div>
    </div>
    <div className="flex items-center">
        <span className="block text-sm mr-2">{latestMessageTime}</span>
        
    </div>
</div>
  )
}

export default Conversation