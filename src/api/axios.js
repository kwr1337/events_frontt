import axios from 'axios';
import { authService } from '@/services/auth';

const api = axios.create({
    baseURL: process.env.VUE_APP_API_URL
});

// Добавляем перехватчик для добавления токена к запросам
api.interceptors.request.use(
    (config) => {
        // Добавляем токен для методов изменения данных (POST, PUT, DELETE)
        // или для запросов в админку
        if (
            ['POST', 'PUT', 'DELETE'].includes(config.method.toUpperCase()) ||
            config.url.includes('/admin/')
        ) {
            const token = authService.getToken();
            console.log('Текущий метод:', config.method);
            console.log('URL запроса:', config.url);
            console.log('Токен:', token);
            
            if (token) {
                // Проверяем, начинается ли токен с Bearer
                const tokenValue = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
                config.headers['Authorization'] = tokenValue;
            } else {
                console.warn('Токен отсутствует!');
            }
        }
        
        // Удаляем автоматическую установку Content-Type
        // Позволяем браузеру самостоятельно установить правильный заголовок для FormData
        
        console.log('Заголовки запроса:', config.headers);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Добавляем перехватчик для обработки ответов
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Обрабатываем 401 ошибку для защищенных маршрутов
        if (error.response?.status === 401 && (
            ['POST', 'PUT', 'DELETE'].includes(error.config.method.toUpperCase()) ||
            error.config.url.includes('/admin/')
        )) {
            authService.logout();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api; 