

const Hero6 = () => {
  return (
    <div>

    <section className="mt-12 md:mt-20">
        <div className="flex flex-wrap items-start justify-center w-full h-80 bg-[url('/imgs/ambience.jpg')] bg-cover bg-center md:px-5">
         
        </div>
      </section>


         <section className="-mt-20 mb-20 mx-4 md:mx-30 md:-mt-40">
        <div className="flex flex-col items-center justify-center bg-white shadow-lg rounded-2xl">
          <h1
            style={{ fontFamily: "playfair display", fontSize: "30px" }}
            className="mt-10 text-center sm:p-4"
          >
            ABOUT &nbsp;OUR &nbsp;PLANNING &nbsp;PROCESS
          </h1>
          <div className="flex flex-wrap justify-center m-10 gap-8">
            <div className="w-full md:w-1/4">
              <h2
                style={{ fontFamily: "playfair display", fontSize: "20px" }}
                className="text-center mb-4 text-brown"
              >
                Find
              </h2>
              <p style={{ fontSize: "14px" }}>
                Discover a variety of vendors tailored to your event needs, with
                options ranging from photographers to decorators. Filter your
                search based on criteria like location, budget, and service type
              </p>
            </div>
            <div className="w-full md:w-1/4">
              <h2
                style={{ fontFamily: "playfair display", fontSize: "20px" }}
                className="text-center mb-4 text-brown"
              >
                Connect
              </h2>
              <p style={{ fontSize: "14px" }}>
                Initiate communication with selected vendors through the
                platform. Send messages, inquire about availability, and discuss
                details such as pricing and services offered.
              </p>
            </div>
            <div className="w-full md:w-1/4">
              <h2
                style={{ fontFamily: "playfair display", fontSize: "20px" }}
                className="text-center mb-4 text-brown"
              >
                Plan
              </h2>
              <p style={{ fontSize: "14px" }}>
                Streamline your event planning process by managing vendor
                bookings, organizing timelines, and tracking budgets. Access
                tools and resources to stay on track and create memorable events
                with ease.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Hero6