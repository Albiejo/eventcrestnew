import { useCallback, useEffect, useMemo, useState } from 'react'
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


  const friendId = useMemo(() => {
    return conversation.members.find((m) => m !== currentUser._id);
}, [conversation, currentUser._id]);


  const getVendor = useCallback(async () => {
    if (!friendId) return;
    try {
        const res = await axiosInstance.get(`/getUser?userId=${friendId}`);
        setuser(res.data);
    } catch (error) {
        console.log(error);
    }
}, [friendId]);

useEffect(() => {
  getVendor();
}, [getVendor]);



  return (
    <div className="flex items-center justify-between p-3 cursor-pointer mt-5  rounded-lg hover:bg-gray-500 ">
    <div className="flex items-center">
        <img
            className="w-10 h-10 rounded-full object-cover mr-4"
            src={user?.image ? user?.image : '/imgs/head.png'}
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