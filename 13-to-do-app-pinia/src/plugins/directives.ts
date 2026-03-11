import type { App, Directive } from "vue";

const vClickOutside: Directive = {
  mounted(el, binding) {
    el._clickOutside = (e: MouseEvent) => {
      if (!el.contains(e.target as Node)) binding.value(e);
    };
    document.addEventListener("click", el._clickOutside);
  },
  unmounted(el) {
    document.removeEventListener("click", el._clickOutside);
  },
};

export function registerDirectives(app: App) {
  app.directive("click-outside", vClickOutside);
}
