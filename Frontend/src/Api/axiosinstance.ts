import axios from 'axios';


const endpoints = {
    user: import.meta.env.VITE_USERAPI,
    admin: import.meta.env.VITE_ADMINAPI,
    vendor: import.meta.env.VITE_VENDORAPI,
    conversation: import.meta.env.VITE_CHATAPI,
    message: import.meta.env.VITE_MESSAGEAPI
};

const createAxiosInstance = (baseURL:string, tokenKey:string) => {
    const instance = axios.create({ baseURL });

    instance.interceptors.request.use(config => {
        const token = localStorage.getItem(tokenKey);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }, error => Promise.reject(error));

    instance.interceptors.response.use(response => response, async error => {
        if (error.response.status === 401 && error.response.data.message === 'Invalid token') {
            try {
                const refreshToken = localStorage.getItem(`${tokenKey}refreshToken`);
                const response = await instance.post('/refresh-token', { refreshToken });
                const newToken = response.data.token;
                localStorage.setItem(tokenKey, newToken);
                error.config.headers.Authorization = `Bearer ${newToken}`;
                return axios(error.config);
            } catch (refreshError) {
                console.error('Error refreshing token:', refreshError);
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    });

    return instance;
};

// Create axios instances for each API endpoint
export const axiosInstance = createAxiosInstance(endpoints.user, 'userToken');
export const axiosInstanceAdmin = createAxiosInstance(endpoints.admin, 'adminToken');
export const axiosInstanceVendor = createAxiosInstance(endpoints.vendor, 'vendorToken');
export const axiosInstanceChat = createAxiosInstance(endpoints.conversation, 'userToken'); // Assuming conversation API also uses userToken
export const axiosInstanceMsg = createAxiosInstance(endpoints.message, 'userToken'); // Assuming message API also uses userToken
