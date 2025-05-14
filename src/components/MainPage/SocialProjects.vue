image.png<template>
  <div class="social-projects">
    <Title>Социальные проекты</Title>
    <SessionsSlider 
      :total-items="projects.length"
      :items-per-page="3"
      v-model="currentPage"
    >
      <div class="slides-grid">
        <template v-for="project in projects" :key="project.id">
          <div 
            v-if="isVisible(project, currentPage)"
            class="project-card-wrapper"
          >
            <div class="project-card">
              <div class="card-front">
                <img :src="getImageUrl(project.img)" :alt="project.name" class="project-image">
                <div class="project-overlay"></div>
                <h4 class="project-name">{{ project.name }}</h4>
              </div>
              <div class="card-back">
                <h4 class="project-name">{{ project.name }}</h4>
                <p class="project-description">{{ project.description }}</p>
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
import api from '@/api/axios';
import Title from "@/components/UI/Title.vue";
import SessionsSlider from "@/components/Sessions/SessionsSlider.vue";

export default {
  name: 'SocialProjects',
  components: {
    Title,
    SessionsSlider
  },
  setup() {
    const projects = ref([]);
    const currentPage = ref(0);

    const fetchProjects = async () => {
      try {
        const response = await api.get('/api/social-projects');
        projects.value = response.data;
      } catch (error) {
        console.error('Ошибка при получении социальных проектов:', error);
      }
    };

    const getImageUrl = (path) => {
      if (!path) return '';
      return `${process.env.VUE_APP_API_URL}/${path}`;
    };

    const isVisible = (project, page) => {
      const index = projects.value.indexOf(project);
      const start = page * 3;
      const end = start + 3;
      return index >= start && index < end;
    };

    onMounted(fetchProjects);

    return {
      projects,
      currentPage,
      getImageUrl,
      isVisible
    };
  }
}
</script>

<style lang="scss" scoped>
.social-projects {
  padding: 50px 0;
  background: #162831;
  
  :deep(.sessions-slider) {
    margin: 40px auto;
    max-width: 1300px;
  }
}

.slides-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
  width: 100%;
  margin: 0 auto;
}

.project-card-wrapper {
  width: 100%;
  height: 360px;
  perspective: 1000px;
}

.project-card {
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
  justify-content: center;
  align-items: center;
  text-align: center;
}

.project-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.project-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0) 100%);
  opacity: 0.5;
}

.project-name {
  color: var(--white, #FFF);
  font-family: El Messiri, serif;
  font-size: 24px;
  font-weight: 700;
  line-height: 140%;
  text-align: center;
  margin: 0;
  
  .card-front & {
    position: absolute;
    bottom: 80px;
    left: 20px;
    right: 20px;
    z-index: 2;
  }
  
  .card-back & {
    margin-bottom: 20px;
  }
}

.project-description {
  color: var(--white, #FFF);
  font-size: 16px;
  line-height: 1.5;
  margin: 0;
  max-height: 200px;
  overflow-y: auto;
}

@media (max-width: 1300px) {
  .slides-grid {
    max-width: 1000px;
  }
  
  .project-card-wrapper {
    height: 300px;
  }
}

@media (max-width: 1023px) {
  .slides-grid {
    grid-template-columns: repeat(2, 1fr);
    max-width: 800px;
  }
}

@media (max-width: 767px) {
  .slides-grid {
    grid-template-columns: 1fr;
    max-width: 400px;
  }
  
  .project-card-wrapper {
    height: 250px;
  }
  
  .project-name {
    font-size: 20px;
    
    .card-front & {
      bottom: 60px;
    }
  }
  
  .project-description {
    font-size: 14px;
  }
}
</style> 