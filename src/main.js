import App from "./App.svelte";
import "./locale/i18n"


const app = new App({
  target: document.body,
  props: {
    name: "world",
  },
});

export default app;
