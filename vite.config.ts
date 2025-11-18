import { defineConfig, loadEnv, type PluginOption } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { fileURLToPath, URL } from 'node:url';
import process from 'node:process';
import { fetchContentfulResourcePageServer } from './src/lib/contentful/server-fetch';

const contentfulDevProxy = (env: Record<string, string>): PluginOption => ({
  name: 'contentful-dev-proxy',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      if (!req.url?.startsWith('/api/contentful')) {
        return next();
      }

      const url = new URL(req.url, 'http://localhost');
      const slug = url.searchParams.get('slug') ?? 'resources';
      const preview = url.searchParams.get('preview') === 'true';

      const spaceId = env.CONTENTFUL_SPACE_ID;
      const environmentId = env.CONTENTFUL_ENVIRONMENT;
      const deliveryToken = env.CONTENTFUL_DELIVERY_TOKEN;
      const previewToken = env.CONTENTFUL_PREVIEW_TOKEN;

      if (!spaceId || !deliveryToken || !environmentId) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(
          JSON.stringify({
            error:
              'Set CONTENTFUL_SPACE_ID, CONTENTFUL_ENVIRONMENT, and CONTENTFUL_DELIVERY_TOKEN in .env.local to enable Contentful.',
          })
        );
        return;
      }

      try {
        const data = await fetchContentfulResourcePageServer(slug, {
          spaceId,
          environmentId,
          deliveryToken,
          previewToken,
          preview,
        });
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data));
      } catch (error) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(
          JSON.stringify({
            error:
              error instanceof Error
                ? error.message
                : 'Failed to fetch Contentful data',
          })
        );
      }
    });
  },
});

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), contentfulDevProxy(env)],
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
  };
});
