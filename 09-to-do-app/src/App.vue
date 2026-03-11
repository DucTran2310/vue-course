<script setup>
import { useTodos } from './composables/useTodos'
import TodoHeader from './components/TodoHeader.vue'
import TodoInput from './components/TodoInput.vue'
import TodoFilter from './components/TodoFilter.vue'
import TodoList from './components/TodoList.vue'
import TodoFooter from './components/TodoFooter.vue'

const { filter, filteredTodos, stats, addTodo, toggleTodo, deleteTodo, updateTodo, clearDone } =
  useTodos()
</script>

<template>
  <div class="app">
    <div class="bg-circle c1"></div>
    <div class="bg-circle c2"></div>

    <div class="card">
      <TodoHeader :stats="stats" />

      <TodoInput @add="addTodo" />

      <TodoFilter v-model="filter" :stats="stats" />

      <TodoList
        :todos="filteredTodos"
        :filter="filter"
        @toggle="toggleTodo"
        @delete="deleteTodo"
        @update="updateTodo"
      />

      <TodoFooter :done-count="stats.done" @clear="clearDone" />
    </div>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;600;700&family=Nunito:wght@400;500;600&display=swap');

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.app {
  font-family: 'Nunito', sans-serif;
  min-height: 100vh;
  background: #faf7f2;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  position: relative;
  overflow: hidden;
}
.bg-circle {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}
.c1 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, #e8d5b7 0%, transparent 70%);
  top: -200px;
  right: -150px;
  opacity: 0.5;
}
.c2 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, #c8e6c9 0%, transparent 70%);
  bottom: -180px;
  left: -100px;
  opacity: 0.4;
}
.card {
  background: #fffdf9;
  border-radius: 20px;
  width: 100%;
  max-width: 480px;
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.04),
    0 4px 16px rgba(0, 0, 0, 0.06),
    0 20px 48px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  position: relative;
  z-index: 1;
}
</style>
