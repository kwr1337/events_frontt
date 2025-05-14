<template>
  <div class="sessions-slider">
    <button 
      class="nav-button prev" 
      @click="prevSlide"
      :disabled="currentPage === 0"
    >
      ←
    </button>
    
    <div class="slider-container">
      <slot></slot>
    </div>
    
    <button 
      class="nav-button next" 
      @click="nextSlide"
      :disabled="currentPage >= maxPages - 1"
    >
      →
    </button>
    
    <div class="pagination">
      <button 
        v-for="page in maxPages" 
        :key="page"
        class="dot"
        :class="{ active: currentPage === page - 1 }"
        @click="goToPage(page - 1)"
      ></button>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'SessionsSlider',
  props: {
    itemsPerPage: {
      type: Number,
      default: 6
    },
    totalItems: {
      type: Number,
      required: true
    },
    modelValue: {
      type: Number,
      default: 0
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const currentPage = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value)
    })
    
    const maxPages = computed(() => {
      return Math.ceil(props.totalItems / props.itemsPerPage)
    })
    
    const prevSlide = () => {
      if (currentPage.value > 0) {
        currentPage.value--
      }
    }
    
    const nextSlide = () => {
      if (currentPage.value < maxPages.value - 1) {
        currentPage.value++
      }
    }
    
    const goToPage = (page) => {
      currentPage.value = page
    }
    
    return {
      currentPage,
      maxPages,
      prevSlide,
      nextSlide,
      goToPage
    }
  }
}
</script>

<style lang="scss" scoped>
.sessions-slider {
  position: relative;
  width: 100%;
  margin: 40px auto;
  max-width: 1400px;
  padding: 0 50px;
}

.slider-container {
  width: 100%;
  padding-top: 30px;
}

.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(1, 138, 190, 0.1);
  border: 1px solid #018ABE;
  color: #018ABE;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  transition: all 0.3s ease;
  z-index: 2;

  &:hover {
    background: #018ABE;
    color: white;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    &:hover {
      background: rgba(1, 138, 190, 0.1);
      color: #018ABE;
    }
  }

  &.prev {
    left: 0;
  }

  &.next {
    right: 0;
  }
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(1, 138, 190, 0.3);
  border: none;
  cursor: pointer;
  padding: 0;
  transition: all 0.3s ease;

  &.active {
    background: #018ABE;
    transform: scale(1.2);
  }

  &:hover {
    background: rgba(1, 138, 190, 0.6);
  }
}

@media (max-width: 1300px) {
  .slides {
    max-width: 1000px;
  }
}

@media (max-width: 1023px) {
  .slides {
    grid-template-columns: repeat(2, 1fr);
    max-width: 800px;
  }
}

@media (max-width: 768px) {
  .slides {
    grid-template-columns: 1fr;
    max-width: 416px;
  }
}
</style> 