<script setup lang="ts">
import type { TodoStats } from '@/types/todo'

defineProps<{ stats: TodoStats }>()
</script>

<template>
  <div class="space-y-3">
    <!-- Progress bar -->
    <div>
      <div class="flex justify-between text-xs text-zinc-500 mb-1.5">
        <span>{{ stats.done }}/{{ stats.total }} hoàn thành</span>
        <span class="text-violet-400 font-semibold">{{ stats.percent }}%</span>
      </div>
      <div class="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <div
          class="h-full bg-gradient-to-r from-violet-600 to-violet-400 rounded-full transition-all duration-500"
          :style="{ width: stats.percent + '%' }"
        />
      </div>
    </div>

    <!-- Priority breakdown -->
    <div class="grid grid-cols-3 gap-2">
      <div class="bg-zinc-900 rounded-xl p-2.5 text-center border border-zinc-800">
        <div class="text-rose-400 text-lg font-bold">
          {{ stats.byPriority.high }}
        </div>
        <div class="text-zinc-600 text-[10px] mt-0.5">● Cao</div>
      </div>
      <div class="bg-zinc-900 rounded-xl p-2.5 text-center border border-zinc-800">
        <div class="text-amber-400 text-lg font-bold">
          {{ stats.byPriority.medium }}
        </div>
        <div class="text-zinc-600 text-[10px] mt-0.5">● Trung bình</div>
      </div>
      <div class="bg-zinc-900 rounded-xl p-2.5 text-center border border-zinc-800">
        <div class="text-emerald-400 text-lg font-bold">
          {{ stats.byPriority.low }}
        </div>
        <div class="text-zinc-600 text-[10px] mt-0.5">● Thấp</div>
      </div>
    </div>
  </div>
</template>
