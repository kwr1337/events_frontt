<template>
  <div>
    <NavBar />
    <div class="content">
      <div class="header-content">
        <MyButton @click="$router.go(-1)" class="back-btn">
          <span class="back-icon">←</span> Назад
        </MyButton>
        <Title>Сеансы</Title>
      </div>
      <div v-for="item in events" style="margin-bottom: 35px">
        <SessionItem :data="item"/>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from "@/components/MainPage/NavBar.vue";
import Title from "@/components/UI/Title.vue";
import MyButton from "@/components/UI/MyButton.vue";
import {useFetchEvents} from "@/components/hooks/useFetchEvents";
import SessionItem from "@/components/Sessions/SessionItem.vue";

export default {
  components: {
    SessionItem,
    Title,
    NavBar,
    MyButton
  },
  setup(){
    const {events} = useFetchEvents()
    return {events}
  }
}
</script>

<style lang="scss" scoped>
.content {
  position: relative;
  top: 180px;
  width: 1300px;
  margin: 0 auto;
}

.header-content {
  position: relative;
  text-align: center;
  margin-bottom: 30px;
}

.back-btn {
  position: absolute !important;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  display: flex !important;
  align-items: center;
  gap: 8px;
  padding: 10px 20px !important;
  background: transparent !important;
  border: 1px solid #018ABE !important;
  color: #018ABE !important;
  transition: all 0.3s ease;

  &:hover {
    background: #018ABE !important;
    color: #fff !important;
  }
}

.back-icon {
  font-size: 20px;
  line-height: 1;
}

@media (max-width: 1023px) {
  .content {
    width: 100%;
    padding: 20px;
  }

  .header-content {
    padding-top: 50px;
  }

  .back-btn {
    top: 0;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>