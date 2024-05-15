import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import Breadcrumb from '../../../Components/Vendor/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../../Layout/VendorLayout';
import { useSelector } from 'react-redux';
import VendorRootState from '../../../Redux/rootstate/VendorState';
import { useEffect, useState } from 'react';
import { axiosInstanceVendor } from '../../../Api/axiosinstance';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

interface Post {
  imageUrl: string;
  _id: string;
  caption: string;
}

export default function Posts() {


  const vendorData = useSelector(
    (state: VendorRootState) => state.vendor.vendordata,
  );
  const [posts, setPosts] = useState<Post[]>([]);
  const [fetchTrigger, setFetchTrigger] = useState(false);
  const navigate = useNavigate();


  const customToastStyle = {
    background: 'red', // Change 'red' to the desired background color
    color: 'white', // Optional: Change 'white' to the desired text color
  };

  
  useEffect(() => {
    axiosInstanceVendor
      .get(`/posts?vendorid=${vendorData?._id}`, { withCredentials: true })
      .then((response) => {
        setPosts(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log('here', error);
      });
  }, [fetchTrigger]);


  const handleDelete = (id: string) => {
    axiosInstanceVendor
      .delete(`/posts/${id}`)
      .then((response) => {
        toast.success(response.data.message);
        setFetchTrigger(!fetchTrigger);
        navigate('/Vendor/view-posts');
      })
      .catch((error) => {
        toast.error(error.response.data.message , {style:customToastStyle});
        console.log('here', error);
      });
  };

  return (
    <>
      <DefaultLayout>
        <Breadcrumb pageName="Posts" folderName=""/>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 m-2">
          { 
          posts.length === 0 ? (
        <div >
            <p className='ml-2 text-center mb-8 text-red-700 font-bold'>Sorry, you haven't created any posts yet !</p>
            <img src="https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTAyL3YxNDUtcG95ZC1mYWgtMDQtaWxsdXN0cmF0aW9ucy1qb2IxNzM3LnBuZw.png" alt="no favorites" />
        </div>
    ) :
       (   
          posts.map(({ imageUrl, caption, _id }, index) => (
            <div key={index} className="card shadow-lg rounded-lg relative">
              <div className="card-body">
                <img
                  className="h-40 w-full max-w-full rounded-lg object-cover object-center"
                  src={imageUrl}
                  alt="gallery-photo"
                />
                <button
                  onClick={() => handleDelete(_id)}
                  className="absolute top-0 right-0 m-2 bg-danger hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
                <p className="mt-4 text-center p-2">{caption}</p>
              </div>
            </div>
          )))
        }
        </div>
      </DefaultLayout>
    </>
  );
}
