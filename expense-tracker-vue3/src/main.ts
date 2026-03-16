import { createPinia } from "pinia";
import { createApp } from "vue";
import AppRoot from "./AppRoot.vue";
import i18n from "./i18n";
import router from "./router";
import "./style.css";

const app = createApp(AppRoot);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(i18n);
app.mount("#app");
