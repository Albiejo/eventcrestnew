import { Carousel } from "@material-tailwind/react";


const Hero2 = () => {
  return (
    <div className="mt-8">
       <h2   style={{ fontFamily: 'playfair display'}}  className="text-3xl font-normal text-center mb-8">Latest  <span className="font-bold" style={{color:"#7393B3"}} >Awesome Events</span></h2>
      <Carousel className="rounded-xl overflow-hidden mb-10"  placeholder={undefined}>
        <div className="flex px-10">
          <div className="w-1/3 flex-none pr-5">
            <img
              src="../../../public/imgs/dj1.jpg"
              alt="image 1"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="w-1/3 flex-none pr-5">
            <img
             src="../../../public/imgs/dj.jpg" alt="image 2"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="w-1/3 flex-none">
            <img
            src="../../../public/imgs/dj2.jpg"
              alt="image 3"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
        <div className="flex px-10">
          <div className="w-1/3 flex-none pr-5">
            <img
              src="../../../public/imgs/dj.jpg"
              alt="image 1"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="w-1/3 flex-none pr-5">
            <img
             src="../../../public/imgs/dj1.jpg" alt="image 2"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="w-1/3 flex-none">
            <img
            src="../../../public/imgs/dj2.jpg"
              alt="image 3"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </Carousel>
      </div>
  );
}

export default Hero2

