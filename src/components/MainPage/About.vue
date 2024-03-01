<template>
  <div>
    <Title>Об Камалия</Title>
    <div class="block first">
      <div class="text">
        <h3>Камалия</h3>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec in purus, sed tellus eget mattis nibh quam. Eu ornare nunc, id est. Erat consectetur etiam a sit diam in imperdiet amet. Diam nisl, ipsum suscipit amet. Eleifend amet habitasse proin quis adipiscing.
        Nisl convallis mauris in consequat. Sit ac vitae posuere maecenas dictumst quam. Felis amet diam, non augue massa. Egestas molestie lobortis rhoncus, elit nulla nisl. Habitant tortor at tempor.
      </div>
      <div class="img img_1"></div>
    </div>
    <div class="block revers">
      <div class="img img_2"></div>
      <div class="text">
        <h3>Камалия</h3>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec in purus, sed tellus eget mattis nibh quam. Eu ornare nunc, id est. Erat consectetur etiam a sit diam in imperdiet amet. Diam nisl, ipsum suscipit amet. Eleifend amet habitasse proin quis adipiscing.
        Nisl convallis mauris in consequat. Sit ac vitae posuere maecenas dictumst quam. Felis amet diam, non augue massa. Egestas molestie lobortis rhoncus, elit nulla nisl. Habitant tortor at tempor.
      </div>
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
.block{
  width: 100%;
  display: flex;
  justify-content: space-around;
  &.first{
    margin-bottom: 100px
  }
}
.text{
  width: 466px;
  color: var(--white, #FFF);
  /* p / 16l */
  font-family: Proxima Nova,serif;
  font-size: 16px;
  font-style: normal;
  font-weight: 300;
  line-height: 140%;
  h3{
    margin-bottom: 19px;
    color: var(--white, #FFF);
    font-family: El Messiri,serif;
    font-size: 32px;
    font-style: normal;
    font-weight: 700;
    line-height: 140%;
  }
}
.img{
  width: 526px;
  height: 365px;
  background-repeat: no-repeat;
  background-position: center;
}
.img_1{
  margin-left: 84px;
  background-image: url('@/assets/MainPage/about/about_1.png');
}
.img_2{
  margin-right: 84px;
  background-image: url('@/assets/MainPage/about/about_2.png');
}
@media (max-width: 1300px) and (min-width: 1024px){
  .block{
    padding: 30px;
  }
  .img{
    width: 500px;
    height: 350px;
    border-radius: 15px;
  }
}
@media (max-width: 1023px) {
  .block{
    flex-direction: column;
    align-items: center;
    &.revers{
      flex-direction: column-reverse;
    }
    &.first{
      margin-bottom: 20px
    }
  }
  .img_1{
    margin: 0;
  }
  .img_2{
    margin: 0;
  }
  .text{
    margin-bottom: 20px;
    width: 526px;
  }
}
@media (max-width: 530px){
  .text{
    width: 90%;
  }
  .img{
    width: 90%;
    border-radius: 15px;
  }
}
</style>