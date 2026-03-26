// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://elymas.github.io',
  base: '/agent-seminar',
  vite: {
    plugins: [tailwindcss()],
  },
});
