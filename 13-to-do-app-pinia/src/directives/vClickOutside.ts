import type { Directive } from 'vue'

declare module 'vue' {
  interface DirectiveBinding {
    value: () => void
  }
}

export const vClickOutside: Directive = {
  mounted(el, binding) {
    el._clickOutside = (e: MouseEvent) => {
      if (!el.contains(e.target as Node)) binding.value(e)
    }
    document.addEventListener('click', el._clickOutside)
  },
  unmounted(el) {
    document.removeEventListener('click', el._clickOutside)
  },
}
