<template>
  <div class="sessions">
    <DirectionsList />
  </div>
</template>

<script>
import DirectionsList from '@/components/Directions/DirectionsList.vue'

export default {
  name: 'Sessions',
  components: {
    DirectionsList
  }
}
</script>

<style scoped>
.sessions {
  width: 100%;
}
</style>