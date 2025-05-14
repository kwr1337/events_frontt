<template>
  <div class="directions-container">
    <Title>Досуговые направления</Title>
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
          >
            <div class="direction-card">
              <div class="card-front">
                <img :src="getImageUrl(direction.img)" :alt="direction.name" class="direction-image">
                <div class="direction-overlay"></div>
                <h4 class="direction-name">{{ direction.name }}</h4>
              </div>
              <div class="card-back">
                <h4 class="direction-name">{{ direction.name }}</h4>
                <p class="direction-description">{{ direction.description || 'Описание отсутствует' }}</p>
                <MyButton @click="goToEvents(direction.id)" class="more-button">Подробнее</MyButton>
              </div>
            </div>
          </div>
        </template>
      </div>
    </SessionsSlider>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import api from '@/api/axios';
import Title from "@/components/UI/Title.vue";
import MyButton from "@/components/UI/MyButton.vue";
import SessionsSlider from "@/components/Sessions/SessionsSlider.vue";

export default {
  name: 'DirectionsList',
  components: {
    Title,
    MyButton,
    SessionsSlider
  },
  setup() {
    const currentPage = ref(0)
    const directions = ref([])
    const loading = ref(true)
    const error = ref(null)

    const visibleDirections = computed(() => {
      const start = currentPage.value * 6
      const end = start + 6
      return directions.value.slice(start, end)
    })

    const isVisible = (direction, page) => {
      const index = directions.value.indexOf(direction)
      const start = page * 6
      const end = start + 6
      return index >= start && index < end
    }

    const fetchDirections = async () => {
      loading.value = true
      error.value = null
      try {
        console.log('Начинаем загрузку направлений...')
        const response = await api.get('/api/directions')
        console.log('Получены данные:', response.data)
        directions.value = response.data
      } catch (err) {
        console.error('Ошибка при получении направлений:', err)
        error.value = 'Ошибка при загрузке направлений: ' + (err.message || err)
      } finally {
        loading.value = false
      }
    }

    const getImageUrl = (path) => {
      if (!path) return ''
      return `${process.env.VUE_APP_API_URL}/${path}`
    }

    const goToEvents = (directionId) => {
      window.location.href = `/directions/${directionId}/events`
    }

    fetchDirections()

    return {
      currentPage,
      directions,
      visibleDirections,
      loading,
      error,
      isVisible,
      fetchDirections,
      getImageUrl,
      goToEvents
    }
  }
}
</script>

<style lang="scss" scoped>
.directions-container {
  width: 100%;
  max-width: 1300px;
  margin: 0 auto;

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
}

.direction-card {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.8s;
  transform-style: preserve-3d;
  cursor: pointer;

  &:hover {
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
  margin: 10px 0;
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
  .directions-container {
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
  .directions-container {
    max-width: 800px;
  }
  
  .slides-grid {
    grid-template-columns: repeat(2, 1fr);
    max-width: 800px;
  }
}

@media (max-width: 430px) {
  .directions-container {
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