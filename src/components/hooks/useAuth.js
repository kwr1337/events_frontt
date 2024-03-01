import {ref} from "vue";
import axios from "axios";
export async function useAuth(init ={}){
    const jwt = ref('')
    try{
        const res = await axios.post(`${process.env.VUE_APP_API_URL}/api/login`,{
            login: init.login.value,
            password: init.password.value
        })
        jwt.value = res.data
    }
    catch (e){
        alert('Неверный логин или пароль')
        localStorage.setItem('token', '')
    }
    return {jwt}
}