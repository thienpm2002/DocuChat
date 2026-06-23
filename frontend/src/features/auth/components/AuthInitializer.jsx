import {useEffect} from 'react'
import { authApi } from '@/api/authApi';
import { setAccessToken } from '@/api/privateClient';
import useAuthStore from '../store/authStore';

// const data = {
//   accessToken: 'token',
  
//   user: {
//     id: 1,
//     userName: "John",
//   }
// }

const AuthInitializer = ({children}) => {

  const setUser = useAuthStore(state => state.setUser);
  const logout = useAuthStore(state => state.logout);

  useEffect(() => {
    const init = async () => {
      try {
        const data =  await authApi.refresh();
        
        setAccessToken(data.accessToken);

        setUser(data.user);
      } catch {
        setAccessToken(null);
        logout();
      } 
    };

    init();
  }, []); 

  return children
}

export default AuthInitializer
