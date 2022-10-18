import { App } from "vue";
import Watermark from "./src/index.vue";

export { Watermark };
export default {
  install: (app: App) => {
    app.component(Watermark.name, Watermark);
  },
};
