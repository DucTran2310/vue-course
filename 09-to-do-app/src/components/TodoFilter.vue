<script setup>
// v-model pattern cho component: modelValue + update:modelValue
const props = defineProps({
  modelValue: { type: String, required: true }, // filter hiện tại
  stats: { type: Object, required: true },
})

const emit = defineEmits(['update:modelValue'])

const tabs = [
  { key: 'all', label: 'Tất cả' },
  { key: 'active', label: 'Đang làm' },
  { key: 'done', label: 'Xong' },
]

const getCount = (key) => {
  if (key === 'all') return props.stats.total
  if (key === 'active') return props.stats.active
  return props.stats.done
}
</script>

<template>
  <div class="filter-tabs">
    <button
      v-for="tab in tabs"
      :key="tab.key"
      :class="['tab', { active: modelValue === tab.key }]"
      @click="emit('update:modelValue', tab.key)"
    >
      {{ tab.label }}
      <span class="tab-count">{{ getCount(tab.key) }}</span>
    </button>
  </div>
</template>

<style scoped>
.filter-tabs {
  display: flex;
  gap: 4px;
  padding: 12px 28px;
  border-bottom: 1px solid #f0ebe0;
}
.tab {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: 'Nunito', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #9c8e80;
  background: none;
  border: none;
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s;
}
.tab:hover {
  background: #f5f0e8;
  color: #5a4030;
}
.tab.active {
  background: #2c1f14;
  color: #fff;
}
.tab-count {
  font-size: 11px;
  background: rgba(255, 255, 255, 0.2);
  padding: 1px 6px;
  border-radius: 99px;
}
.tab:not(.active) .tab-count {
  background: #ede8df;
  color: #9c8e80;
}
</style>
