import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve(__dirname, '..'), '');
  const serverPort = parseInt(env.PORT || '5000', 10);
  const clientPort = parseInt(env.CLIENT_PORT || '5173', 10);

  return {
    plugins: [react()],
    server: {
      port: clientPort,
      proxy: {
        '/api': {
          target: `http://localhost:${serverPort}`,
          changeOrigin: true
        }
      }
    }
  };
});
