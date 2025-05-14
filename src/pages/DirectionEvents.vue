<template>
  <div>
    <NavBar />
    <div class="direction-events">
      <div class="content">
        <div class="header">
          <div class="header-content">
            <MyButton @click="$router.go(-1)" class="back-btn">
              <span class="back-icon">←</span> Назад
            </MyButton>
            <Title>{{ direction?.name }}</Title>
          </div>
        </div>
        
        <div class="events-grid">
          <div 
            v-for="event in events" 
            :key="event.id" 
            class="event-card"
            @click="goToSessions(event.id)"
          >
            <img :src="getImageUrl(event.img)" :alt="event.name" class="event-image">
            <h4 class="event-name">{{ event.name }}</h4>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api/axios';
import Title from "@/components/UI/Title.vue";
import MyButton from "@/components/UI/MyButton.vue";
import NavBar from "@/components/MainPage/NavBar.vue";

export default {
  name: 'DirectionEvents',
  components: {
    Title,
    MyButton,
    NavBar
  },
  data() {
    return {
      direction: null,
      events: []
    }
  },
  async created() {
    await this.fetchDirection();
  },
  methods: {
    getImageUrl(path) {
      if (!path) return '';
      return `${process.env.VUE_APP_API_URL}/${path}`;
    },
    async fetchDirection() {
      try {
        const response = await api.get(`/api/directions/${this.$route.params.id}`);
        this.direction = response.data;
        this.events = response.data.events;
      } catch (error) {
        console.error('Ошибка при получении данных:', error);
      }
    },
    goToSessions(eventId) {
      this.$router.push(`/sessions/${eventId}`);
    }
  }
}
</script>

<style lang="scss" scoped>
.direction-events {
  min-height: 100vh;
  background: #162831;
}

.content {
  position: relative;
  top: 180px;
  width: 1300px;
  margin: 0 auto;
  padding-bottom: 50px;
}

.header {
  margin-bottom: 3rem;
}

.header-content {
  position: relative;
  text-align: center;
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

.events-grid {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: 30px;
}

.event-card {
  width: 416px;
  height: 258px;
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease;
  margin-bottom: 25px;

  &:hover {
    transform: scale(1.05);
  }
}

.event-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.event-name {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  color: var(--white, #FFF);
  font-family: El Messiri, serif;
  font-size: 24px;
  font-weight: 300;
  line-height: 140%;
  margin: 194px 40px 0;
}

@media (max-width: 1300px) and (min-width: 1024px) {
  .content {
    width: 100%;
    padding: 0 20px;
  }
  
  .events-grid {
    justify-content: center;
  }
  
  .event-card {
    margin: 15px;
  }
}

@media (max-width: 1023px) {
  .content {
    width: 100%;
    padding: 0 20px;
  }

  .events-grid {
    flex-direction: column;
    align-items: center;
  }
  
  .event-card {
    width: 100%;
    max-width: 416px;
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

@media (max-width: 430px) {
  .content {
    padding: 0 10px;
  }
  
  .events-grid {
    padding: 20px;
  }
  
  .event-card {
    height: 200px;
  }
  
  .event-name {
    margin: 134px 20px 0;
    font-size: 20px;
  }
}
</style> 