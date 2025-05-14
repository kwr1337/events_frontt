<template>
  <div class="events-manager">
    <div class="page-header">
      <h2>Управление направлениями</h2>
      <button @click="showDirectionModal(null)" class="add-btn">
        Добавить направление
      </button>
    </div>

    <!-- Список направлений -->
    <div class="directions-list">
      <div class="direction-items">
        <div v-for="direction in directions" :key="direction.id" class="direction-item">
          <div class="direction-card">
            <img :src="getImageUrl(direction.img)" :alt="direction.name" class="direction-image">
            <div class="direction-overlay"></div>
            <div class="direction-info">
              <h5 class="direction-name">{{ direction.name }}</h5>
              <div class="direction-actions">
                <button @click="showDirectionModal(direction)" class="edit-btn">
                  Редактировать
                </button>
                <button @click="showEvents(direction)" class="events-btn">
                  Мероприятия
                </button>
                <button @click="deleteDirection(direction.id)" class="delete-btn">
                  Удалить
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно для добавления/редактирования направления -->
    <div v-if="showDirectionFormModal" class="modal">
      <div class="modal-content">
        <h3>{{ isEditing ? 'Редактировать' : 'Добавить' }} направление</h3>
        <form @submit.prevent="handleSubmit" class="admin-form">
          <div class="form-group">
            <label>Название</label>
            <input v-model="formData.name" type="text" required>
          </div>
          <div class="form-group">
            <label>Описание</label>
            <textarea v-model="formData.description" rows="4"></textarea>
          </div>
          <div class="form-group">
            <label>Изображение</label>
            <div v-if="isEditing && selectedDirection?.img" class="current-image-container">
              <img :src="getImageUrl(selectedDirection.img)" alt="Текущее изображение" class="current-image">
              <p>Текущее изображение</p>
            </div>
            <input @change="handleImageChange" type="file" accept="image/*">
            <small>Выберите новое изображение, чтобы заменить текущее</small>
          </div>
          <div class="modal-actions">
            <button type="submit" class="save-btn">{{ isEditing ? 'Сохранить' : 'Добавить' }}</button>
            <button type="button" @click="closeDirectionModal" class="cancel-btn">Отмена</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Модальное окно для просмотра мероприятий -->
    <div v-if="showEventsModal" class="modal">
      <div class="modal-content">
        <Title>Мероприятия {{ selectedDirection?.name }}</Title>
        
        <!-- Форма редактирования мероприятия -->
        <div v-if="isEditingEvent" class="event-edit-form">
          <h4>Редактировать мероприятие</h4>
          <form @submit.prevent="handleEventSubmit" class="admin-form">
            <div class="form-group">
              <label>Название:</label>
              <input v-model="eventForm.name" type="text" required>
            </div>
            <div class="form-group">
              <label>Описание:</label>
              <textarea v-model="eventForm.description" required></textarea>
            </div>
            <div class="form-group">
              <label>Дополнительное описание:</label>
              <textarea v-model="eventForm.description2"></textarea>
            </div>
            <div class="form-group">
              <label>Место проведения:</label>
              <input v-model="eventForm.place" type="text" required>
            </div>
            <div class="form-group">
              <label>Дата:</label>
              <input v-model="eventForm.date" type="date" required>
            </div>
            <div class="form-group">
              <label>Возрастное ограничение:</label>
              <input v-model="eventForm.age_limit" type="text" required>
            </div>
            <div class="form-group">
              <label>Ссылка на видео:</label>
              <input v-model="eventForm.ref_video" type="url">
            </div>
            <div class="form-group">
              <label>Ссылка на покупку:</label>
              <input v-model="eventForm.ref_buy" type="url">
            </div>
            <div class="form-group">
              <label>Цена:</label>
              <input v-model="eventForm.price" type="text" required>
            </div>
            <div class="form-group">
              <label>Изображение:</label>
              <div v-if="isEditingEvent && eventForm.id" class="current-image-container">
                <img :src="getImageUrl(events.find(e => e.id === eventForm.id)?.img)" alt="Текущее изображение" class="current-image">
                <p>Текущее изображение</p>
              </div>
              <input @change="handleEventImageChange" type="file" accept="image/*">
              <small>Выберите новое изображение, чтобы заменить текущее</small>
            </div>
            <div class="button-group">
              <MyButton type="submit">Сохранить</MyButton>
              <MyButton @click="cancelEventEdit" type="button">Отмена</MyButton>
            </div>
          </form>
        </div>

        <!-- Список мероприятий -->
        <div v-else class="events-list">
          <div v-for="event in events" :key="event.id" class="event-item">
            <img :src="getImageUrl(event.img)" :alt="event.name" class="event-thumbnail">
            <div class="event-info">
              <h5>{{ event.name }}</h5>
              <p>{{ event.description }}</p>
              <div class="event-details">
                <p><strong>Место:</strong> {{ event.place }}</p>
                <p><strong>Дата:</strong> {{ event.date }}</p>
                <p><strong>Возраст:</strong> {{ event.age_limit }}</p>
              </div>
              <div class="event-actions">
                <MyButton @click="editEvent(event)" class="edit-btn">Редактировать</MyButton>
                <MyButton @click="deleteEvent(event.id)" class="delete-btn">Удалить</MyButton>
              </div>
            </div>
          </div>
        </div>

        <MyButton @click="closeEventsModal" class="close-btn">Закрыть</MyButton>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api/axios';
