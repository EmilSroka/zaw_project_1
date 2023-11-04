import axios from 'axios';
import useEnv from './useEnv';
import { useUser } from './useUser';

const useLogin = () => {
    const backendUrl = useEnv('BACKEND_URL');
    const { loginUser } = useUser();

    const login = async (data) => {
        try {
          const response = await axios.post(`${backendUrl}/login`, data);
          loginUser(response.data.token, data.username);
        } catch (error) {
          console.error('Login Failed:', error.response ? error.response.data : error.message);
          throw error;
        }
    };

    return { login };
}

export { useLogin };