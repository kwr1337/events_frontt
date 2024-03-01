import {onMounted, reactive, ref} from "vue";
import axios from "axios";

export function useFetchOneEvent(init = {}){
    const event = reactive({value: {
            id: {}, name: {}, description : {}, description2 : {}, place: {}, date: {}, age_limit: {}, img: {}, ref_video: {}, ref_buy: {}, price: {}, createdAt: {}, updatedAt: {}
        }})
    const fetch = async () =>{
        try{
            const res = await axios.get(`${process.env.VUE_APP_API_URL}/api/events/` + init.id)
            event.value = res.data
            event.value.ref_video = event.value.ref_video.split('=')[1]
        }
        catch (e){
            alert('Ошибка')
        }
    }
    onMounted(fetch)
    return {event}
}