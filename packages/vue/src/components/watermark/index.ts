import { App } from "vue";
import Watermark from "./src/index.vue";

export default {
  install: (app: App) => {
    app.component(Watermark.name, Watermark);
  },
};

export { Watermark };
