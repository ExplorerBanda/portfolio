import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({

  base: "/portfolio/",

  plugins: [react()],

  resolve:{
    alias:{
      '@': path.resolve(__dirname,'./src')
    }
  },

  optimizeDeps:{
    include:[
      "react",
      "react-dom"
    ]
  },

  build:{
    chunkSizeWarningLimit:1500,

    rollupOptions:{
      output:{
        manualChunks:{
          
          vendor:[
            "react",
            "react-dom",
            "zustand"
          ],

          three:[
            "three",
            "@react-three/fiber",
            "@react-three/drei"
          ],

          animations:[
            "gsap",
            "framer-motion"
          ]

        }
      }
    }
  }

})