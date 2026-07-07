import {useEffect} from 'react'
import { userApi } from '@/api/userApi';
import { setAccessToken } from '@/api/privateClient';
import useAuthStore from '../store/authStore';

const AuthInitializer = ({ children }) => {

  const setUser = useAuthStore(state => state.setUser);
  const logout = useAuthStore(state => state.logout);
  const setLoading = useAuthStore(state => state.setLoading);
  
  useEffect(() => {
    const init = async () => {
      try {
        const user =  await userApi.getMe();

        setUser(user);
      } catch {
        setAccessToken(null);
        logout();
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []); 

  return children
}

export default AuthInitializer
