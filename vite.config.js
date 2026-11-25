import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

const page = (name) => resolve(process.cwd(), "pages", name, "index.html");

export default defineConfig({
  plugins: [react()],
  base: "/px-new-pages/",
  build: {
    rollupOptions: {
      input: {
        main: page("fulfillment"),
        parcelxIQ: page("parcelx-iq"),
        parcelxIQProduct: page("parcelx-iq-product"),
        parcelxIQDemo: page("parcelx-iq-demo"),
        amazonSelfShip: page("amazon-self-ship"),
        knowledgeBase: page("knowledge-base"),
        figmaImporter: page("figma-importer")
      }
    }
  }
});
