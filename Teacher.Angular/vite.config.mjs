import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig({
  root: 'src',   // Point Vite root to where your index.html lives
  build: {
    outDir: '../dist', // output relative to `root`
  },
  resolve: { mainFields: ['module'] },
  plugins: [angular()],
  server: {
    port: 4021
  }
});
