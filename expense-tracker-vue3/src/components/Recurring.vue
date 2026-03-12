<template>
  <div class="space-y-6">
    <!-- Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ t("recurringTransactions") }}
        </h2>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {{ t("recurringDescription") }}
        </p>
      </div>
      <button
        @click="showAddModal = true"
        class="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold shadow-lg shadow-emerald-500/30 transition-all hover:-translate-y-0.5"
      >
        <span class="text-lg">+</span>
        <span>{{ t("addRecurring") }}</span>
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5 border border-gray-100 dark:border-gray-700"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ t("totalRecurring") }}
            </p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ recurringTransactions.length }}
            </p>
          </div>
          <div
            class="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-2xl"
          >
            🔄
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5 border border-gray-100 dark:border-gray-700"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ t("activeRecurring") }}
            </p>
            <p
              class="text-2xl font-bold text-emerald-600 dark:text-emerald-400"
            >
              {{ activeRecurringTransactions.length }}
            </p>
          </div>
          <div
            class="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-2xl"
          >
            ✅
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5 border border-gray-100 dark:border-gray-700"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ t("dueSoon") }}
            </p>
            <p class="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {{ dueSoonTransactions.length }}
            </p>
          </div>
          <div
            class="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-2xl"
          >
            ⏰
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5 border border-gray-100 dark:border-gray-700"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ t("upcomingWeek") }}
            </p>
            <p class="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {{ upcomingWeekCount }}
            </p>
          </div>
          <div
            class="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-2xl"
          >
            📅
          </div>
        </div>
      </div>
    </div>

    <!-- Due Soon Alerts -->
    <div
      v-if="dueSoonTransactions.length > 0"
      class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4"
    >
      <div class="flex items-start gap-3">
        <span class="text-2xl">⏰</span>
        <div>
          <p class="font-semibold text-amber-900 dark:text-amber-100">
            {{ t("upcomingTransactions") }}
          </p>
          <ul class="text-sm text-amber-700 dark:text-amber-300 mt-1 space-y-1">
            <li v-for="item in dueSoonTransactions.slice(0, 3)" :key="item.id">
              - {{ item.title }} ({{ formatDate(item.nextDueDate) }})
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Recurring List -->
    <div v-if="recurringTransactions.length > 0" class="space-y-3">
      <div
        v-for="item in recurringTransactions"
        :key="item.id"
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all"
        :class="{
          'opacity-60': !item.isActive,
        }"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div
              class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
              :style="{
                backgroundColor: getCategoryColor(item.category) + '20',
              }"
            >
              {{ getCategoryIcon(item.category) }}
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white">
                {{ item.title }}
              </h3>
              <div
                class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400"
              >
                <span>{{ formatCurrency(item.amount) }}</span>
                <span>•</span>
                <span class="capitalize">{{ t(item.recurrence) }}</span>
                <span>•</span>
                <span
                  >{{ t("nextDue") }}: {{ formatDate(item.nextDueDate) }}</span
                >
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button
              @click="toggleRecurring(item.id)"
              class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              :title="item.isActive ? t('pause') : t('resume')"
            >
              <span class="text-xl">{{ item.isActive ? "⏸️" : "▶️" }}</span>
            </button>
            <button
              @click="editRecurring(item)"
              class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              :title="t('edit')"
            >
              <span class="text-xl">✏️</span>
            </button>
            <button
              @click="deleteRecurring(item.id)"
              class="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
              :title="t('delete')"
            >
              <span class="text-xl">🗑️</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center"
    >
      <div class="text-6xl mb-4">🔄</div>
      <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {{ t("noRecurring") }}
      </h3>
      <p class="text-gray-600 dark:text-gray-400 mb-6">
        {{ t("noRecurringDescription") }}
      </p>
      <button
        @click="showAddModal = true"
        class="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold shadow-lg shadow-emerald-500/30 transition-all hover:-translate-y-0.5"
      >
        {{ t("addFirstRecurring") }}
      </button>
    </div>

    <!-- Add/Edit Modal -->
    <Transition name="modal">
      <div
        v-if="showAddModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div
          class="absolute inset-0 bg-black/60 backdrop-blur-sm"
          @click.self="closeModal"
        ></div>
        <div
          class="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 animate-modal-enter"
        >
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {{ editingId ? t("editRecurring") : t("addRecurring") }}
          </h2>

          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                {{ t("title") }}
              </label>
              <input
                v-model="form.title"
                type="text"
                required
                class="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                :placeholder="t('title')"
              />
            </div>

            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                {{ t("amount") }}
              </label>
              <div class="relative">
                <input
                  v-model="amountInput"
                  type="text"
                  inputmode="numeric"
                  required
                  class="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder="1,500,000"
                />
                <span
                  class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium"
                  >₫</span
                >
              </div>
            </div>

            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                {{ t("type") }}
              </label>
              <select
                v-model="form.type"
                class="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              >
                <option value="expense">{{ t("expense") }}</option>
                <option value="income">{{ t("income") }}</option>
              </select>
            </div>

            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                {{ t("category") }}
              </label>
              <select
                v-model="form.category"
                class="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              >
                <option value="">{{ t("selectCategory") }}</option>
                <option
                  v-for="cat in filteredCategories"
                  :key="cat.id"
                  :value="cat.id"
                >
                  {{ cat.icon }} {{ cat.name }}
                </option>
              </select>
            </div>

            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                {{ t("recurrence") }}
              </label>
              <select
                v-model="form.recurrence"
                class="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              >
                <option value="daily">{{ t("daily") }}</option>
                <option value="weekly">{{ t("weekly") }}</option>
                <option value="monthly">{{ t("monthly") }}</option>
                <option value="yearly">{{ t("yearly") }}</option>
              </select>
            </div>

            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                {{ t("nextDueDate") }}
              </label>
              <input
                v-model="form.nextDueDate"
                type="date"
                required
                class="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                {{ t("notes") }}
              </label>
              <textarea
                v-model="form.notes"
                rows="2"
                class="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                :placeholder="t('notes')"
              ></textarea>
            </div>

            <div class="flex gap-3 pt-4">
              <button
                type="button"
                @click="closeModal"
                class="flex-1 px-4 py-3 rounded-xl bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold transition-all"
              >
                {{ t("cancel") }}
              </button>
              <button
                type="submit"
                class="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold shadow-lg shadow-emerald-500/30 transition-all"
              >
                {{ t("save") }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useCategoryStore } from "../stores/categoryStore";
