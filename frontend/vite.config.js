import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, 'VITE_')
  const contactRemote = env.VITE_CONTACT_API_URL?.trim()

  const proxy = {}
  if (mode === 'development' && contactRemote) {
    try {
      const { origin } = new URL(contactRemote)
      proxy['/api/contact'] = {
        target: origin,
        changeOrigin: true,
        secure: true,
      }
    } catch {
      console.warn('[vite] Invalid VITE_CONTACT_API_URL; /api/contact proxy disabled:', contactRemote)
    }
  }
  proxy['/api'] = {
    target: 'http://localhost:8000',
    changeOrigin: true,
    rewrite: (p) => p.replace(/^\/api/, ''),
  }

  return {
    plugins: [react()],
    server: {
      port: 3000,
      strictPort: false,
      host: true,
      proxy,
    },
    build: {
      outDir: 'dist',
      sourcemap: mode === 'development',
      minify: mode === 'production' ? 'esbuild' : false,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            router: ['react-router-dom'],
            ui: ['lucide-react'],
            supabase: ['@supabase/supabase-js'],
          },
        },
      },
    },
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    },
    optimizeDeps: {
      exclude: ['@tauri-apps/api', '@tauri-apps/api/*'],
    },
    ssr: {
      noExternal: ['@tauri-apps/api'],
    },
  }
})
