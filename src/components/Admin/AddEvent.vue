<template>
  <Title style="margin-top: 30px">Добавление</Title>
  <div class="content">
    <div class="mb-3">
      <h3 class="form-label">Название</h3>
      <input v-model="form.name.value" class="form-control" placeholder="Программирование">
    </div>
    <div class="mb-3">
      <h3 class="form-label">Описание</h3>
      <textarea v-model="form.des.value" class="form-control" rows="3"></textarea>
    </div>
    <div class="mb-3">
      <h3 class="form-label">Описание №2</h3>
      <textarea v-model="form.des2.value" class="form-control" rows="3"></textarea>
    </div>
    <div class="mb-3">
      <h3 class="form-label">Ссылка на видео</h3>
      <input v-model="form.ref_video.value" class="form-control" placeholder="https://www.youtube.com/watch?v=7PIji8OubXU">
    </div>
    <div class="mb-3">
      <h3 class="form-label">Ссылка на покупку</h3>
      <input v-model="form.ref_buy.value" class="form-control" placeholder="https://www.youtube.com/watch?v=7PIji8OubXU">
    </div>
    <div class="mb-3">
      <h3 class="form-label">Цена</h3>
      <input v-model="form.price.value" class="form-control" placeholder="Необязательно">
    </div>
    <div class="mb-3">
      <h3 class="form-label">Место проведения</h3>
      <input v-model="form.place.value" class="form-control" placeholder="г.Казань, ул.Большая красная">
    </div>
    <div class="mb-3">
      <h3 class="form-label">Возрастное ограничение</h3>
      <input v-model="form.age_limit.value" class="form-control" placeholder="+6">
    </div>
    <div class="mb-3">
      <h3 class="form-label">Дата</h3>
      <input v-model="form.date.value" class="form-control" type="text" placeholder="21.02.2023">
    </div>
    <div class="mb-3">
      <h3 class="form-label">Изображение</h3>
      <input @change="updateFile" class="form-control" type="file">
    </div>
    <div class="mb-3 row-cols-1">
    <button type="button" class="btn btn-secondary btn-lg" @click="submit">Добавить</button>
    </div>
  </div>
</template>

<script>
import Title from "@/components/UI/Title.vue";
import {ref} from "vue";
import {useAddEvent} from "@/components/hooks/useAddEvent";

export default {
  components: {Title},
  setup(){
    const file = ref(null)
    const form = {
      name: {
        value: ''
      },
      des: {
        value: ''
      },
      des2: {
        value: ''
      },
      ref_video: {
        value: ''
      },
      ref_buy: {
        value: ''
      },
      price: {
        value: ''
      },
      place: {
        value: ''
      },
      age_limit: {
        value: ''
      },
      date: {
        value: ''
      },
      token: {
        value: localStorage.getItem('token')
      }
    }
    function updateFile(event){
      file.value = event.target.files[0]
    }
    const submit = async ()=>{
      await useAddEvent(form, file.value)
    }
    return{form, updateFile, submit}
  }
}
</script>

<style lang="scss" scoped>
.content{
  max-width: 1000px;
  margin: 0 auto;
  height: 100%;
}
div{
  color: #fff;
  border: solid #495057 1px;
  border-radius: 20px;
  padding: 20px;
}
</style>