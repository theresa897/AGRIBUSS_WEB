

import axios from 'axios'
import store from '../redux/store';
import { getAuthToken } from '../redux/feature/userSlice';

const axiosInstance = axios.create({
  baseURL: process.env.NODE_APP_BASE_URL+'/api',
  // baseURL:'http://127.0.0.1:4000/api',
  
});


axiosInstance.interceptors.request.use(
  (config) => {
    store.dispatch(getAuthToken())
    const state = store.getState();
    const token = state.user.token;
    
    const auth = token ? `Bearer ${token}` : '';
    config.headers['Authorization'] = auth;
    return config;
  },
  (error) => Promise.reject(error),
);

export default axiosInstance;
