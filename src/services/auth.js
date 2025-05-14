import axios from 'axios';

export const authService = {
    async login(username, password) {
        try {
            console.log('Отправка запроса на авторизацию...');
            const response = await axios.post(`${process.env.VUE_APP_API_URL}/api/login`, { 
                login: username,
                password: password 
            });
            console.log('Ответ от сервера:', response.data);
            
            // Токен может прийти как строка напрямую или как объект с полем token
            const token = typeof response.data === 'string' ? response.data : response.data.token;
            
            console.log('Полученный токен:', token);
            if (token) {
                localStorage.setItem('token', token);
                console.log('Токен сохранен в localStorage');
            } else {
                console.warn('Токен отсутствует в ответе сервера');
            }
            return token;
        } catch (error) {
            console.error('Ошибка авторизации:', error);
            console.error('Детали ошибки:', error.response?.data);
            throw error;
        }
    },

    logout() {
        localStorage.removeItem('token');
        console.log('Токен удален из localStorage');
    },

    getToken() {
        const token = localStorage.getItem('token');
        console.log('Получен токен из localStorage:', token);
        return token;
    },

    isAuthenticated() {
        const isAuth = !!this.getToken();
        console.log('Проверка авторизации:', isAuth);
        return isAuth;
    }
}; 