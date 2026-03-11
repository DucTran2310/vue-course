<script setup>
defineProps({
  doneCount: { type: Number, required: true },
})
defineEmits(['clear'])
</script>

<template>
  <footer class="footer" v-if="doneCount > 0">
    <button class="btn-clear" @click="$emit('clear')">Xóa {{ doneCount }} việc đã xong</button>
  </footer>
</template>

<style scoped>
.footer {
  padding: 14px 28px;
  border-top: 1px solid #f0ebe0;
  display: flex;
  justify-content: flex-end;
}
.btn-clear {
  font-family: 'Nunito', sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #b8ad9e;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.15s;
  padding: 4px 0;
}
.btn-clear:hover {
  color: #ef4444;
}
</style>
