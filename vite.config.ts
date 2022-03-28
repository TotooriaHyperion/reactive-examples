import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import host from "vite-plugin-host";
import * as path from "path";

const examples = [
  "p1_simple_reactive",
  "p2_glitches",
  "p3_transaction",
  "p4_form_linkage",
  "p5_cyclic_deps",
];

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), host()],
  server: {
    host: true,
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "./index.html"),
        ...examples.reduce(
          (acc, cur) => ({
            ...acc,
            [cur]: path.resolve(__dirname, `./src/${cur}/index.html`),
          }),
          {},
        ),
      },
    },
  },
});
