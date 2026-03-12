import { createI18n } from "vue-i18n";

const messages = {
  vi: {
    // App
    appName: "Quản Lý Chi Tiêu",
    dashboard: "Dashboard",
    transactions: "Giao Dịch",
    settings: "Cài Đặt",

    // Header
    newTransaction: "Giao dịch mới",

    // Tabs
    tabDashboard: "Dashboard",
    tabTransactions: "Giao dịch",
    tabSettings: "⚙️ Cài đặt",
    tabComparison: "So Sánh",
    tabBudget: "Ngân sách",
    tabRecurring: "Lặp lại",

    // Budget
    budgetDescription: "Quản lý giới hạn chi tiêu theo danh mục",
    addBudget: "Thêm ngân sách",
    editBudget: "Sửa ngân sách",
    totalBudget: "Tổng ngân sách",
    totalLimit: "Tổng giới hạn",
    totalSpent: "Đã chi",
    limit: "Giới hạn",
    spent: "Đã chi",
    remaining: "Còn lại",
    progress: "Tiến độ",
    budgetAmount: "Số tiền ngân sách",
    period: "Kỳ",
    daily: "Hàng ngày",
    weekly: "Hàng tuần",
    monthly: "Hàng tháng",
    selectCategory: "Chọn danh mục",
    noBudgets: "Chưa có ngân sách",
    noBudgetsDescription: "Hãy thêm ngân sách để theo dõi chi tiêu",
    addFirstBudget: "Thêm ngân sách đầu tiên",
    budgetWarning: "⚠️ Cảnh báo vượt ngân sách",
    overBudgetCategories: "Danh mục vượt ngân sách",

    // Export
    export: "Xuất báo cáo",
    exportCSV: "Xuất CSV",
    exportExcel: "Xuất Excel",
    exportPDF: "Xuất PDF",
    noDataExport: "Không có dữ liệu để xuất",
    exportSuccess: "Xuất báo cáo thành công",

    // Recurring
    recurringTransactions: "Giao dịch lặp lại",
    recurringDescription: "Quản lý các giao dịch định kỳ tự động",
    addRecurring: "Thêm giao dịch lặp",
    editRecurring: "Sửa giao dịch lặp",
    totalRecurring: "Tổng giao dịch lặp",
    activeRecurring: "Đang hoạt động",
    inactiveRecurring: "Đã tạm dừng",
    dueSoon: "Sắp đến hạn",
    upcomingWeek: "Tuần tới",
    upcomingTransactions: "Giao dịch sắp đến hạn",
    nextDue: "Hạn tới",
    pause: "Tạm dừng",
    resume: "Tiếp tục",
    nextDueDate: "Ngày hạn tới",
    recurrence: "Chu kỳ",
    yearly: "Hàng năm",
    noRecurring: "Chưa có giao dịch lặp",
    noRecurringDescription: "Hãy thêm các giao dịch định kỳ để tự động hóa",
    addFirstRecurring: "Thêm giao dịch lặp đầu tiên",

    // Stats
    monthlyIncome: "Thu nhập tháng này",
    monthlyExpense: "Chi tiêu tháng này",
    balance: "Số dư",

    // Charts
    last7Days: "Chi tiêu 7 ngày qua",
    expensesByCategory: "Chi tiêu theo danh mục",

    // Transaction Form
    addTransaction: "Thêm giao dịch mới",
    editTransaction: "Sửa giao dịch",
    title: "Tiêu đề",
    amount: "Số tiền",
    category: "Danh mục",
    date: "Ngày",
    status: "Trạng thái",
    notes: "Ghi chú",
    expense: "Chi tiêu",
    income: "Thu nhập",
    completed: "Đã hoàn thành",
    pending: "Đang chờ",
    cancelled: "Đã hủy",
    save: "Lưu",
    cancel: "Hủy",

    // Transaction Status
    statusCompleted: "Hoàn thành",
    statusPending: "Chờ thanh toán",
    statusCancelled: "Đã hủy",

    // Filter
    search: "🔍 Tìm kiếm...",
    allTypes: "Tất cả loại",
    allCategories: "Tất cả danh mục",
    sortByDate: "Theo ngày",
    sortByAmount: "Theo số tiền",
    sortByTitle: "Theo tiêu đề",

    // Empty States
    noTransactions: "Không tìm thấy giao dịch nào",
    trySearch: "Thử thay đổi bộ lọc hoặc thêm giao dịch mới",
    noData: "Chưa có dữ liệu",

    // Actions
    edit: "Sửa",
    delete: "Xóa",
    confirmDelete: "Bạn có chắc muốn xóa giao dịch này?",

    // Comparison
    compareMonths: "So Sánh Các Tháng",
    selectMonth1: "Tháng 1",
    selectMonth2: "Tháng 2",
    comparison: "So Sánh",
    incomeDifference: "Chênh lệch thu nhập",
    expenseDifference: "Chênh lệch chi tiêu",
    balanceDifference: "Chênh lệch số dư",
    emptyComparison: "Chưa có dữ liệu để so sánh",
    recentTransactions: "Giao dịch gần đây",

    // Settings
    language: "Ngôn ngữ",
    theme: "Giao diện",
    light: "Sáng",
    dark: "Tối",
    currency: "Tiền tệ",

    // Default
    defaultCategory: "Khác",
  },
  en: {
    // App
    appName: "Expense Tracker",
    dashboard: "Dashboard",
    transactions: "Transactions",
    settings: "Settings",

    // Header
    newTransaction: "+ New Transaction",

    // Tabs
    tabDashboard: "Dashboard",
    tabTransactions: "Transactions",
    tabSettings: "⚙️ Settings",
    tabComparison: "Compare",
    tabBudget: "Budget",
    tabRecurring: "🔄 Recurring",

    // Budget
    budgetDescription: "Manage spending limits by category",
    addBudget: "Add Budget",
    editBudget: "Edit Budget",
    totalBudget: "Total Budget",
    totalLimit: "Total Limit",
    totalSpent: "Total Spent",
    limit: "Limit",
    spent: "Spent",
    remaining: "Remaining",
    progress: "Progress",
    budgetAmount: "Budget Amount",
    period: "Period",
    daily: "Daily",
    weekly: "Weekly",
    monthly: "Monthly",
    selectCategory: "Select Category",
    noBudgets: "No Budgets",
    noBudgetsDescription: "Add budgets to track your spending",
    addFirstBudget: "Add First Budget",
    budgetWarning: "⚠️ Budget Warning",
    overBudgetCategories: "Categories over budget",

    // Export
    export: "Export Report",
    exportCSV: "Export CSV",
    exportExcel: "Export Excel",
    exportPDF: "Export PDF",
    noDataExport: "No data to export",
    exportSuccess: "Export successful",

    // Recurring
    recurringTransactions: "Recurring Transactions",
    recurringDescription: "Manage automatic periodic transactions",
    addRecurring: "Add Recurring",
    editRecurring: "Edit Recurring",
    totalRecurring: "Total Recurring",
    activeRecurring: "Active",
    inactiveRecurring: "Paused",
    dueSoon: "Due Soon",
    upcomingWeek: "Upcoming Week",
    upcomingTransactions: "Upcoming Transactions",
    nextDue: "Next Due",
    pause: "Pause",
    resume: "Resume",
    nextDueDate: "Next Due Date",
    recurrence: "Recurrence",
    yearly: "Yearly",
    noRecurring: "No Recurring Transactions",
    noRecurringDescription:
      "Add recurring transactions to automate your finances",
    addFirstRecurring: "Add First Recurring",

    // Stats
    monthlyIncome: "Income this month",
    monthlyExpense: "Expense this month",
    balance: "Balance",

    // Charts
    last7Days: "Last 7 days expenses",
    expensesByCategory: "Expenses by category",

    // Transaction Form
    addTransaction: "Add new transaction",
    editTransaction: "Edit transaction",
    title: "Title",
    amount: "Amount",
    category: "Category",
    date: "Date",
    status: "Status",
    notes: "Notes",
    expense: "Expense",
    income: "Income",
    completed: "Completed",
    pending: "Pending",
    cancelled: "Cancelled",
    save: "Save",
    cancel: "Cancel",

    // Transaction Status
    statusCompleted: "Completed",
    statusPending: "Pending",
    statusCancelled: "Cancelled",

    // Filter
    search: "🔍 Search...",
    allTypes: "All types",
    allCategories: "All categories",
    sortByDate: "By date",
    sortByAmount: "By amount",
    sortByTitle: "By title",

    // Empty States
    noTransactions: "No transactions found",
    trySearch: "Try changing filters or add new transaction",
    noData: "No data available",

    // Actions
    edit: "Edit",
    delete: "Delete",
    confirmDelete: "Are you sure you want to delete this transaction?",

    // Comparison
    compareMonths: "Compare Months",
    selectMonth1: "Month 1",
    selectMonth2: "Month 2",
    comparison: "Comparison",
    incomeDifference: "Income difference",
    expenseDifference: "Expense difference",
    balanceDifference: "Balance difference",
    emptyComparison: "No data to compare",
    recentTransactions: "Recent transactions",

    // Settings
    language: "Language",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    currency: "Currency",

    // Default
    defaultCategory: "Other",
  },
};

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem("locale") || "vi",
  fallbackLocale: "vi",
  messages,
});

export default i18n;
