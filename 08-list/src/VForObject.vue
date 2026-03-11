<script setup>
import { ref, reactive } from 'vue'
const shoppingItems = ref([
  {
    name: 'apple',
    price: 7,
  },
  {
    name: 'orange',
    price: 12,
  },
  {
    name: 'banana',
    price: 10,
  },
])
</script>
<template>
  <div>
    <ul>
      <li v-for="item in shoppingItems" :key="item.name">{{ item.name }} - {{ item.price }}</li>
    </ul>
    <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px">
      <span v-for="n in 10" :key="n">{{ n }}</span>
    </div>
  </div>
</template>
