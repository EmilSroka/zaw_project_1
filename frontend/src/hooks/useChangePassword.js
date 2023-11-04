import axios from 'axios';
import useEnv from './useEnv';
import { useUser } from './useUser';

const useChangePassword = () => {
    const backendUrl = useEnv('BACKEND_URL');
    const { user: { apiKey, username } } = useUser();

    const config = {
      headers: {
        Authorization: apiKey
      }
    };

    const changePassword = async (data) => {
        try {
          await axios.post(`${backendUrl}/change-password`, { username: username, ...data }, config);
        } catch (error) {
          console.error('Password Change Failed:', error.response ? error.response.data : error.message);
          throw error;
        }
      };

    return { changePassword };
}

export { useChangePassword };