import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
});

// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import tailwindcss from "@tailwindcss/vite";
// import basicSsl from "@vitejs/plugin-basic-ssl";

// export default defineConfig({
//   base: "/",
//   plugins: [tailwindcss(), react(), basicSsl()],
//   server: {
//     host: true,
//     https: true,
//     port: 5173,
//   },
// });
