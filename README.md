# Обновления для работы с API

## Обновлены следующие компоненты:

### 1. DirectionsManager.vue (Управление направлениями)
- Добавлена авторизация для всех запросов (GET, POST, PATCH, DELETE)
- Заголовок 'Authorization' с Bearer-токеном добавлен ко всем запросам API
- Обновлены методы: 
  - fetchDirections
  - handleSubmit
  - deleteDirection
  - fetchEvents
  - handleEventSubmit
  - deleteEvent

### 2. EventsManager.vue (Управление мероприятиями/событиями)
- Добавлена авторизация для всех запросов (GET, POST, PATCH, DELETE)
- Заголовок 'Authorization' с Bearer-токеном добавлен ко всем запросам API
- Обновлены методы: 
  - fetchDirections
  - fetchEvents
  - saveEvent
  - deleteEvent

### 3. SocialProjectsManager.vue (Управление социальными проектами)
- Добавлена авторизация для всех запросов (GET, POST, PATCH, DELETE)
- Заголовок 'Authorization' с Bearer-токеном добавлен ко всем запросам API
- Обновлены методы: 
  - fetchProjects
  - saveProject
  - deleteProject

## Примеры запросов для обновления данных:

```javascript
// PATCH http://localhost:3000/api/directions/{id}
const formData = new FormData();
formData.append('name', 'Новое название');
formData.append('description', 'Новое описание');
formData.append('img', fileObject); // Если нужно обновить изображение

const token = localStorage.getItem('token');
const headers = {
  'Authorization': `Bearer ${token}`
};

fetch('http://localhost:3000/api/directions/1', {
  method: 'PATCH',
  headers: headers,
  body: formData
})
  .then(response => response.json())
  .then(data => console.log('Направление обновлено:', data));

// PATCH http://localhost:3000/api/events/{id}
const formData = new FormData();
formData.append('name', 'Новое название события');
formData.append('description', 'Новое описание');
formData.append('date', '2023-11-20T18:00:00');
formData.append('location', 'Новое место');
formData.append('directionId', '2'); // Если нужно изменить направление
formData.append('img', fileObject); // Если нужно обновить изображение

fetch('http://localhost:3000/api/events/1', {
  method: 'PATCH',
  headers: headers,
  body: formData
})
  .then(response => response.json())
  .then(data => console.log('Событие обновлено:', data));

// PATCH http://localhost:3000/api/social-projects/{id}
const formData = new FormData();
formData.append('name', 'Новое название проекта');
formData.append('description', 'Новое описание');
formData.append('img', fileObject); // Если нужно обновить изображение

fetch('http://localhost:3000/api/social-projects/1', {
  method: 'PATCH',
  headers: headers,
  body: formData
})
  .then(response => response.json())
  .then(data => console.log('Проект обновлен:', data));
```

# events_front

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