import Title from "@/components/UI/Title.vue";
import MyButton from "@/components/UI/MyButton.vue";

export default {
  name: 'DirectionsManager',
  components: {
    Title,
    MyButton
  },
  data() {
    return {
      directions: [],
      events: [],
      showEventsModal: false,
      showDirectionFormModal: false,
      selectedDirection: null,
      isEditing: false,
      isEditingEvent: false,
      formData: {
        name: '',
        description: '',
        img: null
      },
      eventForm: {
        name: '',
        description: '',
        description2: '',
        place: '',
        date: '',
        age_limit: '',
        ref_video: '',
        ref_buy: '',
        price: '',
        img: null
      }
    }
  },
  async created() {
    await this.fetchDirections();
  },
  methods: {
    getImageUrl(path) {
      if (!path) return '';
      return `${process.env.VUE_APP_API_URL}/${path}`;
    },
    async fetchDirections() {
      try {
        const token = localStorage.getItem('token');
        const headers = {
          'Authorization': `Bearer ${token}`
        };
        
        const response = await api.get('/api/directions', { headers });
        this.directions = response.data;
      } catch (error) {
        console.error('Ошибка при получении направлений:', error);
      }
    },
    handleImageChange(event) {
      this.formData.img = event.target.files[0];
    },
    async handleSubmit() {
      try {
        // Получаем токен авторизации
        const token = localStorage.getItem('token');
        const headers = {
          'Authorization': `Bearer ${token}`
        };

        // Создаем FormData для отправки данных
        const formData = new FormData();
        formData.append('name', this.formData.name);
        formData.append('description', this.formData.description);
        if (this.formData.img) {
          formData.append('img', this.formData.img);
        }

        if (this.isEditing) {
          // Используем правильный endpoint и метод для редактирования
          await api.patch(`/api/directions/${this.selectedDirection.id}`, formData, { headers });
        } else {
          // Для создания нового направления
          await api.post('/api/directions', formData, { headers });
        }

        await this.fetchDirections();
        this.closeDirectionModal();
      } catch (error) {
        console.error('Ошибка при сохранении направления:', error);
      }
    },
    async deleteDirection(id) {
      if (confirm('Вы уверены, что хотите удалить это направление?')) {
        try {
          const token = localStorage.getItem('token');
          const headers = {
            'Authorization': `Bearer ${token}`
          };
          
          await api.delete(`/api/directions/${id}`, { headers });
          await this.fetchDirections();
        } catch (error) {
          console.error('Ошибка при удалении направления:', error);
        }
      }
    },
    async deleteEvent(id) {
      if (confirm('Вы уверены, что хотите удалить это мероприятие?')) {
        try {
          const token = localStorage.getItem('token');
          const headers = {
            'Authorization': `Bearer ${token}`
          };
          
          await api.delete(`/api/events/${id}`, { headers });
          await this.fetchEvents();
        } catch (error) {
          console.error('Ошибка при удалении мероприятия:', error);
        }
      }
    },
    showDirectionModal(direction) {
      this.showDirectionFormModal = true;
      if (direction) {
        this.isEditing = true;
        this.selectedDirection = direction;
        this.formData = {
          name: direction.name,
          description: direction.description,
          img: null
        };
      } else {
        this.isEditing = false;
        this.selectedDirection = null;
        this.formData = {
          name: '',
          description: '',
          img: null
        };
      }
    },
    closeDirectionModal() {
      this.showDirectionFormModal = false;
      this.isEditing = false;
      this.selectedDirection = null;
      this.formData = {
        name: '',
        description: '',
        img: null
      };
    },
    editDirection(direction) {
      this.showDirectionModal(direction);
    },
    async showEvents(direction) {
      this.selectedDirection = direction;
      this.showEventsModal = true;
      await this.fetchEvents();
    },
    async fetchEvents() {
      try {
        const token = localStorage.getItem('token');
        const headers = {
          'Authorization': `Bearer ${token}`
        };
        
        const response = await api.get(`/api/directions/${this.selectedDirection.id}`, { headers });
        this.events = response.data.events;
      } catch (error) {
        console.error('Ошибка при получении мероприятий:', error);
      }
    },
    handleEventImageChange(event) {
      this.eventForm.img = event.target.files[0];
    },
    async handleEventSubmit() {
      try {
        // Получаем токен авторизации
        const token = localStorage.getItem('token');
        const headers = {
          'Authorization': `Bearer ${token}`
        };

        // Создаем FormData для отправки данных
        const formData = new FormData();
        Object.keys(this.eventForm).forEach(key => {
          if (this.eventForm[key] !== null && this.eventForm[key] !== '') {
            formData.append(key, this.eventForm[key]);
          }
        });

        if (this.isEditingEvent) {
          // Используем правильный endpoint и метод для редактирования события
          await api.patch(`/api/events/${this.eventForm.id}`, formData, { headers });
        } else {
          // Для создания нового события
          formData.append('direction_id', this.selectedDirection.id);
          await api.post('/api/events', formData, { headers });
        }

        await this.fetchEvents();
        this.cancelEventEdit();
      } catch (error) {
        console.error('Ошибка при сохранении мероприятия:', error);
      }
    },
    editEvent(event) {
      this.isEditingEvent = true;
      this.eventForm = { ...event, img: null };
    },
    cancelEventEdit() {
      this.isEditingEvent = false;
      this.eventForm = {
        name: '',
        description: '',
        description2: '',
        place: '',
        date: '',
        age_limit: '',
        ref_video: '',
        ref_buy: '',
        price: '',
        img: null
      };
    },
    closeEventsModal() {
      this.showEventsModal = false;
      this.selectedDirection = null;
      this.events = [];
      this.isEditingEvent = false;
      this.eventForm = {
        name: '',
        description: '',
        description2: '',
        place: '',
        date: '',
        age_limit: '',
        ref_video: '',
        ref_buy: '',
        price: '',
        img: null
      };
    }
  }
}
</script>

