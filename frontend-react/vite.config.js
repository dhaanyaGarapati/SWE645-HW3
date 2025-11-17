// Team Members:
// Lasya Reddy Mekala (G01473683)
// Supraja Naraharisetty(G01507868)
// Trinaya Kodavati (G01506073)
// Dhaanya S Garapati (G01512900)

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
})
