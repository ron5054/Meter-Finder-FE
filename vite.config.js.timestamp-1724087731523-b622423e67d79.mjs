// vite.config.js
import { defineConfig, loadEnv } from "file:///C:/Users/Yaron/Desktop/dev/Meter%20Finder/frontend/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/Yaron/Desktop/dev/Meter%20Finder/frontend/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { VitePWA } from "file:///C:/Users/Yaron/Desktop/dev/Meter%20Finder/frontend/node_modules/vite-plugin-pwa/dist/index.js";
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [
      react(),
      VitePWA({
        registerType: "autoUpdate",
        manifest: {
          name: "Meter Finder",
          short_name: "Meter Finder",
          description: "a small app designed to help electric meter readears to save the location of hard to find electric meters thus helping them find the location next time",
          theme_color: "#ffffff",
          version: env.VITE_APP_VERSION,
          icons: [
            {
              src: "/icons/256.png",
              sizes: "256x256",
              type: "image/png"
            },
            {
              src: "/icons/512.png",
              sizes: "512x512",
              type: "image/png"
            }
          ]
        }
      })
    ],
    build: {
      outDir: "../backend/public",
      emptyOutDir: true
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxZYXJvblxcXFxEZXNrdG9wXFxcXGRldlxcXFxNZXRlciBGaW5kZXJcXFxcZnJvbnRlbmRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXFlhcm9uXFxcXERlc2t0b3BcXFxcZGV2XFxcXE1ldGVyIEZpbmRlclxcXFxmcm9udGVuZFxcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvWWFyb24vRGVza3RvcC9kZXYvTWV0ZXIlMjBGaW5kZXIvZnJvbnRlbmQvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYgfSBmcm9tICd2aXRlJ1xyXG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnXHJcbmltcG9ydCB7IFZpdGVQV0EgfSBmcm9tICd2aXRlLXBsdWdpbi1wd2EnXHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiB7XHJcbiAgY29uc3QgZW52ID0gbG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpLCAnJylcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIHBsdWdpbnM6IFtcclxuICAgICAgcmVhY3QoKSxcclxuICAgICAgVml0ZVBXQSh7XHJcbiAgICAgICAgcmVnaXN0ZXJUeXBlOiAnYXV0b1VwZGF0ZScsXHJcbiAgICAgICAgbWFuaWZlc3Q6IHtcclxuICAgICAgICAgIG5hbWU6ICdNZXRlciBGaW5kZXInLFxyXG4gICAgICAgICAgc2hvcnRfbmFtZTogJ01ldGVyIEZpbmRlcicsXHJcbiAgICAgICAgICBkZXNjcmlwdGlvbjpcclxuICAgICAgICAgICAgJ2Egc21hbGwgYXBwIGRlc2lnbmVkIHRvIGhlbHAgZWxlY3RyaWMgbWV0ZXIgcmVhZGVhcnMgdG8gc2F2ZSB0aGUgbG9jYXRpb24gb2YgaGFyZCB0byBmaW5kIGVsZWN0cmljIG1ldGVycyB0aHVzIGhlbHBpbmcgdGhlbSBmaW5kIHRoZSBsb2NhdGlvbiBuZXh0IHRpbWUnLFxyXG4gICAgICAgICAgdGhlbWVfY29sb3I6ICcjZmZmZmZmJyxcclxuICAgICAgICAgIHZlcnNpb246IGVudi5WSVRFX0FQUF9WRVJTSU9OLFxyXG4gICAgICAgICAgaWNvbnM6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIHNyYzogJy9pY29ucy8yNTYucG5nJyxcclxuICAgICAgICAgICAgICBzaXplczogJzI1NngyNTYnLFxyXG4gICAgICAgICAgICAgIHR5cGU6ICdpbWFnZS9wbmcnLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgc3JjOiAnL2ljb25zLzUxMi5wbmcnLFxyXG4gICAgICAgICAgICAgIHNpemVzOiAnNTEyeDUxMicsXHJcbiAgICAgICAgICAgICAgdHlwZTogJ2ltYWdlL3BuZycsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICBdLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0pLFxyXG4gICAgXSxcclxuXHJcbiAgICBidWlsZDoge1xyXG4gICAgICBvdXREaXI6ICcuLi9iYWNrZW5kL3B1YmxpYycsXHJcbiAgICAgIGVtcHR5T3V0RGlyOiB0cnVlLFxyXG4gICAgfSxcclxuICB9XHJcbn0pXHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBa1YsU0FBUyxjQUFjLGVBQWU7QUFDeFgsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsZUFBZTtBQUd4QixJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLEtBQUssTUFBTTtBQUN4QyxRQUFNLE1BQU0sUUFBUSxNQUFNLFFBQVEsSUFBSSxHQUFHLEVBQUU7QUFFM0MsU0FBTztBQUFBLElBQ0wsU0FBUztBQUFBLE1BQ1AsTUFBTTtBQUFBLE1BQ04sUUFBUTtBQUFBLFFBQ04sY0FBYztBQUFBLFFBQ2QsVUFBVTtBQUFBLFVBQ1IsTUFBTTtBQUFBLFVBQ04sWUFBWTtBQUFBLFVBQ1osYUFDRTtBQUFBLFVBQ0YsYUFBYTtBQUFBLFVBQ2IsU0FBUyxJQUFJO0FBQUEsVUFDYixPQUFPO0FBQUEsWUFDTDtBQUFBLGNBQ0UsS0FBSztBQUFBLGNBQ0wsT0FBTztBQUFBLGNBQ1AsTUFBTTtBQUFBLFlBQ1I7QUFBQSxZQUNBO0FBQUEsY0FDRSxLQUFLO0FBQUEsY0FDTCxPQUFPO0FBQUEsY0FDUCxNQUFNO0FBQUEsWUFDUjtBQUFBLFVBQ0Y7QUFBQSxRQUNGO0FBQUEsTUFDRixDQUFDO0FBQUEsSUFDSDtBQUFBLElBRUEsT0FBTztBQUFBLE1BQ0wsUUFBUTtBQUFBLE1BQ1IsYUFBYTtBQUFBLElBQ2Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
