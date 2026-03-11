<script setup>
import { ref } from 'vue'

const props = defineProps({
  todo: { type: Object, required: true },
})

const emit = defineEmits(['toggle', 'delete', 'update'])

// Edit state nằm trong chính component này — không cần đưa lên parent
const isEditing = ref(false)
const editText = ref('')

const startEdit = () => {
  isEditing.value = true
  editText.value = props.todo.text
}

const saveEdit = () => {
  if (editText.value.trim()) {
    emit('update', props.todo.id, editText.value)
  }
  isEditing.value = false
}

const cancelEdit = () => {
  isEditing.value = false
}

// Custom directive v-focus dùng inline
const vFocus = { mounted: (el) => el.focus() }

const priorityLabel = { high: 'Cao', medium: 'TB', low: 'Thấp' }
</script>

<template>
  <li :class="['todo-item', { done: todo.done, editing: isEditing }]">
    <!-- Checkbox -->
    <button class="checkbox" @click="emit('toggle', todo.id)">
      <svg
        v-if="todo.done"
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </button>

    <!-- Text / Edit -->
    <div class="todo-body" @dblclick="startEdit">
      <template v-if="isEditing">
        <input
          v-focus
          v-model="editText"
          class="edit-input"
          @keyup.enter="saveEdit"
          @keyup.esc="cancelEdit"
          @blur="saveEdit"
        />
      </template>
      <template v-else>
        <span class="todo-text">{{ todo.text }}</span>
        <span :class="['priority-dot', todo.priority]" :title="priorityLabel[todo.priority]"></span>
      </template>
    </div>

    <!-- Actions -->
    <div class="todo-actions">
      <button class="btn-icon edit" @click="startEdit" title="Chỉnh sửa">
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      </button>
      <button class="btn-icon delete" @click="emit('delete', todo.id)" title="Xóa">
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-1 14H6L5 6" />
          <path d="M10 11v6M14 11v6" />
          <path d="M9 6V4h6v2" />
        </svg>
      </button>
    </div>
  </li>
</template>

<style scoped>
.todo-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 28px;
  transition: background 0.15s;
}
.todo-item:hover {
  background: #fdf9f4;
}

.checkbox {
  width: 22px;
  height: 22px;
  flex-shrink: 0;
  border-radius: 6px;
  border: 2px solid #ddd8cf;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  color: #fff;
}
.todo-item.done .checkbox {
  background: #c8956c;
  border-color: #c8956c;
}
.checkbox:hover {
  border-color: #c8956c;
}

.todo-body {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  cursor: pointer;
}
.todo-text {
  font-size: 14px;
  color: #2c1f14;
  line-height: 1.5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: all 0.2s;
}
.todo-item.done .todo-text {
  text-decoration: line-through;
  color: #b8ad9e;
}

.priority-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}
.priority-dot.high {
  background: #ef4444;
}
.priority-dot.medium {
  background: #f59e0b;
}
.priority-dot.low {
  background: #22c55e;
}

.edit-input {
  flex: 1;
  font-family: 'Nunito', sans-serif;
  font-size: 14px;
  color: #2c1f14;
  background: #fff;
  border: 1.5px solid #c8956c;
  border-radius: 6px;
  padding: 4px 10px;
  outline: none;
  box-shadow: 0 0 0 3px rgba(200, 149, 108, 0.12);
}

.todo-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.15s;
}
.todo-item:hover .todo-actions {
  opacity: 1;
}

.btn-icon {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
  color: #b8ad9e;
}
.btn-icon.edit:hover {
  background: #f5f0e8;
  color: #c8956c;
}
.btn-icon.delete:hover {
  background: #fef2f2;
  color: #ef4444;
}
</style>
