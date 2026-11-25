import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

const page = (name) => resolve(process.cwd(), "pages", name, "index.html");
const legacy = (name) => resolve(process.cwd(), name);

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
        figmaImporter: page("figma-importer"),
        legacyHome: legacy("index.html"),
        legacyAmazonSelfShip: legacy("amazon-self-ship.html"),
        legacyFigmaImporter: legacy("figma-importer.html"),
        legacyParcelxIQ: legacy("parcelx-iq.html"),
        legacyParcelxIQDemo: legacy("parcelx-iq-demo.html"),
        legacyParcelxIQProduct: legacy("parcelx-iq-product.html"),
        legacyKnowledgeBase: legacy("knowledge-base.html")
      }
    }
  }
});
