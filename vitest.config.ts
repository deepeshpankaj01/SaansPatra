import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      include: ['src/lib/**'],
    },
  },
  resolve: {
    alias: {
      '@/app': path.resolve(__dirname, './app'),
      '@': path.resolve(__dirname, './src'),
    },
  },
});
