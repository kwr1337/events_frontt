<template>
  <div class="__title">
  <div class="left"></div>
  <h2><slot></slot></h2>
  <div class="right"></div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.__title{
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 100px;
}
@media (max-width: 1023px) {
  .__title{
    margin-bottom: 50px;
  }
}
h2{
  color: var(--white, #FFF);
  text-align: center;
  font-family: El Messiri,serif;
  font-size: 42px;
  font-style: normal;
  font-weight: 700;
  line-height: 140%;
  margin: 0 35px;
}

.left{
  width: 28px;
  height: 14px;
  flex-shrink: 0;
  border-radius: 0 50px;
  background:#018ABE;
}
.right{
  width: 28px;
  height: 14px;
  flex-shrink: 0;
  border-radius: 50px 0;
  background: #018ABE;
}
</style>