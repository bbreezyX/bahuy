// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

const astroServerAppCompat = {
  name: 'astro-server-app-compat',
  enforce: 'pre',
  async resolveId(id, importer) {
    if (id === 'astro:server-app.js') {
      const resolved = await this.resolve('astro:server-app', importer, {
        skipSelf: true,
      });
      return resolved?.id ?? 'astro:server-app';
    }
  },
};

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  vite: {
    plugins: [astroServerAppCompat, tailwindcss()],
  },
});
