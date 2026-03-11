<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTodoStore } from '@/stores/useTodoStore'

const route = useRoute()
const router = useRouter()
const store = useTodoStore()

const todo = computed(() => store.todos.find((t) => t.id === route.params.id))

const isEditing = ref(false)
const editText = ref('')
const newTag = ref('')
const showDeleteConfirm = ref(false)
const showReminderModal = ref(false)
const reminderDate = ref('')
const reminderTime = ref('')

if (!todo.value) {
  router.push('/')
}

const addTag = () => {
  if (newTag.value.trim() && todo.value) {
    if (!todo.value.tags.includes(newTag.value.trim())) {
      todo.value.tags.push(newTag.value.trim())
      store.persist()
    }
    newTag.value = ''
  }
}

const removeTag = (tag: string) => {
  if (todo.value) {
    todo.value.tags = todo.value.tags.filter((t) => t !== tag)
    store.persist()
  }
}

const setReminder = () => {
  if (todo.value && reminderDate.value && reminderTime.value) {
    const dateTime = new Date(`${reminderDate.value}T${reminderTime.value}`)
    store.addReminder(todo.value.id, dateTime)
    showReminderModal.value = false
  }
}

const shareTask = async () => {
  if (todo.value) {
    const shareData = {
      title: 'Todo Task',
      text: todo.value.text,
      url: window.location.href,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        console.log('Share cancelled')
      }
    } else {
      navigator.clipboard.writeText(todo.value.text)
      alert('Copied to clipboard!')
    }
  }
}
</script>

