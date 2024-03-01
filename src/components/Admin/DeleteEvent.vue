<template>
  <div class="w">
  <Title style="margin-top: 30px">Удаление</Title>
<div class="view">
  <div v-for="(item, index) in events" class="card" style="width: 18rem;" :key="item.id">
    <img :src="imageUrl(item.img)" class="card-img-top" alt="...">
    <div class="card-body">
      <h5 class="card-title">{{item.name}}</h5>
      <p class="card-text" style="white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; height: 20px" >{{item.description}}</p>
      <button type="button" class="btn btn-danger" @click="deleteEvent(item.id, index)">Удалить
      </button>
    </div>
  </div>
</div>
  </div>
</template>

<script>
import Title from "@/components/UI/Title.vue";
import {useFetchEvents} from "@/components/hooks/useFetchEvents";
import {useDeleteEvent} from "@/components/hooks/useDeleteEvent";

export default {
  components: {Title},
  setup(){
    const {events} = useFetchEvents()
    function imageUrl(value) {
      return new URL(`${process.env.VUE_APP_API_URL}/${value}`, import.meta.url).href
    }
    async function deleteEvent(id, index){
      if(localStorage.getItem('token')) {
        events.value.splice(index, 1);
        await useDeleteEvent({id: {value: id}, token: {value: localStorage.getItem('token')}})
      }
    }
    return {events,imageUrl, deleteEvent}
  }
}
</script>

<style lang="scss" scoped>
.card{
  margin: 10px;
}
.view{
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
.w{
  height: 100vh;
}
</style>