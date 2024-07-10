import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Input,
  Button,

} from "@material-tailwind/react";
import UserRootState from "../../../Redux/rootstate/UserState";
import { useSelector,useDispatch } from "react-redux";
import { axiosInstance } from "../../../Api/axiosinstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { setUserInfo } from "../../../Redux/slices/UserSlice";

interface FormInputs {
  name: string;
  phone: string;
}


export interface UserData {
  name: string;
  email: string;
  _id: string;
  isActive: boolean;
  image: string;
  phone: string;
  imageUrl:string
}


const ProfileCard = () => {


  const navigate = useNavigate();
  const dispatch=useDispatch()

  const user= useSelector((state: UserRootState) => state.user.userdata);
  const [previewUrl, setPreviewUrl] = useState<string | null>( user?.image||null);
  const [inputs, setInputs] = useState<FormInputs>({
    name: user?.name || "",
    phone: user?.phone || "",
  });

  const [file, setFile] = useState<File | undefined>(undefined);
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [editMode, setEditMode] = useState(false);



  const handleEditClick = () => {
    setEditMode(true);
};

const handleCancel = () => {
  setEditMode(false );
};

  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif' , 'image/jpg'];
  const checkerror = (file :File )=>{   
    if (!allowedTypes.includes(file?.type)) {
     toast.error("Only JPEG, JPG , PNG, and GIF image formats are allowed.");
     return;
   }
   
  }


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();

    const isFormUpdated = inputs.name !== user?.name || inputs.phone !== user?.phone || file;
   
     if (!isFormUpdated) {
      toast.error("Please make changes before updating.");
      return;
    }

    if (inputs.name.length == 0) {
      setNameError("Name is required");
      return;
    }
    if (!/^[A-Za-z\s]+$/i.test(inputs.name)) {
      setNameError("Enter a valid name");
      return;
    }
    if (inputs?.phone?.length == 0) {
      setPhoneError("Phone is required");
      return;
    }
    if (!/^[0-9]+$/u.test(inputs.phone!)) {
      setPhoneError("Enter a valid Phone");
      return;
    }


    const formData = new FormData();
    formData.append("name", inputs.name);
    formData.append("phone", inputs.phone);


    if (file) {
      formData.append("image", file, file.name);
    }


    if (file && !allowedTypes.includes((file as File).type)) {
      toast.error("Only JPEG, JPG , PNG, and GIF image formats are allowed.");
      return;
    }
 

    axiosInstance
      .put(`/updateProfile?userid=${user?._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },withCredentials: true })
      .then((response) => {
        toast.success("Profile updated successfully...!");
        dispatch(setUserInfo(response.data.data.NewUserData));
        navigate("/profile");
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        console.log("some error here", error);
      });

      setEditMode(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };


  return (
    <>
         
    <Card
      className="w-96 mx-auto"
      placeholder={undefined}
      onPointerEnterCapture={undefined}
      onPointerLeaveCapture={undefined}
    >
      <form onSubmit={handleSubmit}>

        <CardHeader
         
         className="h-50 bg-transparent shadow-none flex items-center justify-center"
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
         
   
          {previewUrl ? (
          
          <div onClick={() => {
            const fileInput = document.getElementById('file-upload');
            if (fileInput) fileInput.click();
          }}>

            <img
              src={previewUrl}
              alt="Selected Profile"
              className="h-40 w-40 rounded-full"
            />
             </div>
          ):user?.imageUrl?(
            <div onClick={() => {
              const fileInput = document.getElementById('file-upload');
              if (fileInput) fileInput.click();
            }}>
              <img
                src={user?.imageUrl}
                alt="Selected Profile"
                className="h-40 w-40 rounded-full cursor-pointer"
              />
            </div>
          ) : (
            <label
              htmlFor="file-upload"
              className="cursor-pointer h-40 w-40 flex items-center justify-center inline-block text-white font-bold py-2 px-4 rounded transition-colors duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-40 w-40 text-gray-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
            </label>
          )}  
          <input
            id="file-upload"
            type="file"
            className="hidden"
            name="image"
           
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                
                const file = e.target.files[0];
                setFile(file);
                checkerror(file)
                setPreviewUrl(URL.createObjectURL(file));
                
              }
            }}
          />
        </CardHeader>



        <CardBody
        className="text-center flex flex-col gap-4"
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
         
          {user?.email && (
            <Input
              label="Email"
              disabled
              size="md"
              value={user.email}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              crossOrigin={undefined}
            />
          )}

          <Input
            label="Name"
            size="md"
            name="name"
            value={inputs.name}
            onChange={handleInputChange}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            crossOrigin={undefined}
          />

          {nameError ? (
            <p className="text-red-500 text-sm -m-2">{nameError}</p>
          ) : (
            ""
          )}

          <Input
            label="Phone"
            size="md"
            name="phone"
            value={inputs.phone}
            onChange={handleInputChange}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            crossOrigin={undefined}
          />

          {phoneError ? (
            <p className="text-red-500 text-sm -m-2">{phoneError}</p>
          ) : (
            ""
          )}


                   { !editMode && 
                    
                    <Button
                    onClick={handleEditClick}
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  style={{background:"#002D62"}}
                    >
                      Edit
                    </Button>
                   
                   }

                      {editMode && (
                        <>
                            <Button
                                variant="gradient"
                                fullWidth
                                type="submit"
                                placeholder={undefined}
                                onPointerEnterCapture={undefined}
                                onPointerLeaveCapture={undefined}
                                style={{background:"green"}}
                            >
                                Update
                            </Button>

                            <Button
                                variant="gradient"
                                fullWidth
                                onClick={handleCancel}
                                placeholder={undefined}
                                onPointerEnterCapture={undefined}
                                onPointerLeaveCapture={undefined}
                                style={{background:"red"}}
                            >
                                Cancel
                            </Button>

                        </>
                           
                        )}
        </CardBody>
      </form>
    </Card>
    
    </>
    
  );
};

export default ProfileCard;