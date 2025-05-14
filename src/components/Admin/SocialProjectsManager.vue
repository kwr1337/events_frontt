<template>
  <div class="social-projects-manager">
    <div class="page-header">
      <h2>Управление социальными проектами</h2>
      <button @click="showAddModal = true" class="add-btn">
        Добавить проект
      </button>
    </div>

    <div class="projects-grid">
      <div v-for="project in projects" :key="project.id" class="project-card">
        <img :src="getImageUrl(project.img)" :alt="project.name" class="project-image">
        <div class="project-info">
          <h3 class="project-title">{{ project.name }}</h3>
          <p class="description">{{ project.description }}</p>
          <div class="project-actions">
            <button @click="editProject(project)" class="edit-btn">
              Редактировать
            </button>
            <button @click="deleteProject(project.id)" class="delete-btn">
              Удалить
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно для добавления/редактирования -->
    <div v-if="showAddModal" class="modal">
      <div class="modal-content">
        <h3>{{ editingProject ? 'Редактировать' : 'Добавить' }} проект</h3>
        <form @submit.prevent="saveProject">
          <div class="form-group">
            <label>Название</label>
            <input v-model="projectForm.name" required>
          </div>
          <div class="form-group">
            <label>Описание</label>
            <textarea v-model="projectForm.description" required></textarea>
          </div>
          <div class="form-group">
            <label>Изображение</label>
            <div v-if="editingProject && editingProject.img" class="current-image-container">
              <img :src="getImageUrl(editingProject.img)" alt="Текущее изображение" class="current-image">
              <p>Текущее изображение</p>
            </div>
            <input type="file" @change="handleImageUpload" accept="image/*">
            <small>Выберите новое изображение, чтобы заменить текущее</small>
          </div>
          <div class="modal-actions">
            <button type="submit" class="save-btn">Сохранить</button>
            <button type="button" @click="closeModal" class="cancel-btn">Отмена</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api/axios';

export default {
  name: 'SocialProjectsManager',
  data() {
    return {
      projects: [],
      showAddModal: false,
      editingProject: null,
      projectForm: {
        name: '',
        description: '',
        img: null
      }
    }
  },
  created() {
    this.fetchProjects();
  },
  methods: {
    getImageUrl(path) {
      if (!path) return '';
      return `${process.env.VUE_APP_API_URL}/${path}`;
    },
    async fetchProjects() {
      try {
        const token = localStorage.getItem('token');
        const headers = {
          'Authorization': `Bearer ${token}`
        };
        
        const response = await api.get('/api/social-projects', { headers });
        this.projects = response.data;
      } catch (error) {
        console.error('Ошибка при получении проектов:', error);
      }
    },
    editProject(project) {
      this.editingProject = project;
      this.projectForm = { ...project };
      this.showAddModal = true;
    },
    async deleteProject(id) {
      if (confirm('Вы уверены, что хотите удалить этот проект?')) {
        try {
          const token = localStorage.getItem('token');
          const headers = {
            'Authorization': `Bearer ${token}`
          };
          
          await api.delete(`/api/social-projects/${id}`, { headers });
          this.projects = this.projects.filter(project => project.id !== id);
        } catch (error) {
          console.error('Ошибка при удалении проекта:', error);
        }
      }
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.projectForm.img = file;
      }
    },
    async saveProject() {
      try {
        // Получаем токен авторизации
        const token = localStorage.getItem('token');
        const headers = {
          'Authorization': `Bearer ${token}`
        };

        // Создаем FormData для отправки данных
        const formData = new FormData();
        Object.keys(this.projectForm).forEach(key => {
          if (this.projectForm[key] !== null && this.projectForm[key] !== '') {
            formData.append(key, this.projectForm[key]);
          }
        });

        if (this.editingProject) {
          // Используем правильный endpoint и метод для редактирования
          await api.patch(`/api/social-projects/${this.editingProject.id}`, formData, { headers });
        } else {
          // Для создания нового проекта
          await api.post('/api/social-projects', formData, { headers });
        }

        await this.fetchProjects();
        this.closeModal();
      } catch (error) {
        console.error('Ошибка при сохранении проекта:', error);
      }
    },
    closeModal() {
      this.showAddModal = false;
      this.editingProject = null;
      this.projectForm = {
        name: '',
        description: '',
        img: null
      };
    }
  }
}
</script>

<style lang="scss" scoped>
.social-projects-manager {
  color: #fff;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  h2 {
    font-family: 'El Messiri', serif;
    font-size: 32px;
    color: #fff;
  }
}

.add-btn {
  background: #018ABE;
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
  
  &:hover {
    background: #0179a5;
  }
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.project-card {
  background: #1E3642;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
}

.project-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.project-info {
  padding: 1.5rem;
}

.project-title {
  font-family: 'El Messiri', serif;
  font-size: 24px;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.description {
  color: #ccc;
  margin-bottom: 1rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.project-actions {
  display: flex;
  gap: 1rem;
}

.edit-btn, .delete-btn {
  flex: 1;
  padding: 0.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.edit-btn {
  background: #018ABE;
  color: #fff;
  
  &:hover {
    background: #0179a5;
  }
}

.delete-btn {
  background: transparent;
  border: 1px solid #dc3545;
  color: #dc3545;
  
  &:hover {
    background: #dc3545;
    color: #fff;
  }
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #162831;
  padding: 2rem;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  
  h3 {
    color: #fff;
    font-family: 'El Messiri', serif;
    font-size: 24px;
    margin-bottom: 1.5rem;
  }
}

.current-image-container {
  margin-bottom: 15px;

  .current-image {
    width: 150px;
    height: 150px;
    object-fit: cover;
    border-radius: 8px;
    border: 2px solid #018ABE;
    margin-bottom: 8px;
  }

  p {
    font-size: 14px;
    color: #ccc;
    margin: 5px 0;
  }
}

.form-group {
  margin-bottom: 1.5rem;
  
  label {
    display: block;
    color: #fff;
    margin-bottom: 0.5rem;
    font-family: 'El Messiri', serif;
  }
  
  input, textarea {
    width: 100%;
    padding: 0.75rem;
    background: #1E3642;
    border: 1px solid #018ABE;
    border-radius: 6px;
    color: #fff;
    font-size: 14px;
    
    &:focus {
      outline: none;
      border-color: #0179a5;
    }
  }

  textarea {
    min-height: 100px;
    resize: vertical;
  }
}

.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  
  button {
    flex: 1;
    padding: 0.75rem;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
  }
  
  .save-btn {
    background: #018ABE;
    color: #fff;
    
    &:hover {
      background: #0179a5;
    }
  }
  
  .cancel-btn {
    background: transparent;
    border: 1px solid #018ABE;
    color: #018ABE;
    
    &:hover {
      background: #018ABE;
      color: #fff;
    }
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 1rem;
    
    .add-btn {
      width: 100%;
    }
  }
  
  .project-card {
    max-width: none;
  }
}
</style> 