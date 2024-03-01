<template>
  <div>
    <Title>Сеансы Камалия</Title>
    <div class="content">
      <div class="img img_1" @click="$router.push({name: 'sessions'})"><h4>Робототехника</h4></div>
      <div class="img img_2" @click="$router.push({name: 'sessions'})"><h4>Театральная студия</h4></div>
      <div class="img img_3" @click="$router.push({name: 'sessions'})"><h4>Программирование</h4></div>
    </div>
  </div>
</template>

<script>
import Title from "@/components/UI/Title.vue";

export default {
  components: {Title}

}
</script>

<style lang="scss" scoped>
.content{
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
h4{
  color: var(--white, #FFF);
  font-family: El Messiri,serif;
  font-size: 24px;
  font-style: normal;
  font-weight: 300;
  line-height: 140%;
  margin: 194px 40px 0;
}
.img{
  width: 416px;
  height: 258.622px;
}
.img_1{
  background: url("@/assets/MainPage/sessions/opo-roboty-thegem.png");
}
.img_2{
  background: url("@/assets/MainPage/sessions/teatr-studio.png");
}
.img_3{
  background: url("@/assets/MainPage/sessions/programmer.png");
}
@media (max-width: 1300px) and (min-width: 1024px){
  .content{
    justify-content: center;
  }
  .img{
    margin: 15px;
  }
  .img_3{
    margin-bottom: 0;
  }
}
@media (max-width: 1023px) {
  .content{
    flex-direction: column;
    align-content: center
  }
  .img{
    margin-bottom: 25px;
  }
  .img_3{
    margin-bottom: 0;
  }
}
@media (max-width: 430px) {
  .content{
    padding: 20px;
  }
  .img{
    width: 100%;
    border-radius: 15px;
  }
}
</style>