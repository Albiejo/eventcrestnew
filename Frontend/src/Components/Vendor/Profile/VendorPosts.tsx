import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { toast } from "react-toastify";
import {axiosInstanceVendor} from "../../../Api/axiosinstance";
import { DialogWithImage } from "./DialogWithImage";
import { AxiosResponse } from 'axios'; 


interface Post {
 imageUrl: string;
 _id: string;
}

const VendorPosts: React.FC = () => {


 const [posts, setPosts] = useState<Post[]>([]);
 const [fetchTrigger, setFetchTrigger] = useState(false);
 const [selectedPost, setSelectedPost] = useState<Post | null>(null);
 const [open, setOpen] = useState(false);
 const navigate = useNavigate();
 const location = useLocation();
 const path=location.pathname;

 //taking vendor id from url as query
 const queryParams = new URLSearchParams(location.search);
 const vendorid :string= queryParams.get('vid') as string;


 useEffect(() => {
   
    axiosInstanceVendor.get<Post[]>(`/posts?vendorid=${vendorid}` , {withCredentials:true}).then((response: AxiosResponse<Post[]>) => {
      setPosts(response.data);
      console.log("received data length :", response.data.length);
    }).catch((error) => {
      console.log("here", error);
    });
 }, [fetchTrigger]);



 const handleDelete = (postId: string) => {
    axiosInstanceVendor.delete(`/posts/${postId}`).then((response) => {
      toast.success(response.data.message);
      setFetchTrigger(!fetchTrigger);
      navigate("/Vendor/profile");
    }).catch((error) => {
      toast.error(error.response.data.message);
      console.log("here", error);
    });
 };


 const handleOpen = () => {
    setOpen(!open);
 };


 return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      {posts.map(({ imageUrl, _id }, index) => (
        <div key={index} className="relative" onClick={() => { setSelectedPost({ imageUrl, _id }); handleOpen(); }}>
          <img
            className="h-40 w-full max-w-full rounded-lg object-cover object-center"
            src={imageUrl}
            alt="gallery-photo"
          />
          {path=="/viewVendor"?"":<button
            onClick={() => handleDelete(_id)}
            className="absolute top-0 right-0 m-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>}
          
          {selectedPost && (
            <DialogWithImage
              imageUrl={selectedPost.imageUrl}
              open={open}
              handler={handleOpen}
            />
          )}
        </div>
      ))}
    </div>
 );
};

export default VendorPosts;
