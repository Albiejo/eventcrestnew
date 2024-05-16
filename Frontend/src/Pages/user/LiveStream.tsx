import {
    Card,
    CardBody,
    CardFooter,
    Typography,
    Button,
    Input,
  } from '@material-tailwind/react';
  import { useState } from 'react';
  import { useNavigate } from 'react-router-dom';
  import { useSnackbar } from 'notistack';


  const LiveStreaming = () => {


    const [roomId, setRoomId] = useState('');
    const navigate=useNavigate()
    const role_str="Host"
    const { enqueueSnackbar , closeSnackbar } = useSnackbar();
    const handleJoin=()=>{
      if (roomId.trim() === '') {
        enqueueSnackbar('Pleas enter a room id !', { variant: 'error' , action :(key) => (
          <button onClick={() => closeSnackbar(key)}>Close</button> )});
      } else {
       
        navigate(`/room/${roomId}/${role_str}`);
      }
     
    }
  
    return (
      <div  style={{ backgroundImage: 'url(/imgs/livestreambg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' , height:'100vh' }}>
        <div className="flex pt-50 h-full justify-center items-center">
          <Card
            className="mt-28 w-96 border-2 border-blue-900"
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
                variant="h5"
                color="blue-gray"
                className="mb-2"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Enter Your Room Id
              </Typography>
              <Input
                label="Room ID"
                size="lg"
                value={roomId}
                onChange={e=>{setRoomId(e.target.value)}}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
                crossOrigin={undefined}
              />
            </CardBody>
            <CardFooter
              className="pt-0"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <Button
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
                onClick={handleJoin}
              >
                Join
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  };
  
  export default LiveStreaming;