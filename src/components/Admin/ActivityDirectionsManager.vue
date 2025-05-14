<template>
  <div class="activity-manager">
    <div class="page-header">
      <h2>Управление направлениями активности</h2>
      <button @click="showModal(null)" class="add-btn">
        Добавить направление
      </button>
    </div>

    <!-- Список направлений -->
    <div class="directions-list">
      <div class="direction-items">
        <div v-for="direction in directions" :key="direction.id" class="direction-item">
          <div class="direction-card">
            <img :src="getImageUrl(direction.mainImage)" :alt="direction.name" class="direction-image">
            <div class="direction-overlay"></div>
            <div class="direction-info">
              <h5 class="direction-name">{{ direction.name }}</h5>
              <div class="direction-actions">
                <button @click="showModal(direction)" class="edit-btn">
                  Редактировать
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

    <!-- Модальное окно для добавления/редактирования -->
    <div v-if="showFormModal" class="modal">
      <div class="modal-content">
        <h3>{{ isEditing ? 'Редактировать' : 'Добавить' }} направление активности</h3>
        <form @submit.prevent="handleSubmit" class="admin-form">
          <div class="form-group">
            <label>Название</label>
            <input v-model="formData.name" type="text" required>
          </div>
          <div class="form-group">
            <label>Описание</label>
            <textarea v-model="formData.description" rows="4" required></textarea>
          </div>
          <div class="form-group">
            <label>Дополнительное описание</label>
            <textarea v-model="formData.description2" rows="4" placeholder="Необязательное дополнительное описание"></textarea>
          </div>
          <div class="form-group">
            <label>Расписание занятий</label>
            <div class="schedule-editor">
              <div class="day-tabs">
                <button 
                  v-for="day in daysOfWeek" 
                  :key="day.value" 
                  @click="selectDay(day.value)" 
                  :class="['day-tab', { active: selectedDay === day.value }]"
                  type="button"
                >
                  {{ day.label }}
                </button>
              </div>
              
              <div class="time-slots">
                <div v-if="selectedDay">
                  <div v-if="scheduleData[selectedDay].length === 0" class="no-slots">
                    Нет занятий в этот день
                  </div>
                  
                  <div 
                    v-for="(slot, index) in scheduleData[selectedDay]" 
                    :key="index" 
                    class="time-slot"
                  >
                    <div class="time-inputs">
                      <input 
                        type="time" 
                        v-model="slot.start" 
                        placeholder="Начало" 
                        class="time-input"
                      >
                      <span class="time-separator">—</span>
                      <input 
                        type="time" 
                        v-model="slot.end" 
                        placeholder="Конец" 
                        class="time-input"
                      >
                    </div>
                    
                    <input 
                      type="text" 
                      v-model="slot.title" 
                      placeholder="Название занятия" 
                      class="title-input"
                    >
                    
                    <button 
                      @click="removeTimeSlot(index)" 
                      class="remove-slot-btn" 
                      type="button"
                    >
                      ×
                    </button>
                  </div>
                  
                  <button 
                    @click="addTimeSlot()" 
                    class="add-slot-btn" 
                    type="button"
                  >
                    + Добавить время
                  </button>
                </div>
              </div>
            </div>
            <small class="schedule-helper">Выберите день недели и укажите время занятий</small>
          </div>
          <div class="form-group">
            <label>Ссылка на видео</label>
            <input v-model="formData.videoLink" type="url" placeholder="https://youtube.com/...">
          </div>
          
          <!-- Главное изображение -->
          <div class="form-group">
            <label>Главное изображение</label>
            <div v-if="isEditing && selectedDirection.mainImage" class="current-main-image">
              <img :src="getImageUrl(selectedDirection.mainImage)" alt="Главное изображение">
            </div>
            <input @change="handleMainImageChange" type="file" accept="image/*" :required="!isEditing">
          </div>
          
          <!-- Дополнительные изображения -->
          <div class="form-group">
            <label>Дополнительные изображения</label>
            
            <!-- Существующие изображения -->
            <div v-if="isEditing && selectedDirection.images && selectedDirection.images.length > 0" class="current-images">
              <div 
                v-for="(image, index) in selectedDirection.images" 
                :key="index" 
                class="image-item"
                :class="{ 'marked-for-deletion': isImageMarkedForDeletion(image) }"
              >
                <img :src="getImageUrl(image)" :alt="`Изображение ${index + 1}`">
                <button 
                  type="button" 
                  @click="toggleImageForDeletion(image)" 
                  class="image-action-btn"
                  :class="isImageMarkedForDeletion(image) ? 'restore-image-btn' : 'delete-image-btn'"
                >
                  {{ isImageMarkedForDeletion(image) ? '↺' : '×' }}
                </button>
              </div>
            </div>
            
            <!-- Добавление новых изображений -->
            <input @change="handleImagesChange" type="file" accept="image/*" multiple>
          </div>
          
          <div class="modal-actions">
            <button type="submit" class="save-btn">{{ isEditing ? 'Сохранить' : 'Добавить' }}</button>
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
  name: 'ActivityDirectionsManager',
  data() {
    return {
      directions: [],
      showFormModal: false,
      selectedDirection: null,
      isEditing: false,
      formData: {
        name: '',
        description: '',
        description2: '',
        schedule: '',
        videoLink: '',
        mainImage: null,
        images: []
      },
      imagesToDelete: [],
      // Данные для редактора расписания
      selectedDay: 'monday',
      scheduleData: {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: []
      },
      daysOfWeek: [
        { value: 'monday', label: 'Пн' },
        { value: 'tuesday', label: 'Вт' },
        { value: 'wednesday', label: 'Ср' },
        { value: 'thursday', label: 'Чт' },
        { value: 'friday', label: 'Пт' },
        { value: 'saturday', label: 'Сб' },
        { value: 'sunday', label: 'Вс' },
      ]
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
    getAuthHeaders() {
      const token = localStorage.getItem('token');
      return {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
    },
    async fetchDirections() {
      try {
        const response = await api.get('/api/activity-directions', this.getAuthHeaders());
        this.directions = response.data;
      } catch (error) {
        console.error('Ошибка при получении направлений:', error);
      }
    },
    handleMainImageChange(event) {
      this.formData.mainImage = event.target.files[0];
    },
    handleImagesChange(event) {
      this.formData.images = Array.from(event.target.files);
    },
    isImageMarkedForDeletion(image) {
      return this.imagesToDelete.includes(image);
    },
    toggleImageForDeletion(image) {
      // Если изображение уже помечено для удаления - отменяем удаление
      const index = this.imagesToDelete.indexOf(image);
      if (index !== -1) {
        this.imagesToDelete.splice(index, 1);
      } else {
        // Иначе - помечаем для удаления
        this.imagesToDelete.push(image);
      }
    },
    async handleSubmit() {
      try {
        // Валидация расписания
        if (!this.validateScheduleData()) {
          alert('Пожалуйста, заполните все поля времени или удалите пустые слоты.');
          return;
        }
        
        const token = localStorage.getItem('token');
        const headers = {
          'Authorization': `Bearer ${token}`
        };
        
        // Подготовка и преобразование расписания в JSON
        const cleanedSchedule = this.prepareScheduleForJSON();
        const scheduleJSON = JSON.stringify(cleanedSchedule);
        
        // 1. Обновляем основные данные направления (без новых изображений)
        const formData = new FormData();
        formData.append('name', this.formData.name);
        formData.append('description', this.formData.description);
        formData.append('description2', this.formData.description2);
        formData.append('schedule', scheduleJSON);
        
        // Логирование для отладки
        console.log('Отправляемое расписание:', scheduleJSON);
        
        if (this.formData.videoLink) {
          formData.append('videoLink', this.formData.videoLink);
        }
        
        if (this.formData.mainImage) {
          formData.append('mainImage', this.formData.mainImage);
        }

        let updatedDirectionId;
        
        if (this.isEditing) {
          // Обновляем существующее направление
          const response = await api.patch(
            `/api/activity-directions/${this.selectedDirection.id}`, 
            formData, 
            { headers }
          );
          updatedDirectionId = this.selectedDirection.id;
          
          // 2. Удаляем помеченные изображения
          if (this.imagesToDelete.length > 0) {
            for (const image of this.imagesToDelete) {
              try {
                await api.delete(`/api/activity-directions/${updatedDirectionId}/image`, {
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                  },
                  data: { imageFileName: image }
                });
              } catch (error) {
                console.error('Ошибка при удалении изображения:', error);
              }
            }
          }
          
          // 3. Добавляем новые изображения отдельным запросом
          if (this.formData.images.length > 0) {
            const imagesFormData = new FormData();
            this.formData.images.forEach(image => {
              imagesFormData.append('images', image);
            });
            
            try {
              await api.post(
                `/api/activity-directions/${updatedDirectionId}/images`, 
                imagesFormData, 
                { headers }
              );
            } catch (error) {
              console.error('Ошибка при добавлении изображений:', error);
            }
          }
        } else {
          // Создаем новое направление
          const response = await api.post('/api/activity-directions', formData, { headers });
          updatedDirectionId = response.data.id;
          
          // Добавляем изображения к новому направлению
          if (this.formData.images.length > 0 && updatedDirectionId) {
            const imagesFormData = new FormData();
            this.formData.images.forEach(image => {
              imagesFormData.append('images', image);
            });
            
            try {
              await api.post(
                `/api/activity-directions/${updatedDirectionId}/images`, 
                imagesFormData, 
                { headers }
              );
            } catch (error) {
              console.error('Ошибка при добавлении изображений к новому направлению:', error);
            }
          }
        }

        // Обновляем список направлений
        await this.fetchDirections();
        this.closeModal();
      } catch (error) {
        console.error('Ошибка при сохранении направления:', error);
      }
    },
    async deleteDirection(id) {
      if (confirm('Вы уверены, что хотите удалить это направление?')) {
        try {
          await api.delete(`/api/activity-directions/${id}`, this.getAuthHeaders());
          await this.fetchDirections();
        } catch (error) {
          console.error('Ошибка при удалении направления:', error);
        }
      }
    },
    showModal(direction) {
      this.showFormModal = true;
      this.imagesToDelete = [];
      
      // Сбросить расписание
      this.resetScheduleData();
      
      if (direction) {
        this.isEditing = true;
        this.selectedDirection = JSON.parse(JSON.stringify(direction)); // Создаем копию объекта
        this.formData = {
          name: direction.name,
          description: direction.description,
          description2: direction.description2 || '',
          schedule: direction.schedule,
          videoLink: direction.videoLink || '',
          mainImage: null,
          images: []
        };
        
        // Загружаем расписание, если оно есть
        if (direction.schedule) {
          try {
            // Проверяем тип данных schedule
            let scheduleObj;
            if (typeof direction.schedule === 'string') {
              // Если строка, пытаемся распарсить JSON
              scheduleObj = JSON.parse(direction.schedule);
            } else if (typeof direction.schedule === 'object') {
              // Если уже объект, используем как есть
              scheduleObj = direction.schedule;
            } else {
              // Другие типы - пустой объект
              scheduleObj = {};
            }
            
            for (const day in scheduleObj) {
              if (Array.isArray(scheduleObj[day])) {
                this.scheduleData[day] = scheduleObj[day].map(slot => ({
                  start: this.formatTimeForInput(slot.start),
                  end: this.formatTimeForInput(slot.end),
                  title: slot.title || ''
                }));
              }
            }
          } catch (error) {
            console.error('Ошибка при парсинге расписания:', error);
          }
        }
      } else {
        this.isEditing = false;
        this.selectedDirection = null;
        this.formData = {
          name: '',
          description: '',
          description2: '',
          schedule: '',
          videoLink: '',
          mainImage: null,
          images: []
        };
      }
    },
    closeModal() {
      this.showFormModal = false;
      this.isEditing = false;
      this.selectedDirection = null;
      this.formData = {
        name: '',
        description: '',
        description2: '',
        schedule: '',
        videoLink: '',
        mainImage: null,
        images: []
      };
      this.imagesToDelete = [];
      this.resetScheduleData();
    },
    // Методы для редактора расписания
    resetScheduleData() {
      this.selectedDay = 'monday';
      this.scheduleData = {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: []
      };
    },
    selectDay(day) {
      this.selectedDay = day;
    },
    addTimeSlot() {
      this.scheduleData[this.selectedDay].push({
        start: '',
        end: '',
        title: ''
      });
    },
    removeTimeSlot(index) {
      this.scheduleData[this.selectedDay].splice(index, 1);
    },
    // Преобразование времени из формата "HH:MM" в формат для input type="time"
    formatTimeForInput(timeString) {
      if (!timeString) return '';
      // Если уже в правильном формате, возвращаем как есть
      if (timeString.match(/^\d{2}:\d{2}$/)) return timeString;
      
      try {
        // Для формата "HH:MM:SS" или других форматов
        const timeParts = timeString.split(':');
        return `${timeParts[0].padStart(2, '0')}:${timeParts[1].padStart(2, '0')}`;
      } catch (error) {
        console.error('Ошибка при форматировании времени:', error);
        return '';
      }
    },
    // Валидация расписания перед отправкой
    validateScheduleData() {
      let isValid = true;
      
      // Проверяем каждый день
      for (const day in this.scheduleData) {
        // Проверяем каждый временной слот
        for (const slot of this.scheduleData[day]) {
          // Проверяем, что все поля заполнены
          if (!slot.start || !slot.end) {
            isValid = false;
            console.warn('Недопустимый слот расписания:', slot);
            break;
          }
        }
        if (!isValid) break;
      }
      
      return isValid;
    },
    // Подготовка расписания для JSON (удаляем пустые дни)
    prepareScheduleForJSON() {
      const cleanedSchedule = {};
      
      for (const day in this.scheduleData) {
        // Если в этот день есть хотя бы один слот с заполненным временем,
        // добавляем день в очищенное расписание
        if (this.scheduleData[day].length > 0) {
          cleanedSchedule[day] = [...this.scheduleData[day]];
        } else {
          // Для пустых дней добавляем пустой массив
          cleanedSchedule[day] = [];
        }
      }
      
      return cleanedSchedule;
    },
  }
}
</script>

