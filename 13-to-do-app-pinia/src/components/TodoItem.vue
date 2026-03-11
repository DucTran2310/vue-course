<script setup lang="ts">
import { ref } from 'vue'
import type { Todo, Priority } from '@/types/todo'
import { useRouter } from 'vue-router'

const props = defineProps<{ todo: Todo }>()

const emit = defineEmits<{
  toggle: [id: string]
  update: [id: string, text: string]
  delete: [id: string]
  priority: [id: string, priority: Priority]
}>()

const router = useRouter()

const isEditing = ref(false)
const editText = ref('')
const showPriorityMenu = ref(false)

const vFocusLocal = { mounted: (el: HTMLElement) => el.focus() }

const startEdit = () => {
  isEditing.value = true
  editText.value = props.todo.text
}

const saveEdit = () => {
  if (editText.value.trim()) emit('update', props.todo.id, editText.value)
  isEditing.value = false
}

const goToDetail = () => {
  router.push(`/task/${props.todo.id}`)
}

// Thêm function xử lý change priority
const handlePriorityChange = (priority: Priority) => {
  emit('priority', props.todo.id, priority)
  showPriorityMenu.value = false
}

const PRIORITY_CFG: Record<Priority, { dot: string; text: string; label: string }> = {
  high: { dot: 'bg-rose-500', text: 'text-rose-400', label: 'Cao' },
  medium: { dot: 'bg-amber-500', text: 'text-amber-400', label: 'TB' },
  low: { dot: 'bg-emerald-500', text: 'text-emerald-400', label: 'Thấp' },
}
</script>

<template>
  <li
    class="group flex items-start gap-3 px-4 py-3 hover:bg-zinc-800/50 rounded-xl transition-colors"
  >
    <!-- Checkbox -->
    <button
      @click="emit('toggle', todo.id)"
      :class="[
        'mt-0.5 w-5 h-5 flex-shrink-0 rounded-full border-2 flex items-center justify-center transition-all',
        todo.done ? 'bg-violet-600 border-violet-600' : 'border-zinc-600 hover:border-violet-500',
      ]"
    >
      <svg
        v-if="todo.done"
        class="w-3 h-3 text-white"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </button>

    <!-- Content -->
    <div class="flex-1 min-w-0" @click="goToDetail">
      <!-- Edit mode -->
      <input
        v-if="isEditing"
        v-focus-local
        v-model="editText"
        class="w-full bg-zinc-800 text-zinc-100 text-sm rounded-lg px-3 py-1 outline-none border border-violet-500"
        @keyup.enter="saveEdit"
        @keyup.esc="isEditing = false"
        @blur="saveEdit"
        @click.stop
      />

      <!-- View mode -->
      <template v-else>
        <p
          :class="[
            'text-sm leading-relaxed cursor-pointer',
            todo.done ? 'line-through text-zinc-600' : 'text-zinc-200',
          ]"
          @dblclick.stop="startEdit"
        >
          {{ todo.text }}
        </p>

        <!-- Tags -->
        <div v-if="todo.tags.length" class="flex gap-1 flex-wrap mt-1">
          <span
            v-for="tag in todo.tags"
            :key="tag"
            class="text-[10px] text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-full"
          >
            #{{ tag }}
          </span>
        </div>
      </template>
    </div>

    <!-- Right side: priority + actions -->
    <div class="flex items-center gap-1 flex-shrink-0">
      <!-- Priority indicator + menu -->
      <div class="relative">
        <button
          @click.stop="showPriorityMenu = !showPriorityMenu"
          :class="[
            'w-2 h-2 rounded-full transition-transform hover:scale-125 mt-2',
            PRIORITY_CFG[todo.priority].dot,
          ]"
          :title="PRIORITY_CFG[todo.priority].label"
        />

        <!-- Priority dropdown -->
        <Transition name="pop">
          <div
            v-if="showPriorityMenu"
            v-click-outside="() => (showPriorityMenu = false)"
            class="absolute right-0 top-6 bg-zinc-800 border border-zinc-700 rounded-xl p-1 z-10 min-w-[100px] shadow-xl"
          >
            <button
              v-for="(cfg, key) in PRIORITY_CFG"
              :key="key"
              @click="handlePriorityChange(key)"
              :class="[
                'flex items-center gap-2 w-full px-3 py-1.5 rounded-lg text-xs hover:bg-zinc-700 transition-colors',
                cfg.text,
              ]"
            >
              <span :class="['w-2 h-2 rounded-full flex-shrink-0', cfg.dot]" />
              {{ cfg.label }}
            </button>
          </div>
        </Transition>
      </div>

      <!-- Action buttons — hiện khi hover -->
      <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          @click.stop="startEdit"
          class="p-1.5 rounded-lg text-zinc-600 hover:text-zinc-300 hover:bg-zinc-700 transition-all"
          title="Sửa (Double-click)"
        >
          <svg
            class="w-3.5 h-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
        <button
          @click.stop="emit('delete', todo.id)"
          class="p-1.5 rounded-lg text-zinc-600 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
          title="Xóa"
        >
          <svg
            class="w-3.5 h-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14H6L5 6" />
            <path d="M10 11v6M14 11v6" />
          </svg>
        </button>
      </div>
    </div>
  </li>
</template>

<style scoped>
.pop-enter-active,
.pop-leave-active {
  transition: all 0.15s ease;
}
.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(-4px);
}
</style>
