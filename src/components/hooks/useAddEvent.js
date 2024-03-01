import axios from "axios";
import {ref} from "vue";

export async function useAddEvent(init = {}, file){
    try{
        const formDate = new FormData()
        formDate.append('name', init.name.value)
        formDate.append('description', init.des.value)
        formDate.append('description2', init.des2.value)
        formDate.append('ref_video', init.ref_video.value)
        formDate.append('ref_buy', init.ref_buy.value)
        formDate.append('price', init.price.value)
        formDate.append('place', init.place.value)
        formDate.append('age_limit', init.age_limit.value)
        formDate.append('date', init.date.value)
        formDate.append('img', file)
        const res = await axios.post(`${process.env.VUE_APP_API_URL}/api/events`,
            formDate, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization' : `Bearer ${init.token.value}`
                }
            })
        alert(res.data.message)
    }
    catch (e) {
        alert('Заполните все поля')
    }
}