
import { Link } from 'react-router-dom';
import Footer from '../../Components/Home/Footer';
import { Button, Typography } from '@material-tailwind/react';
import  {Card , CardBody } from '@material-tailwind/react';





const AboutPage = () => {
  

  return (
        <>
        <div className=" text-white pt-2"  style={{ fontFamily: 'Arial, sans-serif' }}>
          <div className="max-w-8xl ">
            
            <div className="text-center relative ">
              <img src="/imgs/banner6.jpg" alt="Event Crest Banner" className="w-full h-96 object-cover rounded-lg" />
             
            </div>

            <div className="text-center relative ">
              <div className="w-full h-60 object-cover rounded-lg ">
                <h2 className="text-3xl font-bold text-black justify-center font-bold pt-16" style={{ fontFamily: "playfair display", fontSize: "30px" }}>We are Event Crest</h2>
                <p className="mt-2 text-lg   text-black font-bold" >Bringing dream Events to life!</p>
              </div>   
            
              <h2 className="mt-2 text-3xl text-black font-bold" >About us</h2>          
             
            </div>

            <div className="text-center mt-10">
                <div className="max-w-3xl mx-auto px-4 sm:px-10 lg:px-10" style={{ fontFamily: "playfair display", fontSize: "30px" }}>
                    <p className="text-lg text-gray-700 mb-4 sm:text-base md:text-lg lg:text-xl">
                        Event Crest is an Indian online event planning platform and event media publisher, enabling people to plan their events conveniently and cost-effectively.
                    </p>
                    <p className="text-lg mb-4 text-gray-700 sm:text-base md:text-lg lg:text-xl">
                        We're a driven team of event enthusiasts working to build a new way of event planning through delightful products and amazing customer service. We're proud to have been the official event planner of celebrities like Yuvraj Singh & Bhuvneshwar Kumar. We love what we do, and that's how we help plan your event like a loved one!
                    </p>
                    <p className="text-lg mb-4 text-gray-700 sm:text-base md:text-lg lg:text-xl">
                        Event Crest is on a mission to make event planning in India exciting and hassle-free. With a millennial army of event fanatics, Event Crest aims to aid the event blues of every new-age couple across the country.
                    </p>
                </div>
            </div>


            <div className="text-center mt-16">
                <div className="max-w-3xl mx-auto px-4 sm:px-10 lg:px-10">
                  <h3 className="text-2xl text-black font-bold mb-20" style={{ fontFamily: "playfair display", fontSize: "30px" }}>What do we offer?</h3>
                  <p className="text-lg  text-gray-700  mb-20" style={{ fontFamily: "playfair display"}}>Event offers an end-to-end wedding planning solution for couples to ideate & realize their dream wedding conveniently & reliably. Event is the only wedding planning startup in India that offers assisted wedding planning through personal wedding manager for all your needs of booking the perfect service provider. Event is also an encyclopedia of latest trends, expert opinions and practical advice on wedding planning - from choosing wedding theme, best lehenga designs, mehndi designs, sangeet ideas, photo poses, etc.</p>
                  
                  <h3 className="text-2xl font-bold mt-8  text-black mb-20" style={{ fontFamily: "playfair display", fontSize: "30px" }}>Trusted Wedding Vendors</h3>
                  <p className="text-lg mb-4 text-gray-700 " style={{ fontFamily: "playfair display"}}>We totally understand how crucial your wedding is, which is precisely why you’ll only find the most trusted vendors who are verified by our team. Be assured that you’ll have the best vendor in your budget, thanks to our natively built machine-learning based vendor matching algorithm which perfectly matches your requirements, dates & budget to that of thousands of vendors and choose the best options for you!</p>
                  <Link to='/vendors'>
                  <Button className='mt-20 lg:w-60 lg:h-14 rounded-full py-2 px-4 text-white font-bold bg-blue-400'  placeholder={undefined}>Explore Vendors</Button>
                  </Link>
                </div>
            </div>
            





<section className='mb-40'>
  <div className="flex flex-wrap items-start w-full h-full bg-[url('/imgs/banner4.jpg')] bg-cover bg-center mt-40 mb-20">
    {/* This div is centered for smaller screens and remains at the same location for larger screens */}
    <div className="w-full lg:w-8/12 md:w-5/12 px-4 md:px-20 lg:px-20 md:mt-8 lg:mt-0 p-20">
      <div className="flex justify-center">
        {/* Ensure the card is centered on smaller screens */}
        <div className="w-full md:w-auto lg:w-[600px]">
          <Card
            className="shadow-lg border shadow-gray-500/10 rounded-lg mx-auto lg:mx-0"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <CardBody
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Why Event Crest?
              </Typography>
              <Typography
                      variant="h5"
                      color="blue-gray"
                      className="mb-3 mt-2 font-bold"
                      placeholder={undefined}
                      onPointerEnterCapture={undefined}  onPointerLeaveCapture={undefined}              >
                Professional Event Planning
              </Typography>
              <Typography
                className="font-normal text-blue-gray-500"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Experience the convenience of personalized service, tailored to meet your company's unique needs. Our experts handle everything from venue selection to logistics, so you can focus on your business.
              </Typography>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  </div>
</section>


<section className="lg:my-20 mt-10">
        <div className="lg:text-center lg:mb-8 mb-4 ml-20">
          <h2
            className="text-2xl font-bold text-black"
            style={{ fontFamily: "playfair display", fontSize: "30px" }}
          >
            Process
          </h2>
        </div>
        <div className="flex flex-wrap justify-center md:mx-18 mx-10 lg:mx-0">
          <div className="w-full md:w-1/2 lg:w-1/4 p-4 cursor-pointer">
            <div className="rounded-lg shadow-md p-6 flex items-center bg-[#ADD8E6] transform transition-transform duration-300 hover:scale-105">
              <div className="bg-[#4BAAC8] rounded-full h-12 w-16 flex items-center justify-center mr-4">
                <i className="fa-solid fa-magnifying-glass"></i>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Find
                </h3>
                <p className="text-gray-600">
                  Find vendors for your event needs
                </p>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 lg:w-1/4 p-4 cursor-pointer">
            <div className="bg-[#ADD8E6] rounded-lg shadow-md p-6 flex items-center transform transition-transform duration-300 hover:scale-105">
              <div className="bg-[#4BAAC8] rounded-full h-12 w-18 flex items-center justify-center mr-4">
                <i className="fa-solid fa-handshake-simple"></i>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Connect
                </h3>
                <p className="text-gray-600">
                  Contact vendors through the platform
                </p>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 lg:w-1/4 p-4 cursor-pointer">
            <div className="bg-[#ADD8E6] rounded-lg shadow-md p-6 flex items-center transform transition-transform duration-300 hover:scale-105">
              <div className="bg-[#4BAAC8] rounded-full h-12 w-14 flex items-center justify-center mr-4">
                <i className="fa-solid fa-pen-to-square"></i>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Plan
                </h3>
                <p className="text-gray-600">Simplify your event planning with us</p>
              </div>
            </div>
          </div>
        </div>
</section>


          </div>
        </div>

        <div className='mt-40'>
        <Footer/>
        </div>
        </>
      );
    };

export default AboutPage;
