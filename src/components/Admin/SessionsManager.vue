<template>
  <div class="sessions-manager">
    <div class="page-header">
      <h2>Управление сеансами</h2>
      <button @click="showAddModal = true" class="add-btn">
        Добавить сеанс
      </button>
    </div>

    <div class="sessions-grid">
      <div v-for="session in sessions" :key="session.id" class="session-card">
        <img :src="getImageUrl(session.img)" :alt="session.name" class="session-image">
        <div class="session-info">
          <h3>{{ session.name }}</h3>
          <p class="description">{{ session.description }}</p>
          <div class="details">
            <p><strong>Тренер:</strong> {{ session.trainer }}</p>
            <p><strong>Длительность:</strong> {{ session.duration }}</p>
            <p><strong>Цена:</strong> {{ session.price }}</p>
          </div>
          <div class="session-actions">
            <button @click="editSession(session)" class="edit-btn">
              Редактировать
            </button>
            <button @click="deleteSession(session.id)" class="delete-btn">
              Удалить
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно для добавления/редактирования -->
    <div v-if="showAddModal" class="modal">
      <div class="modal-content">
        <h3>{{ editingSession ? 'Редактировать' : 'Добавить' }} сеанс</h3>
        <form @submit.prevent="saveSession">
          <div class="form-group">
            <label>Название</label>
            <input v-model="sessionForm.name" required>
          </div>
          <div class="form-group">
            <label>Описание</label>
            <textarea v-model="sessionForm.description" required></textarea>
          </div>
          <div class="form-group">
            <label>Тренер</label>
            <input v-model="sessionForm.trainer" required>
          </div>
          <div class="form-group">
            <label>Длительность (минут)</label>
            <input type="number" v-model="sessionForm.duration" required>
          </div>
          <div class="form-group">
            <label>Цена</label>
            <input type="number" v-model="sessionForm.price" required>
          </div>
          <div class="form-group">
            <label>Изображение</label>
            <input type="file" @change="handleImageUpload" accept="image/*">
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
  name: 'SessionsManager',
  data() {
    return {
      sessions: [],
      showAddModal: false,
      editingSession: null,
      sessionForm: {
        name: '',
        description: '',
        trainer: '',
        duration: '',
        price: '',
        img: null
      }
    }
  },
  created() {
    this.fetchSessions();
  },
  methods: {
    getImageUrl(path) {
      if (!path) return '';
      return `${process.env.VUE_APP_API_URL}/${path}`;
    },
    async fetchSessions() {
      try {
        const response = await api.get('/api/sessions');
        this.sessions = response.data;
      } catch (error) {
        console.error('Ошибка при получении сеансов:', error);
      }
    },
    editSession(session) {
      this.editingSession = session;
      this.sessionForm = { ...session };
      this.showAddModal = true;
    },
    async deleteSession(id) {
      if (confirm('Вы уверены, что хотите удалить этот сеанс?')) {
        try {
          await api.delete(`/api/sessions/${id}`);
          this.sessions = this.sessions.filter(session => session.id !== id);
        } catch (error) {
          console.error('Ошибка при удалении сеанса:', error);
        }
      }
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.sessionForm.img = file;
      }
    },
    async saveSession() {
      try {
        const formData = new FormData();
        Object.keys(this.sessionForm).forEach(key => {
          if (this.sessionForm[key] !== null) {
            formData.append(key, this.sessionForm[key]);
          }
        });

        if (this.editingSession) {
          await api.put(`/api/sessions/${this.editingSession.id}`, formData);
        } else {
          await api.post('/api/sessions', formData);
        }

        await this.fetchSessions();
        this.closeModal();
      } catch (error) {
        console.error('Ошибка при сохранении сеанса:', error);
      }
    },
    closeModal() {
      this.showAddModal = false;
      this.editingSession = null;
      this.sessionForm = {
        name: '',
        description: '',
        trainer: '',
        duration: '',
        price: '',
        img: null
      };
    }
  }
}
</script>

<style lang="scss" scoped>
.sessions-manager {
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

.sessions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.session-card {
  background: #1E3642;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
}

.session-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.session-info {
  padding: 1.5rem;
  
  h3 {
    font-family: 'El Messiri', serif;
    font-size: 24px;
    margin-bottom: 1rem;
  }
}

.description {
  color: #ccc;
  margin-bottom: 1rem;
  line-height: 1.4;
}

.details {
  margin-bottom: 1.5rem;
  
  p {
    margin: 0.5rem 0;
    color: #ccc;
    
    strong {
      color: #fff;
    }
  }
}

.session-actions {
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
  background: rgba(22, 40, 49, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #1E3642;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  
  h3 {
    font-family: 'El Messiri', serif;
    font-size: 24px;
    margin-bottom: 1.5rem;
  }
}

.form-group {
  margin-bottom: 1rem;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    color: #ccc;
  }
  
  input, textarea {
    width: 100%;
    padding: 0.75rem;
    background: #162831;
    border: 1px solid #018ABE;
    border-radius: 6px;
    color: #fff;
    
    &:focus {
      outline: none;
      border-color: #0179a5;
    }
  }
  
  textarea {
    height: 100px;
    resize: vertical;
  }
}

.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.save-btn, .cancel-btn {
  flex: 1;
  padding: 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.save-btn {
  background: #018ABE;
  color: #fff;
  border: none;
  
  &:hover {
    background: #0179a5;
  }
}

.cancel-btn {
  background: transparent;
  border: 1px solid #ccc;
  color: #ccc;
  
  &:hover {
    background: #ccc;
    color: #162831;
  }
}
</style> 