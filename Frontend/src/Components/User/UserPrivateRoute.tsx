import {Navigate,Outlet} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import UserRootState from '../../Redux/rootstate/UserState';
import { logout } from '../../Redux/slices/UserSlice';

const UserPrivateRoute = () => {

  const dispatch= useDispatch();

  
  const user = useSelector((state : UserRootState) => state.user.isUserSignedIn);
  const userData = useSelector((state:UserRootState)=>state.user.userdata)
  
  const isUserActive = userData?.isActive;

  if (!isUserActive) {
    dispatch(logout());
  }

  return (
    user && isUserActive  ? <Outlet/> :
    ( 
    <Navigate to='/login' replace/>
    )
    
  )
}

export default UserPrivateRoute