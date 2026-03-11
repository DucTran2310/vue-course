<script setup>
defineProps({
  stats: {
    type: Object,
    required: true,
    // { total, done, active, percent }
  },
})
</script>

<template>
  <header class="header">
    <div class="header-top">
      <div class="logo-mark">✦</div>
      <h1 class="title">Việc cần làm</h1>
    </div>
    <div class="progress-wrap">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: stats.percent + '%' }"></div>
      </div>
      <div class="progress-stats">
        <span class="stat-done">{{ stats.done }} hoàn thành</span>
        <span class="stat-sep">·</span>
        <span class="stat-active">{{ stats.active }} còn lại</span>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  padding: 32px 28px 20px;
  border-bottom: 1px solid #f0ebe0;
}
.header-top {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}
.logo-mark {
  font-size: 20px;
  color: #c8956c;
  line-height: 1;
}
.title {
  font-family: 'Lora', serif;
  font-size: 28px;
  font-weight: 700;
  color: #2c1f14;
  letter-spacing: -0.02em;
}
.progress-wrap {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.progress-bar {
  height: 4px;
  background: #ede8df;
  border-radius: 99px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #c8956c, #e8a87c);
  border-radius: 99px;
  transition: width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.progress-stats {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
}
.stat-done {
  color: #c8956c;
  font-weight: 600;
}
.stat-sep {
  color: #c8bfb0;
}
.stat-active {
  color: #9c8e80;
}
</style>
