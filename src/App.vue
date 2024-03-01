<template>
  <div class="app">
    <router-view></router-view>
  </div>

</template>

<script>


import MainPage from "@/pages/MainPage.vue";
import NavBar from "@/components/MainPage/NavBar.vue";

export default {
  name: 'App',

}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
@font-face {
  font-family: El Messiri;
  src: url('~@/assets/fonts/ElMessiri.ttf');
}
@font-face {
  font-family: Proxima Nova;
  src: url('~@/assets/fonts/proximanova_regular.ttf');
}
.app{
  font-family: Proxima Nova,serif;
  font-weight: 700;
}
</style>
