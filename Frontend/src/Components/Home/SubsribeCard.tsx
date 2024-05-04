import { Button, Input, Typography } from '@material-tailwind/react'
import React, { useState } from 'react'
import { axiosInstance } from '../../Api/axiosinstance';
import { toast } from 'react-toastify';







const SubsribeCard: React.FC = () => {


  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/subscribe', { email } , {withCredentials:true})
      .then((res) => {
         console.log(res.data);
         toast.success("successfully subscribed to eventcrest.")
         setSubscribed(true);
      }).catch((err) => {
        setError("Please try again later.");
        console.log(err.message);
      });    
  }catch (error) {
    console.error('Subscription error:', error);
    toast.warning('Failed to subscribe. Please try again later.');
  }
}



  return (
    <div className="pb-5 p-10">
      <div className="container items-center justify-center">
        <div className="relative flex w-full py-10 mb-5 md:mb-20 max-w-4xl mx-auto rounded-2xl p-5 bg-gray-900 bg-cover bg-center">
          <div className="absolute inset-0 bg-black opacity-30 rounded-2xl"></div>
          <div className="relative z-10 flex flex-col items-center justify-center text-center text-white w-full">
            <Typography className="text-xl md:text-2xl font-bold mb-3" color="white"  placeholder={undefined}>
              Join our community!
            </Typography>
            <Typography className="md:w-9/12 text-base" color="white"  placeholder={undefined}>
              Get news in your inbox every week! We hate spam too, so no worries about this.
            </Typography>
            <form onSubmit={handleSubmit} className="mt-8 flex flex-col items-center justify-center gap-4 md:flex-row">
              <div className="w-full md:w-auto">
                <Input
                  label="Email"
                  color="white"
                  crossOrigin={undefined}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button size="md" className="w-full md:w-auto lg:w-32" fullWidth color="white" type="submit"  placeholder={undefined}>
                Subscribe
              </Button>
            </form>
            {error && <Typography className="text-red-500"  placeholder={undefined}>{error}</Typography>}
            {subscribed && <Typography className="text-green-500"  placeholder={undefined}>Subscribed successfully!</Typography>}
          </div>
        </div>
      </div>
    </div>
  );
}


export default SubsribeCard