# 💰 Expense Tracker - Vue 3 Learning Project

Ứng dụng quản lý chi tiêu được xây dựng với Vue 3 + TypeScript + Pinia + TailwindCSS, dùng để ôn luyện các kiến thức Vue 3.

## 🚀 Tính năng

### Core Features

- ✅ **Dashboard** - Thống kê thu/chi với biểu đồ trực quan
- ✅ **Quản lý giao dịch** - Thêm, sửa, xóa giao dịch
- ✅ **Danh mục** - Phân loại chi tiêu theo danh mục
- ✅ **Filter & Search** - Lọc và tìm kiếm giao dịch
- ✅ **So sánh tháng** - So sánh thu chi giữa 2 tháng
- ✅ **Budget Management** - Giới hạn chi tiêu theo danh mục (Tab Ngân sách)
- ✅ **Export Reports** - Xuất báo cáo CSV/Excel/PDF
- ✅ **Recurring Transactions** - Giao dịch lặp lại định kỳ (Tab Lặp lại)
- ✅ **Dark Mode** - Chế độ tối/sáng (Tailwind v4 với data-mode)
- ✅ **Đa ngôn ngữ** - Tiếng Việt & Tiếng Anh (i18n)
- ✅ **LocalStorage** - Lưu dữ liệu cục bộ
- ✅ **Responsive** - Hỗ trợ mobile với TailwindCSS

### Tech Stack

| Công nghệ | Mục đích |
|-----------|----------|
| Vue 3 | Framework chính (Composition API) |
| TypeScript | Type safety |
| Vite | Build tool & Dev server |
| Pinia | State management |
| TailwindCSS v4 | Styling & Responsive (cập nhật mới) |
| Vue I18n | Đa ngôn ngữ |
| xlsx | Export Excel (.xlsx) |
| jspdf | Export PDF |
| date-fns | Xử lý ngày tháng |

## 📚 Kiến thức Vue 3 được ôn luyện

### 1. Composition API

- `ref`, `reactive` - Tạo reactive state
- `computed` - Tạo giá trị tính toán
- `watch` - Theo dõi thay đổi
- Lifecycle hooks (`onMounted`, `watch`)
- `async/await` với composables

### 2. TypeScript với Vue 3

- Define types/interfaces
- Typed props và emits
- Generic types trong composables
- Type guards và type assertions

### 3. Pinia Store

- State management
- Getters (computed values)
- Actions
- Persistence với localStorage
- Watch trong store

### 4. Components

- Props và Emits
- v-model trong components
- Component communication
- Reusable components

### 5. Directives

- `v-if`, `v-else`, `v-show`
- `v-for` với key
- `v-model` cho form
- `:class`, `:style` binding

### 6. Composables

- Custom composable `useFormat()` cho format currency/date
- Custom composable `useExport()` cho export PDF/Excel/CSV
- Async composables với dynamic imports
- Reusable logic patterns

### 7. Form Handling

- Form validation cơ bản
- Controlled components
- Submit handling

### 8. Animations

- `<Transition>` component
- CSS animations

### 9. Vue I18n (Multi-language)

- Setup i18n
- Translation keys
- Locale switching

### 10. TailwindCSS v4

- `@import "tailwindcss"` syntax mới
- `@theme` block cho custom colors
- `@custom-variant` cho dark mode
- Dark mode với `data-mode` attribute
- Responsive design

## 🏗️ Cấu trúc project

```
expense-tracker-vue3/
├── src/
│   ├── components/
│   │   ├── Budget.vue             # ✨ Quản lý ngân sách
│   │   ├── Comparison.vue         # ⭐ So sánh các tháng
│   │   ├── Dashboard.vue          # Dashboard với stats, charts & export
│   │   ├── Recurring.vue          # ✨ Quản lý giao dịch lặp lại
│   │   ├── TransactionForm.vue    # Form thêm/sửa giao dịch
│   │   ├── TransactionItem.vue    # Item giao dịch đơn lẻ
│   │   └── TransactionList.vue    # Danh sách với filter
│   ├── composables/
│   │   ├── useExport.ts           # ✨ Export PDF/Excel/CSV
│   │   └── useFormat.ts           # Format currency, date
│   ├── i18n/
│   │   └── index.ts               # ⭐ Cấu hình đa ngôn ngữ (Vi/En)
│   ├── stores/
│   │   ├── budgetStore.ts         # ✨ Store cho ngân sách
│   │   ├── categoryStore.ts       # Store cho danh mục
│   │   ├── recurringStore.ts      # ✨ Store cho giao dịch lặp lại
│   │   ├── settingsStore.ts       # Store cho settings
│   │   └── transactionStore.ts    # Store cho giao dịch
│   ├── types/
│   │   └── index.ts               # TypeScript types (bao gồm RecurringTransaction)
│   ├── App.vue                    # Main component với tabs
│   ├── main.ts                    # Entry point
│   └── style.css                  # ✨ Tailwind v4 (@import syntax)
├── postcss.config.js              # ⭐ PostCSS config
├── package.json
└── README.md
```

