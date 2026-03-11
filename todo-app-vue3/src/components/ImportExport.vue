<template>
  <div class="import-export">
    <button @click="handleExport" class="btn-export" title="Xuất dữ liệu">
      📥 Xuất dữ liệu
    </button>
    <label class="btn-import" title="Nhập dữ liệu">
      📤 Nhập dữ liệu
      <input
        type="file"
        ref="fileInput"
        @change="handleImport"
        accept=".json"
        style="display: none"
      />
    </label>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useTodoStore } from "../stores/todoStore";

const todoStore = useTodoStore();
const fileInput = ref<HTMLInputElement | null>(null);

const handleExport = () => {
  todoStore.exportTodos();
};

const handleImport = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
    try {
      await todoStore.importTodos(file);
      alert("Nhập dữ liệu thành công!");
    } catch (error) {
      alert("Lỗi khi nhập dữ liệu. Vui lòng kiểm tra file.");
      console.error(error);
    }
  }

  // Reset file input
  if (target) {
    target.value = "";
  }
};
</script>

<style scoped>
.import-export {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn-export,
.btn-import {
  padding: 10px 16px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
}

.btn-export:hover,
.btn-import:hover {
  background: #5a67d8;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);
}

.btn-export:active,
.btn-import:active {
  transform: translateY(0);
}

/* Dark mode styles */
:global(.dark) .btn-export,
:global(.dark) .btn-import {
  background: #667eea;
  color: white;
}

:global(.dark) .btn-export:hover,
:global(.dark) .btn-import:hover {
  background: #5a67d8;
}
</style>
