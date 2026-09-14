import { defineConfig } from 'vite';
import { sites } from '@openai/sites-vite-plugin';
export default defineConfig({
  plugins: [sites()],
  server: { watch: { useFsEvents: false, usePolling: true } },
  build: { outDir: 'dist/client', rolldownOptions: { input: { main: 'index.html', credits: 'image-credits.html' } } }
});
