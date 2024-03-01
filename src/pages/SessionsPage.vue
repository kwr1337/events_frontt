<template>
  <div>
    <NavBar />
    <div class="content">
      <Title>Сеансы</Title>
      <div v-for="item in events" style="margin-bottom: 35px">
        <SessionItem :data="item"/>
      </div>
    </div>

  </div>
</template>

<script>
import NavBar from "@/components/MainPage/NavBar.vue";
import Title from "@/components/UI/Title.vue";
import {useFetchEvents} from "@/components/hooks/useFetchEvents";
import SessionItem from "@/components/Sessions/SessionItem.vue";

export default {
  components: {SessionItem, Title, NavBar},
  setup(){
    const {events} = useFetchEvents()
    return {events}
  }
}
</script>

<style lang="scss" scoped>
.content{
  position: relative;
  top: 180px;
  width: 1300px;
  margin: 0 auto;
}
@media (max-width: 1023px) {
  .content{
    width: 100%;
    padding: 20px;
  }
}
</style>