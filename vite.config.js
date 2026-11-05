import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/Dukann/",
  plugins: [tailwindcss()],
});
