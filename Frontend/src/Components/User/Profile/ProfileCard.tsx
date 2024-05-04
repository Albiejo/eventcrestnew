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

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [inputs, setInputs] = useState<FormInputs>({
    name: user?.name || "",
    phone: user?.phone || "",
  });

  const [file, setFile] = useState<File | undefined>(undefined);



  const checkerror = (file :File )=>{

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif' , 'image/jpg'];
    if (!allowedTypes.includes(file?.type)) {
     toast.error("Only JPEG, JPG , PNG, and GIF image formats are allowed.");
     return;
   }
   
  }


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", inputs.name);
    formData.append("phone", inputs.phone);


    if (file) {
      formData.append("image", file, file.name);
    }


    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif' , 'image/jpg'];

    if (!allowedTypes.includes((file as File).type)) {
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
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };



  
  return (
    <>
    <div className="flex justify-center">
    <Card
    className="w-full md:w-96  lg:mt-20 md:mt-0 md:ml-4 border-4 border-gray-700 mr-40"
      placeholder={undefined}
      onPointerEnterCapture={undefined}
      onPointerLeaveCapture={undefined}
    >
      <form onSubmit={handleSubmit}>

        <CardHeader
          floated={false}
          className="h-50 bg-transparent shadow-none flex items-center justify-center"
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Selected Profile"
              className="h-40 w-40 rounded-full"
            />
          ) : (
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex items-center justify-center inline-block text-white font-bold py-2 px-4 rounded transition-colors duration-200"
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
          <Button
            variant="gradient"
            fullWidth
            type="submit"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            Update
          </Button>
        </CardBody>
      </form>
    </Card>
    </div>
    </>
    
  );
};

export default ProfileCard;