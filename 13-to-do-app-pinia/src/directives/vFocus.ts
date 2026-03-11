import type { Directive } from 'vue'

export const vFocus: Directive = {
  mounted(el: HTMLElement) {
    const input = el.tagName === 'INPUT' ? el : el.querySelector<HTMLInputElement>('input')
    input?.focus()
  },
}
