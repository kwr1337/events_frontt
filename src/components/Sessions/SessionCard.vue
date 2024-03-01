<template>
  <div>
    <NavBar/>
    <div class="wrapper">
      <Title>{{ event.value.name }}</Title>
      <div class="content">
        <div class="text">
          <div class="info">
            <div class="date">{{ event.value.date }}</div>
            <div class="date">{{ event.value.age_limit }}</div>

          </div>
          <div class="name">{{ event.value.name }}</div>
          <div class="date">{{ event.value.place }}</div>
          <div class="description">{{ event.value.description }}</div>
          <a :href="event.value.ref_buy" target="_blank">
            <my-button>Купить</my-button>
          </a>
        </div>
        <img :src="imageUrl(event.value.img)"/>
      </div>
      <div class="video">
        <div ref="youtube"/>
        <div class="description">{{ event.value.description2 }}</div>
      </div>

    </div>
  </div>
</template>

<script>
import {useRoute} from 'vue-router'
import {useFetchOneEvent} from "@/components/hooks/useFetchOneEvent";
import Title from "@/components/UI/Title.vue";
import NavBar from "@/components/MainPage/NavBar.vue";
import {usePlayer} from '@vue-youtube/core';
import MyButton from "@/components/UI/MyButton.vue";
import {computed, onMounted, ref} from "vue";

export default {
  components: {MyButton, NavBar, Title},
  setup() {
    const {event} = useFetchOneEvent({id: useRoute().params.id})

    function imageUrl(value) {
      return new URL(`${process.env.VUE_APP_API_URL}/${value}`, import.meta.url).href
    }

    const youtube = ref();
    const videoId = ref('dQw4w9WgXcQ');
    let WidthVideo = 0;
    let HeightVideo = 0;

    if (window.innerWidth > 1000) WidthVideo = 650;
    HeightVideo = 430
    if (window.innerWidth < 1000) WidthVideo = 424;
    HeightVideo = 410
    if (window.innerWidth <= 425) WidthVideo = 320;
    HeightVideo = 230


    usePlayer(videoId, youtube, {
      playerVars: {
        autoplay: 0
      },
      width: WidthVideo,
      height: 330,
    });
    setTimeout(() => {
      videoId.value = event.value.ref_video;
    }, 1000);


    return {event, imageUrl, youtube}
  }

}
</script>

<style lang="scss" scoped>
.youtube {
  width: 150px;
}

.video {
  margin-top: 50px;
  display: flex;
  margin-bottom: 100px;

  .description {
    width: 415px;
    margin-left: 135px;
  }
}

.info {
  display: flex;
}

.wrapper {
  position: relative;
  top: 150px;
  width: 1300px;
  margin: 0 auto;
}

.content {
  display: flex;
}

.date {
  width: max-content;
  border-radius: 5px;
  background: var(--accent, #018ABE);
  align-items: flex-start;
  padding: 6px 12px 5px 12px;
  color: #fff;
  font-size: 15px;
  font-style: normal;
  font-weight: 600;
  line-height: 135%;
  margin-bottom: 20px;
  margin-right: 5px;
}

.name {
  color: var(--white, #FFF);
  font-family: El Messiri, serif;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 140%;
  margin-bottom: 20px;
}

.description {
  color: var(--white, #FFF);
  font-size: 16px;
  font-style: normal;
  font-weight: 200;
  line-height: 140%;
  margin-bottom: 20px;
}

img {
  width: 650px;
  border-radius: 10px;
  margin-left: 135px;
}

@media (max-width: 1300px) {
  .wrapper {
    width: 1000px;
  }
  img {
    width: 450px;
  }
}

@media (max-width: 1000px) {
  .wrapper {
    top: 100px;
    width: 100%;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .content {
    flex-direction: column;
  }
  img {
    margin-left: 0;
    width: 415px;
  }
  .video {
    align-items: center;
    flex-direction: column-reverse;

    .description {
      margin-left: 0;
    }
  }
  .description {
    width: 415px;
  }
  .btn {
    margin-bottom: 20px;
  }

}

@media (max-width: 425px) {
  img {
    width: 320px;
  }
  .text {
    display: flex;
    align-items: center;
    flex-direction: column;
  }
  .description {
    width: 320px;
  }
  .video {
    .description {
      width: 320px;
    }
  }
}
</style>