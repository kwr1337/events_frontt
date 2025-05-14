<template>
  <div class="events-manager">
    <div class="page-header">
      <h2>Управление мероприятиями</h2>
      <div class="filters">
        <div class="filter-group">
          <select v-model="selectedDirection" class="direction-filter">
            <option value="">Все направления</option>
            <option v-for="direction in directions" :key="direction.id" :value="direction.id">
              {{ direction.name }}
            </option>
          </select>
        </div>
        <button @click="showAddModal = true" class="add-btn">
          Добавить мероприятие
        </button>
      </div>
    </div>

    <div class="events-grid">
      <div v-for="event in filteredEvents" :key="event.id" class="event-card">
        <img :src="getImageUrl(event.img)" :alt="event.name" class="event-image">
        <div class="event-info">
          <h3 class="event-title">{{ event.name }}</h3>
          <p class="description">{{ event.description }}</p>
          <div class="details">
            <p><strong>Направление:</strong> {{ getDirectionName(event.direction_id) }}</p>
            <p><strong>Место:</strong> {{ event.place || event.location }}</p>
            <p><strong>Дата:</strong> {{ event.formattedDate || event.date }}</p>
            <p v-if="event.formattedTime"><strong>Время:</strong> {{ event.formattedTime }}</p>
            <p><strong>Возраст:</strong> {{ event.age_limit }}</p>
          </div>
          <div class="event-actions">
            <button @click="editEvent(event)" class="edit-btn">
              Редактировать
            </button>
            <button @click="deleteEvent(event.id)" class="delete-btn">
              Удалить
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно для добавления/редактирования -->
    <div v-if="showAddModal" class="modal">
      <div class="modal-content">
        <h3>{{ editingEvent ? 'Редактировать' : 'Добавить' }} мероприятие</h3>
        <form @submit.prevent="saveEvent">
          <div class="form-group">
            <label>Направление</label>
            <select v-model="eventForm.direction_id" required>
              <option value="">Выберите направление</option>
              <option v-for="direction in directions" :key="direction.id" :value="direction.id">
                {{ direction.name }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Название</label>
            <input v-model="eventForm.name" required>
          </div>
          <div class="form-group">
            <label>Описание</label>
            <textarea v-model="eventForm.description" required></textarea>
          </div>
          <div class="form-group">
            <label>Дополнительное описание</label>
            <textarea v-model="eventForm.description2"></textarea>
          </div>
          <div class="form-group">
            <label>Место проведения</label>
            <input v-model="eventForm.place" required>
          </div>
          <div class="form-group">
            <label>Дата</label>
            <input type="date" v-model="eventForm.date" required>
          </div>
          <div class="form-group">
            <label>Время</label>
            <input type="time" v-model="eventForm.time" required>
          </div>
          <div class="form-group">
            <label>Возрастное ограничение</label>
            <input v-model="eventForm.age_limit" required>
          </div>
          <div class="form-group">
            <label>Ссылка на видео (Rutube)</label>
            <input v-model="eventForm.ref_video" placeholder="https://rutube.ru/video/123456789">
          </div>
          <div class="form-group">
            <label>Изображение</label>
            <div v-if="editingEvent && editingEvent.img" class="current-image-container">
              <img :src="getImageUrl(editingEvent.img)" alt="Текущее изображение" class="current-image">
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
  name: 'EventsManager',
  data() {
    return {
      events: [],
      directions: [],
      selectedDirection: '',
      showAddModal: false,
      editingEvent: null,
      eventForm: {
        direction_id: '',
        name: '',
        description: '',
        description2: '',
        place: '',
        date: '',
        time: '',
        age_limit: '',
        ref_video: '',
        img: null
      }
    }
  },
  computed: {
    filteredEvents() {
      if (!this.selectedDirection) return this.events;
      console.log('Выбранное направление:', this.selectedDirection);
      console.log('Тип выбранного направления:', typeof this.selectedDirection);
      const filtered = this.events.filter(event => {
        console.log('Проверяем мероприятие:', event.name);
        console.log('ID направления мероприятия:', event.direction_id);
        console.log('Тип ID направления мероприятия:', typeof event.direction_id);
        return Number(event.direction_id) === Number(this.selectedDirection);
      });
      console.log('Отфильтрованные мероприятия:', filtered);
      return filtered;
    }
  },
  created() {
    this.fetchEvents();
    this.fetchDirections();
  },
  methods: {
    getImageUrl(path) {
      if (!path) return '';
      return `${process.env.VUE_APP_API_URL}/${path}`;
    },
    getDirectionName(directionId) {
      const direction = this.directions.find(d => Number(d.id) === Number(directionId));
      return direction ? direction.name : '';
    },
    async fetchDirections() {
      try {
        const token = localStorage.getItem('token');
        const headers = {
          'Authorization': `Bearer ${token}`
        };
        
        const response = await api.get('/api/directions', { headers });
        this.directions = response.data;
        console.log('Загруженные направления:', this.directions);
      } catch (error) {
        console.error('Ошибка при получении направлений:', error);
      }
    },
    async fetchEvents() {
      try {
        const token = localStorage.getItem('token');
        const headers = {
          'Authorization': `Bearer ${token}`
        };
        
        const response = await api.get('/api/events', { headers });
        
        // Преобразуем данные для отображения
        this.events = response.data.map(event => {
          // Создаем копию события
          const processedEvent = { ...event };
          
          // Если у события есть поле directionId, добавляем его как direction_id для совместимости
          if (event.directionId !== undefined) {
            processedEvent.direction_id = event.directionId;
          }
          
          // Если у события есть поле location, добавляем его как place для отображения
          if (event.location !== undefined) {
            processedEvent.place = event.location;
          }
          
          // Если дата в формате ISO, форматируем ее для отображения
          if (event.date) {
            try {
              const dateObj = new Date(event.date);
              
              // Форматируем дату для отображения
              const options = { year: 'numeric', month: 'long', day: 'numeric' };
              processedEvent.formattedDate = dateObj.toLocaleDateString('ru-RU', options);
              
              // Добавляем отдельное поле с временем для отображения
              if (dateObj.getHours() || dateObj.getMinutes()) {
                processedEvent.formattedTime = dateObj.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
              }
            } catch (e) {
              console.error('Ошибка при форматировании даты:', e);
            }
          }
          
          return processedEvent;
        });
        
        console.log('Загруженные мероприятия:', this.events);
      } catch (error) {
        console.error('Ошибка при получении мероприятий:', error);
      }
    },
    editEvent(event) {
      this.editingEvent = event;
      
      // Создаем копию данных события для формы
      const formData = { ...event };
      
      // Обрабатываем дату и время
      if (formData.date) {
        // Попытка распарсить ISO дату
        try {
          const dateObj = new Date(formData.date);
          // Форматируем дату в формат YYYY-MM-DD для input type="date"
          formData.date = dateObj.toISOString().split('T')[0];
          
          // Извлекаем время из даты и форматируем для input type="time"
          const hours = dateObj.getHours().toString().padStart(2, '0');
          const minutes = dateObj.getMinutes().toString().padStart(2, '0');
          formData.time = `${hours}:${minutes}`;
        } catch (e) {
          console.error('Ошибка при обработке даты:', e);
          formData.date = '';
          formData.time = '';
        }
      }
      
      // Конвертируем поле location в place для формы
      if (formData.location) {
        formData.place = formData.location;
      }
      
      this.eventForm = formData;
      this.showAddModal = true;
    },
    async deleteEvent(id) {
      if (confirm('Вы уверены, что хотите удалить это мероприятие?')) {
        try {
          const token = localStorage.getItem('token');
          const headers = {
            'Authorization': `Bearer ${token}`
          };
          
          await api.delete(`/api/events/${id}`, { headers });
          this.events = this.events.filter(event => event.id !== id);
        } catch (error) {
          console.error('Ошибка при удалении мероприятия:', error);
        }
      }
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.eventForm.img = file;
      }
    },
    async saveEvent() {
      try {
        // Получаем токен авторизации
        const token = localStorage.getItem('token');
        const headers = {
          'Authorization': `Bearer ${token}`
        };

        // Создаем FormData для отправки данных
        const formData = new FormData();
        
        // Добавляем обязательные поля
        formData.append('name', this.eventForm.name);
        formData.append('description', this.eventForm.description);
        
        // Поле direction_id переименовываем в directionId для API
        formData.append('directionId', this.eventForm.direction_id);
        
        // Добавляем дополнительные поля, если они есть
        if (this.eventForm.description2) {
          formData.append('description2', this.eventForm.description2);
        }
        
        // Обрабатываем дату и время
        if (this.eventForm.date) {
          // Если есть время, добавляем его к дате
          const dateString = this.eventForm.date;
          const timeString = this.eventForm.time || '00:00';
          
          // Форматируем в ISO строку для API
          const dateTimeString = `${dateString}T${timeString}:00`;
          formData.append('date', dateTimeString);
        }
        
        // Переименовываем place в location для API
        if (this.eventForm.place) {
          formData.append('location', this.eventForm.place);
        }
        
        if (this.eventForm.age_limit) {
          formData.append('age_limit', this.eventForm.age_limit);
        }
        
        if (this.eventForm.ref_video) {
          formData.append('ref_video', this.eventForm.ref_video);
        }
        
        // Обрабатываем изображение
        if (this.eventForm.img && this.eventForm.img instanceof File) {
          formData.append('img', this.eventForm.img);
        }

        console.log('Отправляемые данные:', {
          name: this.eventForm.name,
          description: this.eventForm.description,
          directionId: this.eventForm.direction_id,
          date: this.eventForm.date ? `${this.eventForm.date}T${this.eventForm.time || '00:00'}:00` : null,
          location: this.eventForm.place,
          age_limit: this.eventForm.age_limit,
          ref_video: this.eventForm.ref_video
        });

        let response;
        if (this.editingEvent) {
          // Используем PATCH для обновления
          response = await api.patch(`/api/events/${this.editingEvent.id}`, formData, { headers });
          console.log('Мероприятие обновлено:', response.data);
        } else {
          // Используем POST для создания нового
          response = await api.post('/api/events', formData, { headers });
          console.log('Мероприятие создано:', response.data);
        }

        await this.fetchEvents();
        this.closeModal();
      } catch (error) {
        console.error('Ошибка при сохранении мероприятия:', error);
        if (error.response) {
          console.error('Ответ сервера:', error.response.data);
        }
      }
    },
    closeModal() {
      this.showAddModal = false;
      this.editingEvent = null;
      this.eventForm = {
        direction_id: '',
        name: '',
        description: '',
        description2: '',
        place: '',
        date: '',
        time: '',
        age_limit: '',
        ref_video: '',
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
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
  
  h2 {
    font-family: 'El Messiri', serif;
    font-size: 32px;
    color: #fff;
    margin: 0;
  }
}

.filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.filter-group {
  flex: 1;
  max-width: 300px;
}

.direction-filter {
  width: 100%;
  padding: 0.75rem;
  background: #1E3642;
  border: 1px solid #018ABE;
  border-radius: 6px;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #0179a5;
  }
  
  option {
    background: #1E3642;
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
  white-space: nowrap;
  
  &:hover {
    background: #0179a5;
  }
}

.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.event-card {
  background: #1E3642;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
}

.event-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.event-info {
  padding: 1.5rem;
}

.event-title {
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

.details {
  margin-bottom: 1.5rem;
  
  p {
    margin: 0.5rem 0;
    color: #ccc;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 0.5rem;
    
    strong {
      color: #fff;
      white-space: nowrap;
    }
  }
}

.event-actions {
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
  
  input, select, textarea {
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

  select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23fff' viewBox='0 0 16 16'%3E%3Cpath d='M8 11.5l-6-6h12z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
    padding-right: 2rem;
    
    option {
      background: #1E3642;
      color: #fff;
    }
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
  .filters {
    flex-direction: column;
  }
  
  .filter-group {
    max-width: 100%;
  }
  
  .add-btn {
    width: 100%;
  }
  
  .event-card {
    max-width: none;
  }
}
</style> 