<template>
  <div v-if="todo" class="max-w-2xl mx-auto py-8 px-4">
    <!-- Back button -->
    <button
      @click="router.back()"
      class="mb-6 text-zinc-600 hover:text-zinc-400 flex items-center gap-2 text-sm"
    >
      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
      Quay lại
    </button>

    <div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
      <!-- Header -->
      <div class="flex items-start justify-between mb-6">
        <div class="flex items-center gap-3">
          <button
            @click="store.toggleTodo(todo.id)"
            :class="[
              'w-6 h-6 rounded-full border-2 flex items-center justify-center',
              todo.done ? 'bg-violet-600 border-violet-600' : 'border-zinc-600',
            ]"
          >
            <svg
              v-if="todo.done"
              class="w-4 h-4 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </button>

          <div class="flex items-center gap-2">
            <span
              class="text-xs px-2 py-1 rounded-full"
              :class="{
                'bg-rose-500/20 text-rose-400': todo.priority === 'high',
                'bg-amber-500/20 text-amber-400': todo.priority === 'medium',
                'bg-emerald-500/20 text-emerald-400': todo.priority === 'low',
              }"
            >
              {{ todo.priority === 'high' ? 'Cao' : todo.priority === 'medium' ? 'TB' : 'Thấp' }}
            </span>

            <span class="text-xs text-zinc-600">
              Tạo: {{ new Date(todo.createdAt).toLocaleDateString('vi-VN') }}
            </span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-2">
          <button
            @click="shareTask"
            class="p-2 rounded-lg hover:bg-zinc-800 text-zinc-600 hover:text-zinc-400 transition"
            title="Chia sẻ"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" />
            </svg>
          </button>

          <button
            @click="showReminderModal = true"
            class="p-2 rounded-lg hover:bg-zinc-800 text-zinc-600 hover:text-zinc-400 transition"
            title="Đặt nhắc nhở"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </button>

          <button
            @click="showDeleteConfirm = true"
            class="p-2 rounded-lg hover:bg-zinc-800 text-zinc-600 hover:text-rose-400 transition"
            title="Xóa"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14H6L5 6" />
              <path d="M10 11v6M14 11v6" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="mb-6">
        <div v-if="!isEditing" class="group relative">
          <p
            class="text-xl leading-relaxed cursor-pointer"
            :class="todo.done ? 'line-through text-zinc-600' : 'text-zinc-200'"
            @dblclick="isEditing = true"
          >
            {{ todo.text }}
          </p>
          <span
            class="absolute -top-2 -right-2 text-xs text-zinc-700 opacity-0 group-hover:opacity-100 transition"
          >
            Double-click để sửa
          </span>
        </div>

        <input
          v-else
          v-focus
          v-model="editText"
          @keyup.enter="
            store.updateTodo(todo.id, editText)
            isEditing = false
          "
          @blur="isEditing = false"
          class="w-full bg-zinc-800 text-zinc-100 text-xl rounded-lg px-4 py-2 outline-none border border-violet-500"
          :value="todo.text"
        />
      </div>

      <!-- Category selector -->
      <div class="mb-6">
        <h3 class="text-sm font-medium text-zinc-500 mb-3">Danh mục</h3>
        <div class="flex gap-2 flex-wrap">
          <button
            v-for="cat in store.categories"
            :key="cat.id"
            @click="store.updateCategory(todo.id, cat.id)"
            :class="[
              'px-3 py-1.5 rounded-lg text-xs border transition-all flex items-center gap-1',
              todo.category === cat.id
                ? 'border-violet-500 text-violet-300 bg-violet-500/10'
                : 'border-zinc-700 text-zinc-500 hover:border-zinc-600',
            ]"
          >
            <span>{{ cat.icon }}</span>
            {{ cat.name }}
          </button>
          <button
            v-if="todo.category"
            @click="store.updateCategory(todo.id, '')"
            class="px-3 py-1.5 rounded-lg text-xs border border-zinc-700 text-zinc-500 hover:border-zinc-600"
          >
            Bỏ chọn
          </button>
        </div>
      </div>

      <!-- Tags section -->
      <div class="mb-6">
        <h3 class="text-sm font-medium text-zinc-500 mb-3">Tags</h3>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="tag in todo.tags"
            :key="tag"
            class="flex items-center gap-1 bg-violet-500/20 text-violet-300 text-sm px-3 py-1 rounded-full group"
          >
            #{{ tag }}
            <button
              @click="removeTag(tag)"
              class="opacity-0 group-hover:opacity-100 hover:text-white transition"
            >
              ×
            </button>
          </span>

          <div class="flex items-center">
            <input
              v-model="newTag"
              @keyup.enter="addTag"
              placeholder="Thêm tag..."
              class="bg-zinc-800 text-zinc-300 text-sm rounded-full px-3 py-1 outline-none border border-zinc-700 focus:border-violet-500 w-24 transition"
            />
          </div>
        </div>
      </div>

      <!-- Reminder modal -->
      <Teleport to="body">
        <div
          v-if="showReminderModal"
          class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        >
          <div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-sm w-full">
            <h3 class="text-lg font-semibold mb-4">Đặt nhắc nhở</h3>

            <div class="space-y-4">
              <div>
                <label class="block text-sm text-zinc-500 mb-1">Ngày</label>
                <input
                  v-model="reminderDate"
                  type="date"
                  class="w-full bg-zinc-800 text-zinc-100 rounded-lg px-4 py-2 outline-none border border-zinc-700 focus:border-violet-500"
                  :min="new Date().toISOString().split('T')[0]"
                />
              </div>

              <div>
                <label class="block text-sm text-zinc-500 mb-1">Giờ</label>
                <input
                  v-model="reminderTime"
                  type="time"
                  class="w-full bg-zinc-800 text-zinc-100 rounded-lg px-4 py-2 outline-none border border-zinc-700 focus:border-violet-500"
                />
              </div>
            </div>

            <div class="flex gap-2 mt-6">
              <button
                @click="setReminder"
                class="flex-1 bg-violet-600 hover:bg-violet-500 text-white rounded-lg px-4 py-2 text-sm font-semibold transition"
              >
                Đặt
              </button>
              <button
                @click="showReminderModal = false"
                class="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg px-4 py-2 text-sm font-semibold transition"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      </Teleport>

      <!-- Delete confirmation -->
      <Teleport to="body">
        <div
          v-if="showDeleteConfirm"
          class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        >
          <div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-sm w-full">
            <h3 class="text-lg font-semibold mb-2">Xóa task?</h3>
            <p class="text-zinc-400 text-sm mb-6">Hành động này không thể hoàn tác.</p>

            <div class="flex gap-2">
              <button
                @click="
                  store.deleteTodo(todo.id)
                  router.push('/')
                "
                class="flex-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg px-4 py-2 text-sm font-semibold transition"
              >
                Xóa
              </button>
              <button
                @click="showDeleteConfirm = false"
                class="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg px-4 py-2 text-sm font-semibold transition"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      </Teleport>
    </div>
  </div>
</template>
