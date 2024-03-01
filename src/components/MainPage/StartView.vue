<template>
  <div class="block__main">
    <h1>
      Досугово-Развивающий центр «Камалия»
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

h1{
  max-width: 962px;
  font-family: El Messiri,serif;
  color: var(--white, #FFF);
  text-align: center;
  font-size: 64px;
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