## 🎯 Các bài học chính

### Bài 1: Setup Project & TypeScript Types

- Tạo project với Vite
- Cài đặt dependencies (Pinia, Vue I18n, TailwindCSS)
- Define TypeScript interfaces

### Bài 2: Pinia Store Basics

- Tạo stores với defineStore
- State, Getters, Actions
- LocalStorage persistence

### Bài 3: Components & Props

- Tạo components reusable
- Props typing
- Emits với TypeScript

### Bài 4: Composables

- Tạo custom composable
- Use composables trong components
- Reusability patterns

### Bài 5: Form Handling

- Controlled forms với v-model
- Form validation
- Submit handling

### Bài 6: Computed & Watch

- Computed properties
- Watchers
- Computed vs Watch

### Bài 7: Lifecycle Hooks

- onMounted
- onUnmounted
- Other lifecycle hooks

### Bài 8: Animations & Transitions

- Transition component
- CSS animations
- List transitions

### Bài 9: Multi-language (i18n) ⭐

- Setup Vue I18n
- Tạo translation files
- Sử dụng t() trong components
- Locale switching

### Bài 10: TailwindCSS ⭐

- Setup TailwindCSS
- Utility classes
- Dark mode với Tailwind
- Responsive design

### Bài 11: Month Comparison ⭐

- So sánh thống kê 2 tháng
- Biểu đồ so sánh
- Tính toán chênh lệch %

### Bài 12: Budget Management ✨

- Theo dõi giới hạn chi tiêu theo danh mục
- Progress bar với màu sắc theo trạng thái
- Cảnh báo khi vượt ngân sách
- Computed properties phức tạp

### Bài 13: Export PDF/Excel ✨

- Dynamic imports với xlsx và jspdf
- Tạo file CSV với Blob API
- Export Excel với xlsx library
- Export PDF với jsPDF
- Async/await pattern

### Bài 14: Recurring Transactions ✨

- Quản lý giao dịch định kỳ (hàng ngày/tuần/tháng/năm)
- Tự động tạo giao dịch khi đến hạn
- Tạm dừng/tiếp tục giao dịch lặp
- Cảnh báo giao dịch sắp đến hạn
- Computed properties phức tạp cho thống kê
- Watch trong store

## 🛠️ Cài đặt & Chạy

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📖 Tài liệu tham khảo

