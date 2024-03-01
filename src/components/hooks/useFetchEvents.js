import axios from "axios";
import {onMounted, ref} from "vue";

export function useFetchEvents(){
    const events = ref([])
    const fetch = async () =>{
        try{
            const res = await axios.get(`${process.env.VUE_APP_API_URL}/api/events`)
            events.value = res.data
        }
        catch (e){
            alert('Ошибка')
        }
    }
    onMounted(fetch)
    return {events}
}