<template>
  <div>
    <NavBar/>
    <div class="wrapper">
      <div class="header-content">
        <MyButton @click="$router.go(-1)" class="back-btn">
          <span class="back-icon">←</span> Назад
        </MyButton>
        <Title>{{ event.value.name }}</Title>
      </div>
      <div class="content">
        <div class="text">
          <div class="info">
            <div class="date">{{ formatDate(event.value.date) }}</div>
            <div v-if="formatTime(event.value.date)" class="date">{{ formatTime(event.value.date) }}</div>
            <div class="date">{{ event.value.age_limit }}</div>
          </div>
          <div class="name">{{ event.value.name }}</div>
          <div class="date">{{ event.value.location || event.value.place }}</div>
          <div class="description">{{ event.value.description }}</div>
          <a :href="whatsappLink" target="_blank" rel="noopener noreferrer">
            <my-button class="signup-btn">Записаться на занятие</my-button>
          </a>
        </div>
        <img :src="imageUrl(event.value.img)" :alt="event.value.name" class="session-image">
      </div>
      <div class="video">
        <div class="video-container">
          <iframe 
            v-if="event.value.ref_video"
            :src="getRutubeUrl(event.value.ref_video)"
            width="720"
            height="405"
            frameborder="0"
            allow="clipboard-write; autoplay"
            allowfullscreen
          ></iframe>
        </div>
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
import MyButton from "@/components/UI/MyButton.vue";
import {computed, onMounted, ref} from "vue";

export default {
  components: {MyButton, NavBar, Title},
  setup() {
    const {event} = useFetchOneEvent({id: useRoute().params.id})

    // Создаем computed свойство для ссылки на WhatsApp
    const whatsappLink = computed(() => {
      const phoneNumber = '79377730559'; // Номер телефона для связи
      const text = event.value ? 
        `Здравствуйте! Хочу записаться на мероприятие "${event.value.name}"` : 
        'Здравствуйте! Хочу записаться на мероприятие';
      return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
    });

    function imageUrl(value) {
      return new URL(`${process.env.VUE_APP_API_URL}/${value}`, import.meta.url).href
    }

    // Функция для форматирования даты
    function formatDate(dateString) {
      if (!dateString) return '';
      
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      } catch (e) {
        console.error('Ошибка форматирования даты:', e);
        return dateString;
      }
    }
    
    // Функция для извлечения времени из даты
    function formatTime(dateString) {
      if (!dateString) return '';
      
      try {
        const date = new Date(dateString);
        // Проверяем, есть ли время в дате
        if (date.getHours() === 0 && date.getMinutes() === 0) return '';
        
        return date.toLocaleTimeString('ru-RU', {
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch (e) {
        console.error('Ошибка форматирования времени:', e);
        return '';
      }
    }

    function getRutubeUrl(url) {
      if (!url) return '';
      
      // Преобразуем url в строку
      const urlStr = String(url).trim();
      
      // Если строка пустая после очистки
      if (!urlStr) return '';

      try {
        // Если передан только ID видео
        if (!urlStr.includes('/')) {
          return `https://rutube.ru/embed/${urlStr}`;
        }

        // Если передан полный URL, пытаемся извлечь ID
        const videoId = urlStr
          .split('/')
          .filter(Boolean) // Убираем пустые строки
          .pop(); // Берем последний элемент

        if (!videoId) return '';
        
        return `https://rutube.ru/embed/${videoId}`;
      } catch (error) {
        console.error('Ошибка при обработке URL Rutube:', error);
        return '';
      }
    }

    return {
      event,
      imageUrl,
      getRutubeUrl,
      formatDate,
      formatTime,
      whatsappLink
    };
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
  width: 450px;
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
  .video {
    flex-direction: column;
    
    .video-container {
      width: 100%;
      max-width: 100%;
    }
    
    .description {
      width: 100%;
      margin-left: 0;
      margin-top: 20px;
    }
  }
}

@media (max-width: 1000px) {
  .wrapper {
    top: 100px;
    width: 100%;
    padding: 0 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .content {
    flex-direction: column;
    align-items: center;
    
    img {
      margin-left: 0;
      margin-top: 20px;
      width: 100%;
    }
    
    .text {
      width: 100%;
    }
  }
  
  .video {
    .video-container {
      width: 100%;
    }
  }
}

@media (max-width: 425px) {
  img {
    width: 100%;
  }
  .text {
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 100%;
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

.session-image {
  width: 50%;
  height: 500px;
  object-fit: cover;
  border-radius: 20px;
}

.session-info {
  flex: 1;
  color: #fff;
}

.info-block {
  margin-bottom: 30px;

  h3 {
    font-family: 'El Messiri', serif;
    font-size: 24px;
    color: #018ABE;
    margin-bottom: 15px;
  }

  p {
    font-size: 18px;
    line-height: 1.6;
  }
}

@media (max-width: 1300px) {
  .content {
    width: 100%;
    padding: 0 20px;
  }
}

@media (max-width: 1023px) {
  .session-details {
    flex-direction: column;
  }

  .session-image {
    width: 100%;
    height: 300px;
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

@media (max-width: 480px) {
  .info-block {
    h3 {
      font-size: 20px;
    }

    p {
      font-size: 16px;
    }
  }
}

.signup-btn {
  background: #018ABE !important;
  color: #fff !important;
  padding: 12px 25px !important;
  border-radius: 8px !important;
  font-weight: 600 !important;
  transition: all 0.3s ease;
  margin-top: 10px;
  
  &:hover {
    background: #0171a1 !important;
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(1, 138, 190, 0.3);
  }
}
</style>