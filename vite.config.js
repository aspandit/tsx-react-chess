import { defineConfig, createLogger } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true
  },
  customLogger: {
    ...createLogger(),
    info: (msg, options) => {
      // Suppresses Vite's Network log lines
      // - added to suppress the display of public IPv4
      if (msg.includes('Network:') && msg.includes('http'))
        createLogger().info(msg.replaceAll(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/g,""),options);
      else
        createLogger().info(msg, options);
    }
  }
})
