import { useEffect, useState } from 'react'
import './Conversation.css'
import {axiosInstanceVendor } from '../../../Api/axiosinstance';
import { VendorData } from '../../../Types/vendorType';
import { conversation } from '../../../Types/ConversationType';
import { format } from 'date-fns';

interface currentuser{
  _id:string
}


const Conversation = ({conversation , currentUser }: { conversation: conversation, currentUser: currentuser }) => {
   
  const [vendor , setVendor] = useState<VendorData | null >(null) 

  const latestMessageTime = format(new Date(conversation.updatedAt), 'h:mm a');

  useEffect(()=>{
   
    const friendId = conversation.members.find((m)=> m !== currentUser._id)
    const getUser = async ()=>{
      try {
       await axiosInstanceVendor.get(`/getVendor?Id=${friendId}`)
       .then((res)=>{
        setVendor(res.data.data)
       })       
      } catch (error) {
        console.log(error)
      }
    }
    getUser();
  },[currentUser , conversation ])





  return (
    <div className="flex items-center justify-between p-3 cursor-pointer mt-5  rounded-lg hover:bg-gray-500 ">
    <div className="flex items-center">
        <img
            className="w-10 h-10 rounded-full object-cover mr-4"
            src={vendor?.logoUrl ? vendor.logoUrl : '/imgs/head.png'}
            alt=""
        />
        <div>
            <span className="block font-medium">{vendor?.name}</span>
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