import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    legacy({
      targets: ['defaults', 'not IE 11']
    })
  ],
  resolve: {
    alias: {
      'react': path.resolve('./node_modules/react'),
      'react-redux': path.resolve('./node_modules/react-redux'),
      '@material-ui': path.resolve('./node_modules/@material-ui'),
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // Add Remote-User header if REMOTE_USER env var is set
            if (process.env.REMOTE_USER) {
              proxyReq.setHeader('Remote-User', process.env.REMOTE_USER);
            }
          });
        }
      }
    }
  },
  build: {
    outDir: 'build',
    assetsDir: 'static',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          material: ['@material-ui/core', '@material-ui/icons']
        }
      }
    }
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    'process.env.PUBLIC_URL': JSON.stringify(process.env.PUBLIC_URL || ''),
    'process.env.REACT_APP_API_URL': JSON.stringify(process.env.REACT_APP_API_URL),
    'process.env.REMOTE_USER': JSON.stringify(process.env.REMOTE_USER)
  },
  base: process.env.PUBLIC_URL || '/'
})
