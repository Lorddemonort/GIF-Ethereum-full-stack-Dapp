import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/GIF-Ethereum-full-stack-Dapp/client',
  plugins: [react()],
})
