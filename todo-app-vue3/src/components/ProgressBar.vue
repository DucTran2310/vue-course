<template>
  <div class="progress-container">
    <div class="progress-header">
      <span class="progress-label">Tiến độ hoàn thành</span>
      <span class="progress-value">{{ percentage }}%</span>
    </div>
    <div class="progress-bar">
      <div
        class="progress-fill"
        :class="{ 'progress-complete': percentage === 100 }"
        :style="{ width: percentage + '%' }"
      ></div>
    </div>
    <div class="progress-stats">
      <span>✅ {{ completed }}/{{ total }} đã hoàn thành</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useTodoStore } from "../stores/todoStore";

const todoStore = useTodoStore();

const percentage = computed(() => todoStore.progressPercentage);
const completed = computed(() => todoStore.completedCount);
const total = computed(() => todoStore.totalCount);
</script>

<style scoped>
.progress-container {
  margin-bottom: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.progress-label {
  font-weight: 600;
  color: #495057;
  font-size: 14px;
}

.progress-value {
  font-weight: 700;
  color: #667eea;
  font-size: 16px;
}

.progress-bar {
  width: 100%;
  height: 12px;
  background: #e9ecef;
  border-radius: 6px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 6px;
  transition: width 0.5s ease-in-out;
  position: relative;
}

.progress-fill::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.progress-complete {
  background: linear-gradient(90deg, #51cf66 0%, #40c057 100%);
}

.progress-stats {
  margin-top: 8px;
  font-size: 13px;
  color: #6c757d;
  text-align: right;
}

/* Dark mode styles */
:global(.dark) .progress-container {
  background: #2d3748;
}

:global(.dark) .progress-label {
  color: #e2e8f0;
}

:global(.dark) .progress-bar {
  background: #1a202c;
}

:global(.dark) .progress-stats {
  color: #a0aec0;
}
</style>
