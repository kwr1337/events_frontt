<template>
  <router-link :to="{path: 'sessions' + `/${data.id}`} " class="link">
  <div class="__container">
    <div class="date mobile">{{data.date}}</div>
    <img  :src="imageUrl"/>
    <div>
    <div class="text">
    <div class="date default">{{data.date}}</div>
    <div class="name">{{data.name}}</div>
    <div class="description">{{data.description}}</div>
      <router-link :to="{path: 'sessions' + `/${data.id}`} ">
      <my-button class="btn" :color="'blue'" >Открыть сеанс</my-button>
      </router-link>
    </div>
    </div>
  </div>
  </router-link>
</template>

<script>

import MyButton from "@/components/UI/MyButton.vue";

export default {
  components: {MyButton},
  props:{
    data:{

    }
  },
  setup(props){
    const imageUrl = new URL(`${process.env.VUE_APP_API_URL}/${props.data.img}`, import.meta.url).href
    return {imageUrl};
  }

}
</script>

<style lang="scss" scoped>
.__container{
  width: 100%;
  display: flex;
  border: solid 2px var(--accent, #018ABE);
  padding: 50px 60px;
  border-radius: 20px;
}
.text{
  margin-left: 50px;
}
.date{
  text-align: center;
  width: 105px;
  border-radius: 5px;
  background: var(--accent, #018ABE);
  align-items: flex-start;
  padding: 6px 12px 5px 12px;
  color: #fff;
  font-size: 15px;
  font-style: normal;
  font-weight: 600;
  line-height: 135%;
  margin-bottom: 30px;
}
.name{
  color: var(--white, #FFF);
  font-family: El Messiri,serif;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 140%;
  margin-bottom: 20px;
}
.description{
  color: var(--white, #FFF);
  font-size: 16px;
  font-style: normal;
  font-weight: 200;
  line-height: 140%;
  margin-bottom: 40px;
}
.btn{
  color: var(--white, #FFF);
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 135%;
}
img{
  width: 550px;
}
.link{
  text-decoration: none;
}
.mobile{
  display: none;
}
@media (max-width: 1200px) {
  img{
    width: 300px;
  }
  .description{
    height: 100px;
    overflow: hidden;
  }
  .__container{
    padding: 30px 40px;
  }
}
@media (max-width: 660px) {
  .text{
    margin-left: 20px;
  }
  .name{
    font-size: 18px;
  }
  .description{
    font-size: 12px;
  }

}
@media (max-width: 580px) {
img{
  width: 200px;
}
}
@media (max-width: 480px) {
.__container{
  display: flex;
  flex-direction: column;
}
  img{
    width: 100%;
    margin-bottom: 20px;
  }
  .mobile{
    display: block;
  }
  .default{
    display: none;
  }
  .text{
    margin-left: 0;
  }
  .date{
    margin-bottom: 15px;
  }
  .description{
    margin-bottom: 20px;
  }
  .name{
    margin-bottom: 10px;
  }
}
</style>