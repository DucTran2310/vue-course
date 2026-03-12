import { computed } from "vue";
import { useSettingsStore } from "../stores/settingsStore";

export function useFormat() {
  const settingsStore = useSettingsStore();

  const formatCurrency = computed(() => {
    return (amount: number): string => {
      return new Intl.NumberFormat(settingsStore.settings.locale, {
        style: "currency",
        currency: settingsStore.settings.currency,
      }).format(amount);
    };
  });

  const formatDate = computed(() => {
    return (
      date: Date | string,
      options?: Intl.DateTimeFormatOptions,
    ): string => {
      const d = typeof date === "string" ? new Date(date) : date;
      return new Intl.DateTimeFormat(settingsStore.settings.locale, {
        dateStyle: "medium",
        ...options,
      }).format(d);
    };
  });

  const formatDateTime = computed(() => {
    return (date: Date | string): string => {
      const d = typeof date === "string" ? new Date(date) : date;
      return new Intl.DateTimeFormat(settingsStore.settings.locale, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(d);
    };
  });

  const formatNumber = computed(() => {
    return (num: number): string => {
      return new Intl.NumberFormat(settingsStore.settings.locale).format(num);
    };
  });

  const formatPercentage = computed(() => {
    return (num: number, decimals = 1): string => {
      return `${num.toFixed(decimals)}%`;
    };
  });

  const formatCompactNumber = computed(() => {
    return (num: number): string => {
      if (num >= 1000000) {
        return `${(num / 1000000).toFixed(1)}M`;
      }
      if (num >= 1000) {
        return `${(num / 1000).toFixed(1)}K`;
      }
      return num.toString();
    };
  });

  const timeAgo = computed(() => {
    return (date: Date | string): string => {
      const d = typeof date === "string" ? new Date(date) : date;
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

      if (diffInSeconds < 60) return "Vừa xong";
      if (diffInSeconds < 3600)
        return `${Math.floor(diffInSeconds / 60)} phút trước`;
      if (diffInSeconds < 86400)
        return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
      if (diffInSeconds < 604800)
        return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
      return formatDate.value(d);
    };
  });

  return {
    formatCurrency,
    formatDate,
    formatDateTime,
    formatNumber,
    formatPercentage,
    formatCompactNumber,
    timeAgo,
  };
}
