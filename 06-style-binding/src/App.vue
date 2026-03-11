<template>
  <div class="progress-container">
    <div
      class="progress-bar"
      :style="{
        width: progress + '%',
        backgroundColor: progressColor,
        opacity: progress / 100,
      }"
    >
      {{ progress }}%
    </div>

    <div class="controls">
      <button @click="progress = Math.max(0, progress - 10)">-</button>
      <input type="range" v-model="progress" min="0" max="100" />
      <button @click="progress = Math.min(100, progress + 10)">+</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      progress: 50,
    }
  },
  computed: {
    progressColor() {
      if (this.progress < 30) return '#ff4444'
      if (this.progress < 70) return '#ffbb33'
      return '#00C851'
    },
  },
}
</script>

<style>
.progress-bar {
  transition: all 0.3s ease;
}
</style>