<style lang="scss" scoped>
.activity-manager {
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

/* Стили для редактора расписания */
.schedule-editor {
  background: #162831;
  border: 1px solid #018ABE;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 10px;
}

.day-tabs {
  display: flex;
  background: #1A3541;
  border-bottom: 1px solid #018ABE;
  overflow-x: auto;
  
  &::-webkit-scrollbar {
    height: 3px;
  }
  
  &::-webkit-scrollbar-track {
    background: #1A3541;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #018ABE;
    border-radius: 3px;
  }
}

.day-tab {
  padding: 10px 15px;
  background: transparent;
  border: none;
  color: #ccc;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(1, 138, 190, 0.2);
    color: #fff;
  }
  
  &.active {
    background: #018ABE;
    color: #fff;
  }
}

.time-slots {
  padding: 15px;
}

.no-slots {
  text-align: center;
  color: #ccc;
  padding: 15px 0;
}

.time-slot {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  flex-wrap: wrap;
  background: rgba(1, 138, 190, 0.1);
  padding: 10px;
  border-radius: 4px;
}

.time-inputs {
  display: flex;
  align-items: center;
  margin-right: 10px;
}

.time-input {
  width: 90px;
  padding: 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.title-input {
  flex: 1;
  min-width: 200px;
  padding: 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  margin: 5px 10px 5px 0;
}

.time-separator {
  margin: 0 5px;
  color: #666;
}

.remove-slot-btn {
  background-color: #ff6b6b;
  color: white;
  border: none;
  border-radius: 50%;
  width: 25px;
  height: 25px;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #ff5252;
  }
}

