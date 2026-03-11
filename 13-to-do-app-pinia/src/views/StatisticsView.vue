<script setup lang="ts">
import { computed } from 'vue'
import { useTodoStore } from '@/stores/useTodoStore'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Bar, Line, Pie } from 'vue-chartjs'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
)

const store = useTodoStore()

const completionData = computed(() => {
  const last7Days = [...Array(7)]
    .map((_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return date.toLocaleDateString('vi-VN', { weekday: 'short' })
    })
    .reverse()

  const completedCount = last7Days.map((day) => {
    return store.todos.filter(
      (t) =>
        t.done && new Date(t.createdAt).toLocaleDateString('vi-VN', { weekday: 'short' }) === day,
    ).length
  })

  return {
    labels: last7Days,
    datasets: [
      {
        label: 'Hoàn thành',
        data: completedCount,
        backgroundColor: '#8b5cf6',
        borderRadius: 8,
      },
    ],
  }
})

const priorityData = computed(() => ({
  labels: ['Cao', 'Trung bình', 'Thấp'],
  datasets: [
    {
      data: [
        store.todos.filter((t) => t.priority === 'high').length,
        store.todos.filter((t) => t.priority === 'medium').length,
        store.todos.filter((t) => t.priority === 'low').length,
      ],
      backgroundColor: ['#f43f5e', '#f59e0b', '#10b981'],
      borderWidth: 0,
    },
  ],
}))

const productivityByHour = computed(() => {
  const hours = [...Array(24)].map((_, i) => i)
  const data = hours.map((hour) => {
    return store.todos.filter((t) => new Date(t.createdAt).getHours() === hour).length
  })

  return {
    labels: hours.map((h) => `${h}:00`),
    datasets: [
      {
        label: 'Số task tạo',
        data,
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  }
})

const categoryData = computed(() => {
  const categories = store.categories.map((c) => c.name)
  const data = store.categories.map((c) => store.todos.filter((t) => t.category === c.id).length)

  return {
    labels: categories,
    datasets: [
      {
        data,
        backgroundColor: store.categories.map((c) => c.color),
        borderWidth: 0,
      },
    ],
  }
})
</script>

<template>
  <div class="max-w-4xl mx-auto py-8 px-4">
    <h1 class="text-3xl font-bold mb-8">Thống kê</h1>

    <!-- Summary cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
        <div class="text-zinc-500 text-sm mb-1">Tổng số</div>
        <div class="text-3xl font-bold text-white">{{ store.stats.total }}</div>
        <div class="text-xs text-zinc-600 mt-2">
          <span class="text-emerald-400">{{ store.stats.done }}</span> hoàn thành
        </div>
      </div>

      <div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
        <div class="text-zinc-500 text-sm mb-1">Đang làm</div>
        <div class="text-3xl font-bold text-amber-400">{{ store.stats.active }}</div>
        <div class="text-xs text-zinc-600 mt-2">{{ store.stats.percent }}% hoàn thành</div>
      </div>

      <div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
        <div class="text-zinc-500 text-sm mb-1">Tags</div>
        <div class="text-3xl font-bold text-violet-400">{{ store.allTags.length }}</div>
        <div class="text-xs text-zinc-600 mt-2">tags đang sử dụng</div>
      </div>

      <div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
        <div class="text-zinc-500 text-sm mb-1">Danh mục</div>
        <div class="text-3xl font-bold text-rose-400">{{ store.categories.length }}</div>
        <div class="text-xs text-zinc-600 mt-2">categories</div>
      </div>
    </div>

    <!-- Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Completion trend -->
      <div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <h2 class="text-lg font-semibold mb-4">Xu hướng hoàn thành</h2>
        <div class="h-64">
          <Bar
            :data="completionData"
            :options="{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  grid: { color: '#27272a' },
                  ticks: { color: '#71717a' },
                },
                x: {
                  grid: { display: false },
                  ticks: { color: '#71717a' },
                },
              },
            }"
          />
        </div>
      </div>

      <!-- Priority distribution -->
      <div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <h2 class="text-lg font-semibold mb-4">Phân bố ưu tiên</h2>
        <div class="h-64 flex items-center justify-center">
          <Pie
            :data="priorityData"
            :options="{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: { color: '#a1a1aa' },
                },
              },
            }"
          />
        </div>
      </div>

      <!-- Productivity by hour -->
      <div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <h2 class="text-lg font-semibold mb-4">Thời gian làm việc</h2>
        <div class="h-64">
          <Line
            :data="productivityByHour"
            :options="{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  grid: { color: '#27272a' },
                  ticks: { color: '#71717a' },
                },
                x: {
                  grid: { display: false },
                  ticks: {
                    color: '#71717a',
                    maxRotation: 45,
                    minRotation: 45,
                  },
                },
              },
            }"
          />
        </div>
      </div>

      <!-- Category distribution -->
      <div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <h2 class="text-lg font-semibold mb-4">Phân bố danh mục</h2>
        <div class="h-64 flex items-center justify-center">
          <Pie
            :data="categoryData"
            :options="{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: { color: '#a1a1aa' },
                },
              },
            }"
          />
        </div>
      </div>
    </div>
  </div>
</template>
