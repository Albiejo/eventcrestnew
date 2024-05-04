import { Button } from '@material-tailwind/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';



    interface NotfoundProps{
        role: 'user' | 'admin' | 'vendor';
    }



const NotFound: React.FC<NotfoundProps>= ({role}) => {

    const navigate = useNavigate();

    const handleclick = ()=>{
        if(role === 'user'){
            navigate('/')
        }else if(role === 'admin'){
            navigate('/admin')
        }else{
            navigate('/vendor')
        }
    }


  return (
 
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-bold mb-4">404 Not Found</h2>
      <p className="text-lg text-gray-600">Sorry, the page you are looking for does not exist.</p>
      <Button placeholder={undefined} onClick={handleclick} className="mt-8 bg-blue-900 hover:bg-blue-500 text-white font-bold  px-4 rounded">Go back to Home</Button>
    </div>
  );
};

export default NotFound;
