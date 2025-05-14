<template>
  <div class="activity-directions">
    <Title>Развивающие направления </Title>
    <div v-if="loading" style="color: white; text-align: center;">
      Загрузка...
    </div>
    <div v-else-if="error" style="color: red; text-align: center;">
      {{ error }}
    </div>
    <SessionsSlider 
      v-else
      :total-items="directions.length"
      :items-per-page="6"
      v-model="currentPage"
    >
      <div class="slides-grid">
        <template v-for="direction in directions" :key="direction.id">
          <div 
            v-if="isVisible(direction, currentPage)"
            class="direction-card-wrapper"
            @click="goToDirection(direction.id)"
          >
            <div class="direction-card">
              <div class="card-front">
                <img v-if="direction.images && direction.images.length > 0" 
                     :src="getImageUrl(direction.images[0])" 
                     :alt="direction.name" 
                     class="direction-image">
                <div class="direction-overlay"></div>
                <h4 class="direction-name">{{ direction.name }}</h4>
              </div>
              <div class="card-back">
                <h4 class="direction-name">{{ direction.name }}</h4>
                <p class="direction-description">{{ direction.description }}</p>
                <MyButton @click="goToDirection(direction.id)" class="more-button">Подробнее</MyButton>
              </div>
            </div>
          </div>
        </template>
      </div>
    </SessionsSlider>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/api/axios';
import Title from "@/components/UI/Title.vue";
import SessionsSlider from "@/components/Sessions/SessionsSlider.vue";
import MyButton from "@/components/UI/MyButton.vue";

export default {
  name: 'ActivityDirections',
  components: {
    Title,
    SessionsSlider,
    MyButton
  },
  setup() {
    const router = useRouter();
    const directions = ref([]);
    const currentPage = ref(0);
    const loading = ref(true);
    const error = ref(null);

    const fetchDirections = async () => {
      try {
        loading.value = true;
        const response = await api.get('/api/activity-directions');
        directions.value = response.data;
      } catch (err) {
        error.value = 'Ошибка при загрузке направлений';
        console.error('Ошибка при получении направлений:', err);
      } finally {
        loading.value = false;
      }
    };

    const getImageUrl = (path) => {
      if (!path) return '';
      return `${process.env.VUE_APP_API_URL}/${path}`;
    };

    const isVisible = (direction, page) => {
      const index = directions.value.indexOf(direction);
      const start = page * 6;
      const end = start + 6;
      return index >= start && index < end;
    };

    const goToDirection = (id) => {
      router.push(`/activity-directions/${id}`);
    };

    onMounted(fetchDirections);

    return {
      directions,
      currentPage,
      loading,
      error,
      getImageUrl,
      isVisible,
      goToDirection
    };
  }
}
</script>

<style lang="scss" scoped>
.activity-directions {
  width: 100%;
  max-width: 1300px;
  margin: 0 auto;
  padding: 50px 0;

  :deep(.sessions-slider) {
    margin: 20px auto;
  }
}

.slides-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, auto);
  gap: 25px;
  width: 100%;
  margin: 0 auto;
}

.direction-card-wrapper {
  width: 100%;
  height: 258px;
  perspective: 1000px;
  cursor: pointer;
}

.direction-card {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.8s;
  transform-style: preserve-3d;

  .direction-card-wrapper:hover & {
    transform: rotateY(180deg);
  }
}

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 10px;
  overflow: hidden;
}

.card-front {
  background: var(--white, #FFF);
}

.card-back {
  background: #018ABE;
  transform: rotateY(180deg);
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  text-align: center;
}

.direction-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.direction-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 100%);
}

.direction-name {
  color: var(--white, #FFF);
  font-family: El Messiri, serif;
  font-size: 24px;
  font-weight: 300;
  line-height: 140%;
  margin: 0;
  
  .card-front & {
    position: absolute;
    bottom: 20px;
    left: 20px;
    right: 20px;
  }
  
  .card-back & {
    margin-bottom: 15px;
  }
}

.direction-description {
  color: var(--white, #FFF);
  font-size: 16px;
  line-height: 1.5;
  margin: 0;
  flex-grow: 1;
  overflow-y: auto;
}

.more-button {
  margin-top: 15px;
  background: var(--white, #FFF);
  color: #018ABE;
  border: none;
  padding: 8px 20px;
  border-radius: 5px;
  cursor: pointer;
  
  &:hover {
    background: #F0F0F0;
  }
}

@media (max-width: 1300px) {
  .activity-directions {
    max-width: 1000px;
  }
  
  .direction-card-wrapper {
    max-width: 416px;
  }
  
  .slides-grid {
    max-width: 1000px;
  }
}

@media (max-width: 1023px) {
  .activity-directions {
    max-width: 800px;
  }
  
  .slides-grid {
    grid-template-columns: repeat(2, 1fr);
    max-width: 800px;
  }
}

@media (max-width: 430px) {
  .activity-directions {
    max-width: 416px;
    padding: 0 15px;
  }
  
  .slides-grid {
    grid-template-columns: 1fr;
    max-width: 416px;
  }
  
  .direction-card-wrapper {
    height: 200px;
  }
  
  .direction-name {
    font-size: 20px;
  }
  
  .direction-description {
    font-size: 14px;
  }
}
</style> 