<template>
  <div>
    <NavBar />
    <div class="wrapper">
      <div class="header-content">
        <MyButton @click="$router.go(-1)" class="back-btn">
          <span class="back-icon">←</span> Назад
        </MyButton>
        <Title>{{ direction?.name }}</Title>
      </div>
      <div class="content">
        <div class="text">
          <div class="name">{{ direction?.name }}</div>
          <div class="description">{{ direction?.description }}</div>
          <div class="signup-block">
            <a :href="whatsappLink" target="_blank" rel="noopener noreferrer">
              <my-button class="signup-btn">Записаться на занятие</my-button>
            </a>
          </div>
        </div>
        
        <!-- Slider for images -->
        <div v-if="direction?.images && direction.images.length > 0" class="image-slider">
          <swiper
            :modules="[SwiperAutoplay, SwiperPagination]"
            :slides-per-view="1"
            :space-between="10"
            :pagination="{ clickable: true }"
            :autoplay="{ delay: 15000, disableOnInteraction: false }"
            class="swiper"
          >
            <swiper-slide v-for="(image, index) in direction.images" :key="index">
              <img :src="getImageUrl(image)" :alt="direction?.name" class="slide-image">
            </swiper-slide>
          </swiper>
        </div>
      </div>
      
      <!-- Расписание занятий -->
      <div v-if="direction?.schedule" class="schedule-section">
        <ScheduleDisplay :scheduleData="direction.schedule" />
      </div>
      
      <div class="video" v-if="direction?.videoLink">
        <div class="video-container">
          <iframe 
            :src="getVideoEmbedUrl(direction.videoLink)"
            width="720"
            height="405"
            frameborder="0"
            allow="clipboard-write; autoplay"
            allowfullscreen
          ></iframe>
        </div>
        <div class="description" v-if="direction?.description2">{{ direction.description2 }}</div>
        <div class="description" v-else>{{ direction?.description }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import api from '@/api/axios';
import NavBar from "@/components/MainPage/NavBar.vue";
import Title from "@/components/UI/Title.vue";
import MyButton from "@/components/UI/MyButton.vue";
import ScheduleDisplay from "@/components/UI/ScheduleDisplay.vue";
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination as SwiperPagination, Autoplay as SwiperAutoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

export default {
  name: 'ActivityDirectionPage',
  components: {
    NavBar,
    Title,
    MyButton,
    Swiper,
    SwiperSlide,
    ScheduleDisplay
  },
  setup() {
    const route = useRoute();
    const direction = ref(null);
    const loading = ref(true);
    const error = ref(null);

    const whatsappLink = computed(() => {
      const phoneNumber = '79377730559'; // Замените на реальный номер телефона
      const text = direction.value ? 
        `Здравствуйте! Хочу записаться на занятие по направлению "${direction.value.name}"` : 
        'Здравствуйте! Хочу записаться на занятие';
      return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
    });

    const fetchDirection = async () => {
      try {
        loading.value = true;
        const response = await api.get(`/api/activity-directions/${route.params.id}`);
        direction.value = response.data;
      } catch (err) {
        error.value = 'Ошибка при загрузке направления';
        console.error('Ошибка при получении направления:', err);
      } finally {
        loading.value = false;
      }
    };

    const getImageUrl = (path) => {
      if (!path) return '';
      return `${process.env.VUE_APP_API_URL}/${path}`;
    };

    const getVideoEmbedUrl = (url) => {
      if (!url) return '';
      
      // Преобразуем url в строку
      const urlStr = String(url).trim();
      
      // Если строка пустая после очистки
      if (!urlStr) return '';
      
      try {
        // YouTube
        if (urlStr.includes('youtube.com/watch?v=')) {
          const videoId = urlStr.split('v=')[1].split('&')[0];
          return `https://www.youtube.com/embed/${videoId}`;
        }
        
        // Rutube обычная ссылка
        if (urlStr.includes('rutube.ru/video/')) {
          const videoId = urlStr.split('/video/')[1].split('/')[0];
          return `https://rutube.ru/play/embed/${videoId}`;
        }
        
        // Rutube embed
        if (urlStr.includes('rutube.ru/embed/')) {
          return urlStr;
        }
        
        // Если передан только ID видео Rutube
        if (!urlStr.includes('/')) {
          return `https://rutube.ru/play/embed/${urlStr}`;
        }
        
        // Возвращаем исходную ссылку, если не смогли обработать
        return urlStr;
      } catch (error) {
        console.error('Ошибка при обработке URL видео:', error);
        return '';
      }
    };

    onMounted(fetchDirection);

    return {
      direction,
      loading,
      error,
      getImageUrl,
      getVideoEmbedUrl,
      SwiperPagination,
      SwiperAutoplay,
      whatsappLink
    };
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  position: relative;
  top: 150px;
  width: 100%;
  max-width: 1300px;
  margin: 0 auto;
  padding: 0 20px;
  box-sizing: border-box;
}

.content {
  display: flex;
  gap: 30px;
  align-items: flex-start;
}

.text {
  flex: 1;
  min-width: 0;
}

.image-slider {
  width: 650px;
  height: 500px;
  border-radius: 10px;
  overflow: hidden;
  flex-shrink: 0;
  
  .swiper {
    width: 100%;
    height: 100%;
  }
  
  .slide-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  :deep(.swiper-pagination) {
    .swiper-pagination-bullet {
      background: #fff;
      opacity: 0.5;
    }
    
    .swiper-pagination-bullet-active {
      opacity: 1;
    }
  }
}

.info {
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

.signup-block {
  display: flex;
  margin: 10px 0 20px;
}

.signup-btn {
  background: #018ABE !important;
  color: #fff !important;
  padding: 12px 25px !important;
  border-radius: 8px !important;
  font-weight: 600 !important;
  transition: all 0.3s ease;
  
  &:hover {
    background: #0171a1 !important;
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(1, 138, 190, 0.3);
  }
}

.schedule-section {
  margin: 30px 0;
  // background: #162831;
  // border-radius: 10px;
  // padding: 20px;
  // box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.video {
  margin-top: 50px;
  display: flex;
  gap: 30px;
  margin-bottom: 100px;
  width: 100%;
  max-width: 100%;
  
  .video-container {
    flex: 1 1 60%;
    max-width: 720px;
    aspect-ratio: 16/9;
    position: relative;
    background: #000;
    
    iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 10px;
    }
  }

  .description {
    flex: 1 1 40%;
    min-width: 0;
    width: auto;
    max-width: 400px;
  }
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

@media (max-width: 1300px) {
  .wrapper {
    max-width: 1000px;
  }
  
  .image-slider {
    width: 450px;
    height: 350px;
  }
  
  .video {
    flex-direction: column;
    
    .video-container {
      width: 100%;
      max-width: 100%;
    }
    
    .description {
      width: 100%;
      margin-top: 20px;
    }
  }
}

@media (max-width: 1100px) {
  .video {
    flex-direction: column;
    
    .video-container {
      width: 100%;
      max-width: 100%;
    }
    
    .description {
      width: 100%;
      max-width: 100%;
      margin-top: 20px;
    }
  }
}

@media (max-width: 1000px) {
  .wrapper {
    top: 100px;
  }
  .content {
    flex-direction: column;
    align-items: center;
    
    .image-slider {
      margin-top: 20px;
      width: 100%;
      max-width: 250px;
      height: 180px;
    }
    
    .text {
      width: 100%;
      
      .signup-block {
        margin: 10px 0 20px;
        display: flex;
        justify-content: center;
      }
    }
  }
  
  .video {
    .video-container {
      width: 100%;
    }
  }
}

@media (max-width: 425px) {
  .image-slider {
    max-width: 200px;
    height: 120px;
  }
  
  .text {
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 100%;
    
    .signup-block {
      margin: 10px 0 20px;
    }
  }
  
  .description {
    width: 100%;
  }
  
  .video {
    .description {
      width: 100%;
    }
  }
}
</style> 