.add-slot-btn {
  width: 100%;
  padding: 8px;
  border: 1px dashed #018ABE;
  background: transparent;
  color: #018ABE;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
  
  &:hover {
    background: rgba(1, 138, 190, 0.1);
  }
}

.schedule-helper {
  display: block;
  color: #aaa;
  font-size: 12px;
  margin-top: 5px;
}

.current-main-image {
  margin-bottom: 10px;
  
  img {
    width: 100%;
    max-height: 200px;
    object-fit: cover;
    border-radius: 6px;
  }
}

.current-images {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 15px;
  
  .image-item {
    position: relative;
    width: 100%;
    padding-bottom: 75%; /* Соотношение 4:3 */
    border-radius: 6px;
    overflow: hidden;
    transition: all 0.3s ease;
    
    &.marked-for-deletion {
      opacity: 0.5;
      
      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(220, 53, 69, 0.3);
        z-index: 1;
      }
    }
    
    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .image-action-btn {
      position: absolute;
      top: 5px;
      right: 5px;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      transition: background 0.3s ease;
      z-index: 2;
    }
    
    .delete-image-btn {
      background: rgba(220, 53, 69, 0.8);
      color: white;
      
      &:hover {
        background: rgba(220, 53, 69, 1);
      }
    }
    
    .restore-image-btn {
      background: rgba(40, 167, 69, 0.8);
      color: white;
      
      &:hover {
        background: rgba(40, 167, 69, 1);
      }
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
  
  .current-images {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .current-images {
    grid-template-columns: 1fr;
  }
}
</style> 