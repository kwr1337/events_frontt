<template>
  <div class="wrapper">
    <div class="collapse" id="navbarToggleExternalContent" data-bs-theme="dark">
      <div class="bg-dark p-4">
        <h2 class="text-body-emphasis h2">Меню</h2>
        <router-link :to="{name: 'add'}" class="link"><h3 class="text-body-secondary">Добавить сессию</h3></router-link>
        <router-link :to="{name: 'delete'}" class="link"><h3 class="text-body-secondary">Удалить сессию</h3></router-link>
        <router-link :to="{name: 'main'}" class="link"><h3 class="text-body-secondary">Вернуться на сайт</h3></router-link>
      </div>
    </div>
    <nav class="navbar navbar-dark bg-dark">
      <div class="container-fluid">
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarToggleExternalContent" aria-controls="navbarToggleExternalContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
      </div>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script>
import {onMounted} from "vue";
import router from "@/router";

export default {
setup(){
  onMounted(()=>{
    if(!localStorage.getItem('token')) {
      router.push({name: 'admin'})
    }
  })
}
}
</script>

<style lang="scss" scoped>
.wrapper{
  background-color: #212529;
}
.link{
  text-decoration: none;
}
</style>