<style lang="scss" scoped>
.events-manager {
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

.directions-list {
  margin-top: 2rem;
}

.direction-items {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(416px, 1fr));
  gap: 2rem;
}

.direction-card {
  width: 100%;
  height: 258px;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
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
    background: linear-gradient(to bottom, rgba(22, 40, 49, 0), rgba(22, 40, 49, 0.9));
    z-index: 1;
  }

  .direction-info {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 20px 40px;
    z-index: 2;
  }

  .direction-name {
    color: #fff;
    font-family: 'El Messiri', serif;
    font-size: 24px;
    font-weight: 300;
    line-height: 140%;
    margin-bottom: 1rem;
  }

  .direction-actions {
    display: flex;
    gap: 1rem;

    button {
      flex: 1;
      padding: 0.5rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 14px;
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

    .events-btn {
      background: #28a745;
      color: #fff;
      
      &:hover {
        background: #218838;
      }
    }
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
    color: #fff;
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

  input[type="file"] {
    padding: 0.5rem;
    border: 1px dashed #018ABE;
    background: transparent;
    cursor: pointer;

    &::-webkit-file-upload-button {
      visibility: hidden;
      display: none;
    }

    &::before {
      content: 'Выберите файл';
      display: inline-block;
      background: #018ABE;
      color: #fff;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      margin-right: 0.5rem;
      cursor: pointer;
    }

    &:hover::before {
      background: #0179a5;
    }
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
  font-size: 16px;
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

.events-list {
  margin-top: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.event-item {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  overflow: hidden;
}

.event-thumbnail {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.event-info {
  padding: 1.5rem;

  h5 {
    font-family: El Messiri, serif;
    font-size: 20px;
    margin-bottom: 1rem;
  }

  p {
    margin-bottom: 1rem;
    color: rgba(255, 255, 255, 0.8);
  }
}

.event-details {
  margin: 1rem 0;
  
  p {
    margin: 0.5rem 0;
    font-size: 14px;
  }
}

.event-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.close-btn {
  margin-top: 2rem;
}

.event-edit-form {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 2rem;
  margin-bottom: 2rem;

  h4 {
    font-family: El Messiri, serif;
    font-size: 20px;
    margin-bottom: 1.5rem;
  }
}

textarea {
  min-height: 100px;
  resize: vertical;
  width: 100%;
  padding: 0.75rem;
  background: #162831;
  border: 1px solid #018ABE;
  border-radius: 6px;
  color: #fff;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: #0179a5;
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

  .direction-items {
    grid-template-columns: 1fr;
  }

  .direction-card {
    width: 100%;
  }
}
</style> 