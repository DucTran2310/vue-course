# Testing Documentation - Todo App Vue 3

## 📋 Tổng quan

Dự án sử dụng **Vitest** cùng với **Vue Test Utils** và **Happy-DOM** cho unit testing.

---

## 🛠️ Công cụ Testing

- **Vitest**: Test runner nhanh, tích hợp sẵn với Vite
- **@vue/test-utils**: Công cụ testing cho Vue components
- **happy-dom**: môi trường DOM nhẹ cho testing
- **TypeScript**: Full type safety cho tests

---

## 📦 Cài đặt

```bash
npm install -D vitest @vue/test-utils @vitest/ui happy-dom
```

---

## 🚀 Chạy Tests

### Chạy tất cả tests (watch mode)

```bash
npm test
```

### Chạy tất cả tests (single run)

```bash
npm run test:run
```

### Chạy tests với UI

```bash
npm run test:ui
```

---

## 📊 Test Coverage

Hiện tại có **44 unit tests** cho TodoStore:

### Thống kê

- ✅ 44/44 tests passing (100%)
- ⏱️ Thời gian chạy: ~350ms
- 📁 1 test file

---

## 📁 Cấu trúc Tests

```
src/
├── stores/
│   └── __tests__/
│       └── todoStore.spec.ts    (44 tests cho TodoStore)
└── test/
    └── setup.ts                 (Mock localStorage)
```

---

## 🧪 Categories Tests

### 1. Initial State (4 tests)

- ✅ Khởi tạo với todos rỗng
- ✅ Khởi tạo với filter mặc định
- ✅ Khởi tạo với sort mặc định
- ✅ Khởi tạo với categories mặc định

### 2. Add Todo (7 tests)

- ✅ Thêm todo mới
- ✅ Không thêm todo rỗng
- ✅ Không thêmtodo chỉ có whitespace
- ✅ Thêm todo với ưu tiên cao
- ✅ Thêm todo với hạn hoàn thành
- ✅ Thêm todo với mô tả
- ✅ Thêm todo với danh mục

### 3. Toggle Todo (1 test)

- ✅ Toggle trạng thái hoàn thành

### 4. Delete Todo (1 test)

- ✅ Xóa todo

### 5. Update Todo Text (2 tests)

- ✅ Cập nhật text todo
- ✅ Không cập nhật thành text rỗng

### 6. Update Todo Priority (1 test)

- ✅ Cập nhật mức độ ưu tiên

### 7. Update Todo Due Date (2 tests)

- ✅ Cập nhật hạn hoàn thành
- ✅ Xóa hạn hoàn thành

### 8. Update Todo Category (1 test)

- ✅ Cập nhật danh mục

### 9. Filter Todos (3 tests)

- ✅ Lọc tất cả todos
- ✅ Lọc todos chưa hoàn thành
- ✅ Lọc todos đã hoàn thành

### 10. Search Todos (2 tests)

- ✅ Tìm kiếm theo text
- ✅ Case insensitive search

### 11. Sort Todos (4 tests)

- ✅ Sắp xếp theo ngày (mới nhất)
- ✅ Sắp xếp theo mức độ ưu tiên
- ✅ Sắp xếp theo hạn hoàn thành
- ✅ Sắp xếp theo tên

### 12. Computed Properties (5 tests)

- ✅ Tính active count đúng
- ✅ Tính completed count đúng
- ✅ Tính total count đúng
- ✅ Tính progress percentage đúng
- ✅ Trả về 0% khi không có todo

### 13. Overdue Todos (3 tests)

- ✅ Nhận diện todo quá hạn
- ✅ Không đếm todo đã hoàn thành là quá hạn
- ✅ Không đếm todo trong tương lai là quá hạn

### 14. Clear Completed (1 test)

- ✅ Xóa todos đã hoàn thành

### 15. Clear All (1 test)

- ✅ Xóa tất cả todos

### 16. Dark Mode (1 test)

- ✅ Toggle dark mode

### 17. Categories (3 tests)

- ✅ Thêm category mới
- ✅ Xóa category
- ✅ Xóa category khỏi todos khi category bị xóa

### 18. Export/Import (2 tests)

- ✅ Export todos
- ✅ Import todos

---

## 🔧 Cấu hình Vitest

File cấu hình: `vitest.config.ts`

```typescript
import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: "./src/test/setup.ts",
  },
});
```

---

## 📝 Test Setup

File setup: `src/test/setup.ts`

Mock localStorage để tránh side effects:

```typescript
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(globalThis, "localStorage", {
  value: localStorageMock,
  writable: true,
});
```

---

## 🧩 Ví dụ Test

### Test cơ bản

```typescript
import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useTodoStore } from "../todoStore";

describe("TodoStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
  });

  it("should add a new todo", () => {
    const store = useTodoStore();
    store.addTodo("Test task");

    expect(store.todos).toHaveLength(1);
    expect(store.todos[0]?.text).toBe("Test task");
  });
});
```

### Test với mock

```typescript
it("should clear all todos", () => {
  const store = useTodoStore();
  store.addTodo("Task 1");
  store.addTodo("Task 2");

  // Mock confirm dialog
  globalThis.confirm = vi.fn(() => true);

  store.clearAll();

  expect(store.todos).toHaveLength(0);
});
```

---

## 📈 Best Practices

### 1. Isolation

- Mỗi test chạy độc lập với `beforeEach`
- Clean state trước mỗi test

### 2. Mocking

- Mock localStorage, confirm, alert khi cần
- Mock browser APIs (createElement, URL, etc.)

### 3. Assertions

- Sử dụng optional chaining `?.` cho array access
- Check null/undefined khi cần

### 4. Test Naming

- Dùng format: `should [action] when [condition]`
- Rõ ràng, dễ hiểu

### 5. Coverage

- Test các edge cases (empty strings, null values)
- Test cả happy path và error cases

---

## 🎯 Testing Checklist

- [ ] All store actions tested
- [ ] All computed properties tested
- [ ] Edge cases tested
- [ ] Error handling tested
- [ ] Integration between features tested
- [ ] LocalStorage persistence tested
- [ ] Mocking đúng như real behavior

---

## 🐛 Debugging Tests

### Xem detailed output

```bash
npm test -- --reporter=verbose
```

### Chạy specific test

```bash
npm test -- --grep "should add a new todo"
```

### Watch mode với file cụ thể

```bash
npm test -- todoStore.spec.ts
```

---

## 🚧 Tương lai: Component Tests

Plans để thêm component tests:

```typescript
// Ví dụ component test cho TodoItem
import { mount } from "@vue/test-utils";
import TodoItem from "../TodoItem.vue";

describe("TodoItem", () => {
  it("should render todo text", () => {
    const wrapper = mount(TodoItem, {
      props: {
        todo: {
          id: 1,
          text: "Test todo",
          completed: false,
          priority: "medium",
          createdAt: new Date(),
        },
      },
    });

    expect(wrapper.text()).toContain("Test todo");
  });
});
```

---

## 📚 Resources

- [Vitest Documentation](https://vitest.dev/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Testing Best Practices](https://vuejs.org/guide/scaling-up/testing.html)

---

## ✨ Tips

1. **Fast Feedback**: Sử dụng `--watch` mode để re-run tự động
2. **Good Names**: Test names nên là complete sentences
3. **One Assertion**: Ideal là một assert per test (nhưng có thể nhiều nếu cần)
4. **Arrange-Act-Assert**: Structure tests theo pattern này
5. **Test Behavior, Not Implementation**: Test hệ thống hoạt động như thế nào, không phải implementation details

---

Last Updated: 2026-03-04
