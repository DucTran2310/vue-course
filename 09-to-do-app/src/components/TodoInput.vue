<script setup>
import { ref } from 'vue'

const emit = defineEmits(['add'])

const newTodo = ref('')

const handleAdd = () => {
  if (!newTodo.value.trim()) return
  emit('add', newTodo.value)
  newTodo.value = ''
}
</script>

<template>
  <div class="input-row">
    <input
      v-model="newTodo"
      class="todo-input"
      placeholder="Thêm việc mới..."
      @keyup.enter="handleAdd"
    />
    <button class="btn-add" @click="handleAdd" :disabled="!newTodo.trim()">
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
      >
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.input-row {
  display: flex;
  gap: 10px;
  padding: 20px 28px;
  border-bottom: 1px solid #f0ebe0;
}
.todo-input {
  flex: 1;
  font-family: 'Nunito', sans-serif;
  font-size: 14px;
  color: #2c1f14;
  background: #f5f0e8;
  border: 1.5px solid transparent;
  border-radius: 10px;
  padding: 10px 14px;
  outline: none;
  transition: all 0.2s;
}
.todo-input::placeholder {
  color: #b8ad9e;
}
.todo-input:focus {
  background: #fff;
  border-color: #c8956c;
  box-shadow: 0 0 0 3px rgba(200, 149, 108, 0.12);
}
.btn-add {
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #2c1f14;
  color: #fff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}
.btn-add:hover:not(:disabled) {
  background: #c8956c;
  transform: scale(1.05);
}
.btn-add:disabled {
  background: #ddd8cf;
  cursor: not-allowed;
}
</style>
