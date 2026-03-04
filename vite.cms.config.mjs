import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const previewBase = process.env.PR_PREVIEW_PATH || "/";
const adminBase = path.posix.join(previewBase, "admin/");

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: adminBase,
  build: {
    outDir: "public/admin",
    emptyOutDir: false,
    sourcemap: true,
    cssCodeSplit: true,
    rollupOptions: {
      input: path.resolve("src/admin/preview.tsx"),
      output: {
        entryFileNames: "preview.bundle.js",
        assetFileNames: (assetInfo) => {
          const assetNames = assetInfo.names ?? [];
          if (assetNames.some((name) => name.endsWith(".css"))) {
            return "preview.css";
          }
          return "assets/[name][extname]";
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve("src"),
      "clean-stack": path.resolve("src/admin/stubs/clean-stack.ts"),
    },
  },
  define: {
    __CMS_ROOT__: JSON.stringify(process.cwd()),
  },
});
