import { defineConfig } from "vite";
import tailwind from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    tailwind(),
    tanstackStart({
      server: { entry: "server" },
    }),
    react(),
  ],
});
