import { useNavigate } from 'react-router-dom';
import './Hero4.css'

const Hero4 = () => {
    const Navigate = useNavigate();
    return (
        <div className="container mx-auto flex flex-col lg:flex-row py-16 lg:py-24 relative">
    <div className="lg:w-1/2 flex justify-center items-center relative">
    
      <img src="/imgs/holi.jpg" alt="Main Image" className="w-full h-auto lg:max-w-full lg:h-auto rounded-lg" />
    
      <button  className="absolute bottom-10 right-10 bg-blue-900 hover:bg-pink-500 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors duration-300" onClick={()=>{Navigate('/vendors')}}>
  Yes ! Book a Vendor now
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
</button>

<svg xmlns="http://www.w3.org/2000/svg" version="1.1" style={{ display: 'block', height: 0, width: 0 }}>
  <defs>
    <filter id="goo">
      <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur"></feGaussianBlur>
      <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo"></feColorMatrix>
      <feBlend in="SourceGraphic" in2="goo"></feBlend>
    </filter>
  </defs>
</svg>

    </div>
    <div className="lg:w-1/2 lg:pl-12">
    <div className="bg-blue-500 p-8 rounded-lg text-white"   style={{ fontFamily: 'playfair display'}} >
  <h2 className="text-2xl lg:text-3xl font-bold mb-4">What do we offer?</h2>
  <ul className="list-disc pl-5">
    <li className="text-lg lg:text-xl mb-2">Birthday parties</li>
    <li className="text-lg lg:text-xl mb-2">Marriage</li>
    <li className="text-lg lg:text-xl mb-2">College Events</li>
    <li className="text-lg lg:text-xl mb-2">Dj parties</li>
    <li className="text-lg lg:text-xl mb-2">Haldi</li>
    <span className="text-lg lg:text-xl mb-2 font-bold ">And many more</span>
  </ul>
</div>

      <div className="mt-8 bg-pink-500 p-8 rounded-lg text-white"   style={{ fontFamily: 'playfair display'}} >
        <h2 className="text-2xl lg:text-3xl font-bold mb-4">Trusted Event Vendors</h2>
        <p className="text-lg lg:text-xl mb-6">We totally understand how crucial your Event is, which is precisely why you’ll only find the most trusted vendors who are verified by our team. Be assured that you’ll have the best vendor in your budget, thanks to our natively built machine-learning-based vendor matching algorithm which perfectly matches your requirements, dates & budget to that of thousands of vendors and choose the best options for you!</p>
      </div>
    </div>
        </div>
      );
};

export default Hero4;
