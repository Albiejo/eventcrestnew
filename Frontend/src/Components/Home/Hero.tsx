import { Typography } from "@material-tailwind/react";

const Hero = () => {

  return (
    <>
       <header  style={{ marginBottom: 8 }}>
<div className="relative flex h-screen content-center items-center justify-center pt-16 pb-32 m-0">
        <div className="absolute top-0 h-full w-full bg-[url('/imgs/ambience.jpg')] bg-cover bg-center" />
        <div className="absolute top-0 h-full w-full bg-black/60 bg-cover bg-center" />
        <div className="max-w-8xl container relative mx-auto">
          <div className="flex flex-wrap items-center">
            <div className="ml-auto mr-auto w-full px-4 text-center lg:w-8/12">
               <Typography
                variant="h1"
                color="white"
                className="mb-6 font-black text-4xl lg:text-5xl" 
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
               Design Your Dream Event Where Memories Begin
              </Typography>
              <Typography
                variant="lead"
                color="white"
                className="opacity-80 text-sm lg:text-2xl"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Every event is a story waiting to be told. Let’s craft an experience you'll cherish forever.
              </Typography>
            </div>
          </div>
        </div>
      </div>


      </header>
    </>
  );
};

export default Hero;
