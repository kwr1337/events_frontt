<template>
  <div class="schedule-display">
    <h3 class="schedule-title">Расписание занятий</h3>
    
    <div class="week-schedule">
      <div 
        v-for="day in daysOfWeek" 
        :key="day.value"
        class="day-card"
        :class="{ 'has-sessions': hasTimeSlotsForDay(day.value) }"
      >
        <div class="day-name">{{ day.label }}</div>
        <div class="time-slots">
          <div v-if="!hasTimeSlotsForDay(day.value)" class="no-sessions">
            Нет занятий
          </div>
          <div 
            v-else
            v-for="(slot, index) in getTimeSlotsForDay(day.value)"
            :key="index"
            class="time-slot"
          >
            <div v-if="slot.title" class="session-title">{{ slot.title }}</div>
            <div class="time-range">{{ slot.start }} — {{ slot.end }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ScheduleDisplay',
  props: {
    scheduleData: {
      type: [Object, String],
      required: true
    }
  },
  data() {
    return {
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
  computed: {
    parsedSchedule() {
      if (!this.scheduleData) return {};
      
      if (typeof this.scheduleData === 'string') {
        try {
          return JSON.parse(this.scheduleData);
        } catch (error) {
          console.error('Ошибка при парсинге расписания:', error);
          return {};
        }
      }
      
      return this.scheduleData;
    }
  },
  methods: {
    hasTimeSlotsForDay(day) {
      return this.parsedSchedule[day] && 
             Array.isArray(this.parsedSchedule[day]) && 
             this.parsedSchedule[day].length > 0;
    },
    getTimeSlotsForDay(day) {
      if (!this.hasTimeSlotsForDay(day)) return [];
      return this.parsedSchedule[day];
    }
  }
}
</script>

<style lang="scss" scoped>
.schedule-display {
  margin: 0;
}

.schedule-title {
  font-family: 'El Messiri', serif;
  font-size: 24px;
  color: #fff;
  margin-bottom: 20px;
  text-align: center;
}

.week-schedule {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
}

.day-card {
  background: #1A3541;
  border-radius: 10px;
  padding: 12px;
  transition: all 0.3s ease;
  
  &.has-sessions {
    background: #018ABE;
  }
}

.day-name {
  font-family: 'El Messiri', serif;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 10px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 8px;
}

.time-slots {
  min-height: 40px;
}

.no-sessions {
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
  text-align: center;
  font-style: italic;
  margin-top: 10px;
}

.time-slot {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  padding: 7px;
  color: #fff;
  font-size: 14px;
  margin-bottom: 8px;
  text-align: center;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.time-range {
  margin-bottom: 3px;
}

.session-title {
  font-weight: 600;
  font-size: 13px;
  color: #fff;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 3px;
  padding: 3px 5px;
  margin-top: 3px;
}

@media (max-width: 1100px) {
  .week-schedule {
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(2, auto);
  }
}

@media (max-width: 768px) {
  .week-schedule {
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, auto);
  }
  
  .day-name {
    font-size: 14px;
  }
}

@media (max-width: 425px) {
  .week-schedule {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(4, auto);
  }
  
  .day-name {
    font-size: 14px;
  }
  
  .time-slot {
    font-size: 12px;
  }
  
  .session-title {
    font-size: 11px;
  }
}
</style> 