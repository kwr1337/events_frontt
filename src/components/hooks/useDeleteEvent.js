import axios from "axios";

export async function useDeleteEvent(init = {}){
    try {
        console.log(init.token.value, init.id.value)
        const res = await axios.delete(`${process.env.VUE_APP_API_URL}/api/events/${init.id.value}`,
            {
                headers: {
                    'Authorization' : `Bearer ${init.token.value}`
                }
            }
            )
        alert(res.data.message)
    }
    catch (e){
        alert('Ошибка')
    }
}