- [Vue 3 Documentation](https://vuejs.org/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev/)
- [Vue I18n Documentation](https://vue-i18n.intlify.dev/)
- [TailwindCSS Documentation](https://tailwindcss.com/)

## 🎓 Bài tập mở rộng

### Đã hoàn thành (v2.2)

- [x] Dashboard với thống kê
- [x] Quản lý giao dịch (CRUD)
- [x] Filter & Search
- [x] Dark Mode (data-mode với Tailwind v4)
- [x] Đa ngôn ngữ (Vi/En)
- [x] So sánh các tháng
- [x] **Budget Management** - Giới hạn chi tiêu theo danh mục
- [x] **Export Reports** - Xuất PDF/Excel/CSV
- [x] **Recurring Transactions** - Giao dịch lặp lại định kỳ
- [x] TailwindCSS v4 styling

### Đề xuất mở rộng

1. **Multi-currency** - Hỗ trợ nhiều loại tiền
2. **Charts nâng cao** - Dùng Chart.js hoặc ApexCharts
3. **PWA Service Worker** - Offline support
4. **Notifications API** - Thông báo desktop khi giao dịch đến hạn
5. **Backend Integration** - Kết nối API thực tế
6. **Authentication** - Đăng nhập/Đăng ký
7. **Data Import/Export** - Sao lưu và khôi phục dữ liệu
8. **Reports** - Báo cáo theo tuần/năm

## 💡 Mẹo học tập

1. **Đọc code từ dưới lên** - Bắt đầu từ `main.ts` → `App.vue` → components
2. **Chạy thử và debug** - Sử dụng Vue DevTools
3. **Sửa code và xem kết quả** - Hot reload giúp học nhanh hơn
4. **Tự làm lại** - Thử tự tạo lại project từ đầu
5. **Mở rộng tính năng** - Thêm các tính năng mới để học thêm
6. **Dịch sang ngôn ngữ khác** - Thực hành i18n
7. **Customize theme** - Thực hành TailwindCSS

## 📝 Change Log

### v2.2 (2025-03-11) - Recurring Transactions Features ⭐

- ✨ **Tab Lặp lại (Recurring)** - Quản lý giao dịch định kỳ
  - Hỗ trợ 4 chu kỳ: Hàng ngày, Hàng tuần, Hàng tháng, Hàng năm
  - Tự động tạo giao dịch thực tế khi đến hạn
  - Tạm dừng/tiếp tục kích hoạt giao dịch lặp
  - Thống kê: Tổng số, Đang hoạt động, Sắp đến hạn, Tuần tới
  - Cảnh báo khi giao dịch sắp đến hạn (trong 3 ngày)
  - Auto-processing mỗi 24 giờ khi mở app
- 📦 **RecurringStore** - Store mới cho giao dịch lặp
  - State persistence với localStorage
  - Getters cho các thống kê phức tạp
  - Actions: CRUD, toggle active, calculateNextDueDate, processRecurring
- 🎨 **Cập nhật UI**
  - Stats cards với thông tin chi tiết
  - Modal thêm/sửa giao dịch lặp
  - Alert warning cho giao dịch đến hạn
  - Responsive design cho mobile
- 📚 **Cập nhật Types & i18n**
  - Thêm `RecurringTransaction` interface
  - 20+ từ khóa mới cho giao dịch lặp (Tiếng Việt & Tiếng Anh)
- 🔧 **Cải thiện**
  - Auto-process recurring trên component mount
  - Optimized re-renders với computed properties

**Flow triển khai:**

1. Thêm `RecurringTransaction` interface vào `types/index.ts`
2. Tạo `recurringStore.ts` với logic xử lý giao dịch lặp
3. Tạo `Recurring.vue` component với UI đầy đủ
4. Cập nhật `i18n/index.ts` với 20+ từ khóa mới
5. Cập nhật `App.vue` thêm tab "Lặp lại"
6. Import và tích hợp `Recurring component`
7. Test和各种场景 (tạo, sửa, xóa, pause, auto-process)

### v2.1 (2025-03-11) - Budget & Export Features ⭐

- ✨ **Tab Ngân sách (Budget)** - Theo dõi giới hạn chi tiêu theo danh mục
  - Hỗ trợ 3 kỳ: Hàng ngày, Hàng tuần, Hàng tháng
  - Progress bar với màu sắc theo trạng thái (xanh/amber/đỏ)
  - Cảnh báo khi vượt ngân sách
  - Tổng hợp thống kê tất cả ngân sách
- ✨ **Export Reports** - Xuất báo cáo PDF/Excel/CSV từ Dashboard
  - Export CSV (utf-8 with BOM cho Excel đọc đúng)
  - Export Excel (.xlsx) với xlsx library
  - Export PDF với jsPDF
  - Dynamic imports để tối ưu kích thước bundle
- 🎨 **Cập nhật TailwindCSS v4**
  - Sử dụng `@import "tailwindcss"` syntax mới
  - `@theme` block cho custom colors
  - `@custom-variant dark` cho dark mode
  - Dark mode với `data-mode` attribute thay vì class
- 🔧 **Cải thiện responsive và UI**
  - Responsive design cho mobile
  - Tab navigation để dễ chuyển đổi trang
  - Cập nhật ngôn ngữ tiếng Việt (mặc định)
- 🐛 **Fix bugs**
  - Đảm bảo dark mode hoạt động đúng với Tailwind v4
  - Sửa lỗi import export libraries

**Flow triển khai:**

1. Cài đặt dependencies: `npm install xlsx jspdf`
2. Cập nhật `style.css` sang Tailwind v4 syntax
3. Tạo `budgetStore.ts` theo dõi ngân sách
4. Tạo `Budget.vue` component
5. Tạo `useExport.ts` composable
6. Cập nhật `i18n/index.ts` với từ khóa mới
7. Cập nhật `App.vue` thêm tab Budget
8. Cập nhật `Dashboard.vue` với nút export
9. Cập nhật `settingsStore.ts` sử dụng data-mode
10. Test và debug

### v2.0 (2025-02-XX) - Comparison & i18n

- ✨ Thêm Tab So Sánh các tháng
- ✨ Thêm đa ngôn ngữ (Vietnamese/English)
- ✨ Chuyển sang TailwindCSS v3
- ✨ Fix Dark Mode hoạt động đúng
- ✨ Thêm biểu đồ so sánh trực quan

### v1.0 (Ban đầu)

- ✨ Setup project cơ bản
- ✨ Dashboard với thống kê
- ✨ CRUD giao dịch
- ✨ Filter & Search

---

**Happy Coding! 🎉**
