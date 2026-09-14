import { defineConfig } from 'vite';
import { sites } from '@openai/sites-vite-plugin';

export default defineConfig(({ mode }) => {
  const isVercel = mode === 'vercel';
  const origin = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'https://painters-paints.vercel.app';

  return {
    plugins: isVercel
      ? [{
          name: 'vercel-static-metadata',
          transformIndexHtml(html) {
            return html.replaceAll('__SITE_ORIGIN__', origin);
          }
        }]
      : [sites()],
    server: { watch: { useFsEvents: false, usePolling: true } },
    build: {
      outDir: 'dist/client',
      rolldownOptions: { input: { main: 'index.html', credits: 'image-credits.html' } }
    }
  };
});
