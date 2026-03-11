import { createPinia } from "pinia";
import { createApp } from "vue";
import App from "./App.vue";
import "./style.css";

// Tạo Pinia instance
const pinia = createPinia();
const app = createApp(App);

// Sử dụng Pinia trong app
app.use(pinia);
app.mount("#app");