import { useRecurringStore } from "../stores/recurringStore";
import type { RecurrenceType, RecurringTransaction } from "../types";

const { t } = useI18n();
const recurringStore = useRecurringStore();
const categoryStore = useCategoryStore();

// State
const showAddModal = ref(false);
const editingId = ref<number | null>(null);
const form = ref({
  title: "",
  amount: 0,
  type: "expense" as "expense" | "income",
  category: undefined as number | undefined,
  recurrence: "monthly" as RecurrenceType,
  nextDueDate: new Date().toISOString().split("T")[0],
  notes: "",
});

// Computed
const recurringTransactions = computed(
  () => recurringStore.recurringTransactions,
);
const activeRecurringTransactions = computed(
  () => recurringStore.activeRecurringTransactions,
);
const dueSoonTransactions = computed(() => recurringStore.dueSoonTransactions);
const upcomingCounts = computed(() => recurringStore.upcomingCounts);

const upcomingWeekCount = computed(() => {
  return Object.values(upcomingCounts.value).reduce((a, b) => a + b, 0);
});

const filteredCategories = computed(() => {
  return categoryStore.categories.filter((cat) => cat.type === form.value.type);
});

// Format number with thousand separators (e.g., 1,500,000)
const formatNumber = (num: number): string => {
  if (!num) return "";
  return num.toLocaleString("vi-VN");
};

// Parse formatted number string to number
const parseNumber = (str: string): number => {
  if (!str) return 0;
  // Remove all non-digit characters except minus sign
  const cleaned = str.replace(/[^\d-]/g, "");
  return parseInt(cleaned, 10) || 0;
};

// Computed for amount input with formatting
const amountInput = computed({
  get: () => {
    return formatNumber(form.value.amount);
  },
  set: (value: string) => {
    form.value.amount = parseNumber(value);
  },
});

// Actions
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("vi-VN").format(new Date(date));
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const getCategoryColor = (categoryId: number | undefined) => {
  const category = categoryStore.getCategoryById(categoryId);
  return category?.color || "#6b7280";
};

const getCategoryIcon = (categoryId: number | undefined) => {
  const category = categoryStore.getCategoryById(categoryId);
  return category?.icon || "📦";
};

const openModal = () => {
  showAddModal.value = true;
};

const closeModal = () => {
  showAddModal.value = false;
  editingId.value = null;
  resetForm();
};

const resetForm = () => {
  form.value = {
    title: "",
    amount: 0,
    type: "expense",
    category: undefined,
    recurrence: "monthly",
    nextDueDate: new Date().toISOString().split("T")[0],
    notes: "",
  };
};

const editRecurring = (item: RecurringTransaction) => {
  editingId.value = item.id;
  form.value = {
    title: item.title,
    amount: item.amount,
    type: item.type,
    category: item.category,
    recurrence: item.recurrence,
    nextDueDate: new Date(item.nextDueDate).toISOString().split("T")[0],
    notes: item.notes || "",
  };
  openModal();
};

const handleSubmit = () => {
  if (editingId.value) {
    recurringStore.updateRecurringTransaction(editingId.value, {
      title: form.value.title,
      amount: form.value.amount,
      type: form.value.type,
      category: form.value.category,
      recurrence: form.value.recurrence,
      nextDueDate: new Date(form.value.nextDueDate),
      notes: form.value.notes,
    });
  } else {
    recurringStore.addRecurringTransaction({
      title: form.value.title,
      amount: form.value.amount,
      type: form.value.type,
      category: form.value.category,
      recurrence: form.value.recurrence,
      nextDueDate: new Date(form.value.nextDueDate),
      notes: form.value.notes,
      isActive: true,
    });
  }
  closeModal();
};

const toggleRecurring = (id: number) => {
  recurringStore.toggleRecurringTransaction(id);
};

const deleteRecurring = (id: number) => {
  if (confirm(t("confirmDelete"))) {
    recurringStore.deleteRecurringTransaction(id);
  }
};

// Process recurring on mount
recurringStore.checkAndProcessRecurring();

// Watch for type changes to filter categories
watch(
  () => form.value.type,
  () => {
    form.value.category = undefined;
  },
);
</script>

<style scoped>
/* Modal Transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .animate-modal-enter,
.modal-leave-active .animate-modal-enter {
  animation: modalSlideUp 0.3s ease;
}

@keyframes modalSlideUp {
  from {
    opacity: 0;
    transform: translateY(40px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
