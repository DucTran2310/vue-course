import { useTodoStore } from '@/stores/useTodoStore'
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

export function useKeyboardShortcuts() {
  const router = useRouter()
  const store = useTodoStore()

  const handleKeyDown = (e: KeyboardEvent) => {
    // Ctrl/Cmd + K: Focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault()
      document.querySelector<HTMLInputElement>('input[placeholder*="Tìm kiếm"]')?.focus()
    }

    // Ctrl/Cmd + N: New todo
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
      e.preventDefault()
      document.querySelector<HTMLInputElement>('input[placeholder*="Thêm việc mới"]')?.focus()
    }

    // Ctrl/Cmd + Z: Undo
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
      e.preventDefault()
      store.undo()
    }

    // Ctrl/Cmd + Shift + Z: Redo
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
      e.preventDefault()
      store.redo()
    }

    // 1-3: Quick filter
    if (!e.ctrlKey && !e.metaKey && e.key >= '1' && e.key <= '3') {
      const filters: Array<'all' | 'active' | 'done'> = ['all', 'active', 'done']
      const index = parseInt(e.key) - 1
      if (index < filters.length) {
        store.filter = filters[index]
      }
    }

    // G: Go to stats
    if (!e.ctrlKey && !e.metaKey && e.key === 'g') {
      router.push('/stats')
    }

    // S: Go to settings
    if (!e.ctrlKey && !e.metaKey && e.key === 's') {
      router.push('/settings')
    }

    // ?: Show help
    if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
      e.preventDefault()
      alert(`
Keyboard Shortcuts:
• ⌘K - Tìm kiếm
• ⌘N - Thêm task mới
• ⌘Z - Undo
• ⌘⇧Z - Redo
• 1-3 - Filter (All/Active/Done)
• G - Đến trang thống kê
• S - Đến trang cài đặt
• ? - Hiển thị trợ giúp này
      `)
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeyDown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown)
  })
}
