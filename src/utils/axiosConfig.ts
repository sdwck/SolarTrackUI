import axios from 'axios';
import authService from '../services/authService';
import { type ApiError } from '../types';
import { type AxiosResponse } from 'axios';
import { BASE_URL } from '../constants/apiUrl';

axios.defaults.baseURL = BASE_URL;
axios.defaults.timeout = 10000;
axios.defaults.headers['Content-Type'] = 'application/json';
axios.defaults.headers['Accept'] = 'application/json';

axios.interceptors.request.use(
    (config) => {
        const token = authService.getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axios.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const newToken = await authService.refreshToken();
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return axios(originalRequest);
            } catch (refreshError) {
                authService.logout();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        const apiError: ApiError = {
            message: error.response?.data?.message || error.message || 'Unknown error',
            status: error.response?.status || 0,
            timestamp: new Date().toISOString()
        };

        console.error('API Error:', apiError);
        return Promise.reject(apiError);
    }
);

export default axios;