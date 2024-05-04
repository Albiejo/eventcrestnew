import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
  Card,
  CardBody,
} from '@material-tailwind/react';
import { axiosInstance } from '../../Api/axiosinstance';
import { Link } from 'react-router-dom';



function Icon({ open }: { open: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={`${open ? 'rotate-180' : ''} h-5 w-5 transition-transform`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
      />
    </svg>
  );
}

interface Live {
  _id: string;
  url: string;
}

const LiveEvents = () => {



  const [live, setLive] = useState<Live[]>([]);
  const [alwaysOpen, setAlwaysOpen] = React.useState(true);
  const handleAlwaysOpen = () => setAlwaysOpen((cur) => !cur);

  useEffect(() => {
    axiosInstance
      .get('/get-live')
      .then((response) => {
        setLive(response.data.data);
      })
      .catch((error) => {
        console.log('here', error);
      });
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        width: '70%',
        margin: 'auto',
      }}
    >
      <Accordion
        open={alwaysOpen}
        icon={alwaysOpen ? <Icon open={true} /> : <Icon open={false} />}
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <AccordionHeader
          style={{ fontFamily: 'playfair', fontSize: '18px' }}
          onClick={handleAlwaysOpen}
          className="text-center text-gray" 
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
       
       Experience the thrill of live events right at your fingertips! Stay tuned for the latest updates and join the excitement by accessing the live stream link here.
       
        </AccordionHeader>

        <AccordionBody>
          {live?.map((data) => {
            return (
              <Card
                className="w-full h-15 shadow-lg"
                key={data._id}
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                <CardBody
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  <Link to={data.url} className="text-blue-300">
                    {data.url}
                  </Link>
                    <span className='ml-28 text-blue-900'> Click the link to join the live stream</span>
                </CardBody>
              
                <svg className="absolute top-7 right-8" width="20" height="20">
                  <circle cx="15" cy="5" r="5" fill="red" />
                </svg>
              
              </Card>
            );
          })}
        </AccordionBody>
      </Accordion>
    </div>
  );
};

export default LiveEvents;