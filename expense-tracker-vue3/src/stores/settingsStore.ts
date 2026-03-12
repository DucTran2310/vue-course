import { defineStore } from "pinia";
import { ref, watch } from "vue";
import type { Settings } from "../types";

export const useSettingsStore = defineStore("settings", () => {
  // State với default values
  const settings = ref<Settings>({
    currency: "VND",
    locale: "vi",
    defaultCategoryExpense: 8, // "Khác" expense
    defaultCategoryIncome: 12, // "Khác" income
    defaultView: "dashboard",
    showCompletedTransactions: true,
    enableDarkMode: false,
    enableNotifications: true,
  });

  // Load from localStorage
  function loadFromStorage(): void {
    const saved = localStorage.getItem("settings");
    if (saved) {
      const parsed = JSON.parse(saved);
      settings.value = { ...settings.value, ...parsed };
      applyDarkMode();
    }
  }

  // Save to localStorage
  function saveToStorage(): void {
    localStorage.setItem("settings", JSON.stringify(settings.value));
  }

  // Actions
  function updateSettings(updates: Partial<Settings>): void {
    settings.value = { ...settings.value, ...updates };
  }

  function toggleDarkMode(): void {
    settings.value.enableDarkMode = !settings.value.enableDarkMode;
    applyDarkMode();
  }

  function applyDarkMode(): void {
    if (settings.value.enableDarkMode) {
      document.documentElement.setAttribute("data-mode", "dark");
    } else {
      document.documentElement.removeAttribute("data-mode");
    }
  }

  function resetSettings(): void {
    settings.value = {
      currency: "VND",
      locale: "vi",
      defaultCategoryExpense: 8,
      defaultCategoryIncome: 12,
      defaultView: "dashboard",
      showCompletedTransactions: true,
      enableDarkMode: false,
      enableNotifications: true,
    };
  }

  // Watch for changes
  watch(
    settings,
    () => {
      saveToStorage();
      applyDarkMode();
    },
    { deep: true },
  );

  // Initialize
  loadFromStorage();

  return {
    settings,
    updateSettings,
    toggleDarkMode,
    resetSettings,
    loadFromStorage,
    saveToStorage,
  };
});
