import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const contentfulEnv = {
    VITE_CONTENTFUL_SPACE_ID:
      env.VITE_CONTENTFUL_SPACE_ID || env.CONTENTFUL_SPACE_ID || '',
    VITE_CONTENTFUL_ENVIRONMENT:
      env.VITE_CONTENTFUL_ENVIRONMENT || env.CONTENTFUL_ENVIRONMENT || '',
    VITE_CONTENTFUL_DELIVERY_TOKEN:
      env.VITE_CONTENTFUL_DELIVERY_TOKEN || env.CONTENTFUL_DELIVERY_TOKEN || '',
    VITE_CONTENTFUL_PREVIEW_TOKEN:
      env.VITE_CONTENTFUL_PREVIEW_TOKEN || env.CONTENTFUL_PREVIEW_TOKEN || '',
  };

  const defineEnv = Object.fromEntries(
    Object.entries(contentfulEnv).map(([key, value]) => [
      `import.meta.env.${key}`,
      JSON.stringify(value),
    ])
  );

  return {
    plugins: [react()],
    server: {
      port: 3000,
      open: true,
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    define: defineEnv,
  };
});
