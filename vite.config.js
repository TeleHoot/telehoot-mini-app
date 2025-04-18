import react from "@vitejs/plugin-react";
import { URL, fileURLToPath } from "node:url";
import process from "process";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return defineConfig({
    build: {
      outDir: 'dist',
    },
    define: {
      __API__: JSON.stringify(env.VITE_API),
      __IS_DEV__: JSON.stringify(env.VITE_IS_DEV),
    },
    server: {
      host: true,
      port: 5173,
      strictPort: true,
      hmr: false,
      cors: true,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,PATCH,OPTIONS"
      }
    },
    plugins: [
      react(),
      tsconfigPaths(),
    ],
    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js'],
      alias: {
        "@a": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  });
};
