// vite.config.js
import react from "file:///C:/Users/turki/WebstormProjects/telehoot-mini-app/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { fileURLToPath, URL } from "node:url";
import process from "process";
import tailwindcss from "file:///C:/Users/turki/WebstormProjects/telehoot-mini-app/node_modules/@tailwindcss/vite/dist/index.mjs";
import { defineConfig, loadEnv } from "file:///C:/Users/turki/WebstormProjects/telehoot-mini-app/node_modules/vite/dist/node/index.js";
import tsconfigPaths from "file:///C:/Users/turki/WebstormProjects/telehoot-mini-app/node_modules/vite-tsconfig-paths/dist/index.js";
var __vite_injected_original_import_meta_url = "file:///C:/Users/turki/WebstormProjects/telehoot-mini-app/vite.config.js";
var vite_config_default = ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return defineConfig({
    build: {
      outDir: "dist"
    },
    define: {
      __API__: JSON.stringify(env.VITE_API),
      __IS_DEV__: JSON.stringify(env.VITE_IS_DEV)
    },
    server: {
      allowedHosts: [
        "mini-app.frp.vstrechya.space"
      ]
    },
    plugins: [
      react(),
      tailwindcss(),
      tsconfigPaths()
    ],
    resolve: {
      extensions: [".tsx", ".ts", ".jsx", ".js"],
      alias: {
        "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
      }
    }
  });
};
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFx0dXJraVxcXFxXZWJzdG9ybVByb2plY3RzXFxcXHRlbGVob290LW1pbmktYXBwXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFx0dXJraVxcXFxXZWJzdG9ybVByb2plY3RzXFxcXHRlbGVob290LW1pbmktYXBwXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy90dXJraS9XZWJzdG9ybVByb2plY3RzL3RlbGVob290LW1pbmktYXBwL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSBcIm5vZGU6dXJsXCI7XG5pbXBvcnQgcHJvY2VzcyBmcm9tIFwicHJvY2Vzc1wiO1xuaW1wb3J0IHRhaWx3aW5kY3NzIGZyb20gXCJAdGFpbHdpbmRjc3Mvdml0ZVwiO1xuXG5pbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHRzY29uZmlnUGF0aHMgZnJvbSBcInZpdGUtdHNjb25maWctcGF0aHNcIjtcblxuZXhwb3J0IGRlZmF1bHQgKHsgbW9kZSB9KSA9PiB7XG4gIGNvbnN0IGVudiA9IGxvYWRFbnYobW9kZSwgcHJvY2Vzcy5jd2QoKSwgXCJcIik7XG5cbiAgcmV0dXJuIGRlZmluZUNvbmZpZyh7XG4gICAgYnVpbGQ6IHtcbiAgICAgIG91dERpcjogXCJkaXN0XCIsXG4gICAgfSxcbiAgICBkZWZpbmU6IHtcbiAgICAgIF9fQVBJX186IEpTT04uc3RyaW5naWZ5KGVudi5WSVRFX0FQSSksXG4gICAgICBfX0lTX0RFVl9fOiBKU09OLnN0cmluZ2lmeShlbnYuVklURV9JU19ERVYpLFxuICAgIH0sXG4gICAgc2VydmVyOiB7XG4gICAgICBhbGxvd2VkSG9zdHM6IFtcbiAgICAgICAgXCJtaW5pLWFwcC5mcnAudnN0cmVjaHlhLnNwYWNlXCIsXG4gICAgICBdLFxuICAgIH0sXG4gICAgcGx1Z2luczogW1xuICAgICAgcmVhY3QoKSxcbiAgICAgIHRhaWx3aW5kY3NzKCksXG4gICAgICB0c2NvbmZpZ1BhdGhzKCksXG4gICAgXSxcbiAgICByZXNvbHZlOiB7XG4gICAgICBleHRlbnNpb25zOiBbXCIudHN4XCIsIFwiLnRzXCIsIFwiLmpzeFwiLCBcIi5qc1wiXSxcbiAgICAgIGFsaWFzOiB7XG4gICAgICAgIFwiQFwiOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoXCIuL3NyY1wiLCBpbXBvcnQubWV0YS51cmwpKSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSk7XG59O1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUErVSxPQUFPLFdBQVc7QUFDalcsU0FBUyxlQUFlLFdBQVc7QUFDbkMsT0FBTyxhQUFhO0FBQ3BCLE9BQU8saUJBQWlCO0FBRXhCLFNBQVMsY0FBYyxlQUFlO0FBQ3RDLE9BQU8sbUJBQW1CO0FBTnlMLElBQU0sMkNBQTJDO0FBUXBRLElBQU8sc0JBQVEsQ0FBQyxFQUFFLEtBQUssTUFBTTtBQUMzQixRQUFNLE1BQU0sUUFBUSxNQUFNLFFBQVEsSUFBSSxHQUFHLEVBQUU7QUFFM0MsU0FBTyxhQUFhO0FBQUEsSUFDbEIsT0FBTztBQUFBLE1BQ0wsUUFBUTtBQUFBLElBQ1Y7QUFBQSxJQUNBLFFBQVE7QUFBQSxNQUNOLFNBQVMsS0FBSyxVQUFVLElBQUksUUFBUTtBQUFBLE1BQ3BDLFlBQVksS0FBSyxVQUFVLElBQUksV0FBVztBQUFBLElBQzVDO0FBQUEsSUFDQSxRQUFRO0FBQUEsTUFDTixjQUFjO0FBQUEsUUFDWjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFDQSxTQUFTO0FBQUEsTUFDUCxNQUFNO0FBQUEsTUFDTixZQUFZO0FBQUEsTUFDWixjQUFjO0FBQUEsSUFDaEI7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQLFlBQVksQ0FBQyxRQUFRLE9BQU8sUUFBUSxLQUFLO0FBQUEsTUFDekMsT0FBTztBQUFBLFFBQ0wsS0FBSyxjQUFjLElBQUksSUFBSSxTQUFTLHdDQUFlLENBQUM7QUFBQSxNQUN0RDtBQUFBLElBQ0Y7QUFBQSxFQUNGLENBQUM7QUFDSDsiLAogICJuYW1lcyI6IFtdCn0K
