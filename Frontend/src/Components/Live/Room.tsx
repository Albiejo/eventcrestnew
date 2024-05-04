/* eslint-disable react-hooks/rules-of-hooks */
import { useParams } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { axiosInstance } from '../../Api/axiosinstance';


function randomID(len: number) {
  let result = '';
  if (result) return result;
  const chars =
      '12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP',
    maxPos = chars.length;
  let i;
  len = len || 5;
  for (i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return result;
}


const Room = () => {

  const { roomId,role_str} = useParams();
  const role =
    role_str === 'Host'
      ? ZegoUIKitPrebuilt.Host
      : role_str === 'Cohost'
        ? ZegoUIKitPrebuilt.Cohost
        : ZegoUIKitPrebuilt.Audience;

  const sharedLinks: { name: string; url: string; }[] = [];
  if (role === ZegoUIKitPrebuilt.Host || role === ZegoUIKitPrebuilt.Cohost) {
    sharedLinks.push({
      name: 'Join as co-host',
      url:`http://localhost:5000/room/${roomId}/Cohost`
    });
  }

  sharedLinks.push({
    name: 'Join as audience',
    url:`http://localhost:5000/room/${roomId}/Audience`
  });


  const handleLiveStart = (url: string) => {
    axiosInstance
      .post('/add-live', { url }, { withCredentials: true })
      .then((response) => {
        console.log(response.data.live);
      })
      .catch((error) => {
        console.log('here', error);
      });
  };


  
const handleLiveEnd = () => {
    axiosInstance
      .patch(
        `/change-live-status`,
        { url:`http://localhost:5000/room/${roomId}/Audience`},
        { withCredentials: true },
      )
      .then((response) => {
        console.log(response.data.live);
      })
      .catch((error) => {
        console.log('here', error);
      });
};



  const myMeeting = async (element: any) => {
    // generate Kit Token
    const appID = 1638761076;
    const serverSecret = '84efbbf99dc00c21f97dbd54fa31be00';
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomId!,
      randomID(5),
      randomID(5),
    );

    const zp = ZegoUIKitPrebuilt.create(kitToken);

    zp.joinRoom({
        container: element,
        onLiveStart: () => {
          handleLiveStart(`http://localhost:5000/room/${roomId}/Audience`);
        },
        onLiveEnd: () => {
          handleLiveEnd();
        },
        scenario: {
          mode: ZegoUIKitPrebuilt.LiveStreaming,
          config: {
            role,
          },
        },
        sharedLinks:sharedLinks,
        
    });
   
  };

  

  
  return (
    <div style={{ width: '100vw', height: '100vh', paddingTop: 50 }}>
    
    
        <div ref={myMeeting}></div>

  
    </div>
  );
};

export default Room;

