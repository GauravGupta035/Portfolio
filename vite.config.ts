/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';
import { tokenStylesheet } from './src/tokens/css.ts';

// Inline the design tokens into index.html so the custom properties are on
// :root before any script runs.
function designTokens(): Plugin {
  return {
    name: 'design-tokens',
    transformIndexHtml: () => [
      {
        tag: 'style',
        attrs: { id: 'design-tokens' },
        children: tokenStylesheet(),
        injectTo: 'head',
      },
    ],
  };
}

export default defineConfig({
  base: '/Portfolio/',
  plugins: [react(), designTokens()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
