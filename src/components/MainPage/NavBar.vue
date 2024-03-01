<template>
  <div class="wrapper__header" :class="uu">
  <div class="block__header">
    <router-link :to="{name: 'main', hash: '#start'}" class="img" @click="burger_active=false"></router-link>
    <div class="links" :class="{active: burger_active}">
  <router-link :to="{name: 'main', hash: '#start'}" class="link" @click="burger_active=false">Главная</router-link>
  <router-link to="/sessions" class="link">Сеансы</router-link>
  <router-link :to="{name: 'main', hash: '#feedback'}" class="link" @click="burger_active=false">Отзывы</router-link>
  <router-link :to="{name: 'main', hash: '#contacts'}" class="link" @click="burger_active=false">Контакты</router-link>
  <router-link :to="{name: 'main', hash: '#about'}" class="link" @click="burger_active=false">О нас</router-link>
      <router-link :to="{name: 'sessions'}">
        <my-button class="btn">Записаться на сеанс</my-button>
      </router-link>
    </div>
    <div class="burger" :class="{active: burger_active}" @click="burger_active=!burger_active"><span></span></div>
  </div>

  </div>




</template>

<script>
import MyButton from "@/components/UI/MyButton.vue";

export default {
  components: {MyButton},
  data() {
    return {
      pageOffset: 0,
      burger_active: false
    }
  },
  mounted() {
    window.addEventListener('scroll', async () =>this.pageOffset = window.pageYOffset)
  },

  computed:{
    uu(){
      if(this.pageOffset !== 0){
        return 'scroll'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper__header{
  width: 100%;
  height: 99px;
  z-index: 999;
  background-color: #162831;
  display: flex;
  justify-content: center;
  position: fixed;
  flex-direction: column;
  align-items: center;
  transition: all 0.6s ease 0s;
}
.block__header{
  width: 1300px;
  height: 99px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.links {
  display: flex;
  align-items: center;
}
.link{
  margin: 0 30px;
  text-decoration: none;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 135%;
  color: var(--white, #FFF);
}
.btn{
  margin-left: 80px;
}
.img{
  width: 110px;
  height: 60px;
  background: center / contain no-repeat url('@/assets/logo2.png')
}
.scroll{
  transition: all 0.6s ease 0s;
  box-shadow: rgba(0, 0, 0, 0.07) 15px 15px 15px 15px;

}
@media (max-width: 1300px) and (min-width: 1024px) {
  .block__header{
    width: 1000px;
    height: 99px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .links{
    margin-left: 40px;
  }

}
@media (max-width: 1023px) {
  .block__header{
    width: 100%;
    height: 99px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .links{
    top:100px;
    align-items: flex-start;
    flex-direction: column;
    position: fixed;
    right: -200%;
    width: 100%;
    height: 100%;
    background: hsl(0,0%, 100%, 0.1);
    backdrop-filter: blur(1rem);
    -webkit-backdrop-filter: blur(10px);
    transition: all 0.3s ease 0s;
    z-index: 15;
    &.active{
      right: 0;
    }
    .link{
      margin: 10px 36px;
      font-size: 40px;
    }
    .btn{
      margin: 10px 36px;
      font-size: 20px;
    }
  }

  .img{
    height: 50px;
  }

  .burger{
    display: block;
    position: fixed;
    left: 90%;
    width: 30px;
    height: 20px;
    top: 39px;
    z-index: 50;

    span{
      position: absolute;
      background-color: var(--white, #FFF);
      left:0;
      width: 100%;
      height: 2px;
      top: 9px;
      transition:all 0.3s ease 0s;
    }

    &:before,
    &:after{
      content: '';
      background-color: var(--white, #FFF);
      position:absolute;
      width: 100%;
      height: 2px;
      left:0;
      transition:all 0.3s ease 0s;
    }
    &:before{
      top: 0;
    }
    &:after{
      bottom: 0;
    }
    &.active:before{
      transform:rotate(45deg);
      top:9px;
    }
    &.active:after{
      transform:rotate(-45deg);
      bottom:9px;
    }
    &.active span{
      transform: scale(0);
    }
  }
}






</style>