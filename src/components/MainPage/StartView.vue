<template>
  <div class="block__main">
    <div class="warm-overlay"></div>
    <h1>
      Автономная Некоммерческая Организация<br>
      Досугово-развивающий центр<br>
      "Камалия"
    </h1>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.block__main{
  width: 100% ;
  position: relative;
  top: 100px;
  height: 556.621px;
  background-size: cover;
  background: url('@/assets/MainPage/main.png') no-repeat center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.warm-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  // background: linear-gradient(90deg, rgba(199, 117, 42, 0.5) 0%, rgba(227, 151, 46, 0.4) 100%);
  z-index: 1;
}

h1{
  position: relative;
  z-index: 2;
  max-width: 962px;
  font-family: El Messiri,serif;
  color: var(--white, #FFF);
  text-align: center;
  font-size: 49px;
  font-style: normal;
  line-height: 140%;
}

@media (max-width: 400px) {
  h1{
    width: 100%;
    font-size: 44px;
  }
}
</style>