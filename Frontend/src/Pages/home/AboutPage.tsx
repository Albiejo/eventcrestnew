import { Link } from 'react-router-dom';
import Footer from '../../Components/Home/Footer';
import { Button } from '@material-tailwind/react';






const AboutPage = () => {
  
  
  
  
  return (
        <>
        <div className=" text-white pt-2"  style={{ fontFamily: 'Arial, sans-serif' }}>
          <div className="max-w-8xl ">
            <div className="text-center relative ">
              <img src="/imgs/sea.jpg" alt="Event Crest Banner" className="w-full h-96 object-cover rounded-lg" />
              <div className="absolute inset-0 flex flex-col justify-center items-center">
                <img src="/imgs/log.jpeg" alt="Event Crest Logo" className="w-64 mx-auto" />
              </div>
            </div>

            <div className="text-center relative ">
              <div className="w-full h-60 object-cover rounded-lg ">
                <h2 className="text-3xl font-bold text-black justify-center font-bold pt-16">We are Event Crest</h2>
                <p className="mt-2 text-lg   text-black font-bold" >Bringing dream Events to life!</p>
              </div>   
              <h2 className="mt-2 text-3xl text-black font-bold" >About us</h2>          
            </div>

            <div className="text-center mt-10">
                <div className="max-w-3xl mx-auto">
                
                  <p className="text-lg  text-gray-700  mb-4"> Event Crest is an Indian online event planning platform and event media publisher, enabling people to plan their events conveniently and cost-effectively.</p>
                  
               
                  <p className="text-lg mb-4 text-gray-700 ">  We're a driven team of event enthusiasts working to build a new way of event planning through delightful products and amazing customer service. We're proud to have been the official event planner of celebrities like Yuvraj Singh & Bhuvneshwar Kumar. We love what we do, and that's how we help plan your event like a loved one!</p>
                
                
                  <p className="text-lg mb-4 text-gray-700 ">  Event Crest is on a mission to make event planning in India exciting and hassle-free. With a millennial army of event fanatics, Event Crest aims to aid the event blues of every new-age couple across the country.</p>
                </div>
            </div>

            <div className="text-center mt-16">
                <div className="max-w-3xl mx-auto">
                  <h3 className="text-2xl text-black font-bold mb-4">What do we offer?</h3>
                  <p className="text-lg  text-gray-700  mb-4">Event offers an end-to-end wedding planning solution for couples to ideate & realize their dream wedding conveniently & reliably. Event is the only wedding planning startup in India that offers assisted wedding planning through personal wedding manager for all your needs of booking the perfect service provider. Event is also an encyclopedia of latest trends, expert opinions and practical advice on wedding planning - from choosing wedding theme, best lehenga designs, mehndi designs, sangeet ideas, photo poses, etc.
</p>
                  
                  <h3 className="text-2xl font-bold mt-8 mb-4 text-black ">Trusted Wedding Vendors</h3>
                  <p className="text-lg mb-4 text-gray-700 ">We totally understand how crucial your wedding is, which is precisely why you’ll only find the most trusted vendors who are verified by our team. Be assured that you’ll have the best vendor in your budget, thanks to our natively built machine-learning based vendor matching algorithm which perfectly matches your requirements, dates & budget to that of thousands of vendors and choose the best options for you!</p>
                  <Link to='/vendors'>
                  <Button className='lg:w-60 lg:h-14 rounded-full py-2 px-4 text-white font-bold bg-pink-500'  placeholder={undefined}>Hire a Vendor</Button>
                  </Link>
                </div>
            </div>

            <div className="mt-16 text-center mb-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="bg-gray-500 py-8 rounded-lg hover:shadow-2xl hover:border-red-500 transition duration-300 ease-in-out transform">
                  <p className="text-4xl font-bold  text-black">6000+</p>
                  <p className="mt-2 text-lg  text-black">Wedding Vendors</p>
                </div>
                <div className="bg-gray-500 py-8 rounded-lg hover:shadow-2xl hover:border-red-500 transition duration-300 ease-in-out transform">
                  <p className="text-4xl font-bold  text-black">500+</p>
                  <p className="mt-2 text-lg  text-black">Birthday Vendors</p>
                </div>
                <div className="bg-gray-500 py-8 rounded-lg hover:shadow-2xl hover:border-red-500 transition duration-300 ease-in-out transform">
                  <p className="text-4xl font-bold  text-black">20M+</p>
                  <p className="mt-2 text-lg  text-black">Monthly Reach</p>
                </div>
                <div className="bg-gray-500 py-8 rounded-lg hover:shadow-2xl hover:border-red-500 transition duration-300 ease-in-out transform">
                  <p className="text-4xl font-bold  text-black">10,000+</p>
                  <p className="mt-2 text-lg  text-black">Annual Events</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer/>
        </>
      );
    };

export default AboutPage;
