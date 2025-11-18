import type { Handler } from '@netlify/functions';
import process from 'node:process';
import { fetchContentfulResourcePageServer } from '../../src/lib/contentful/server-fetch';

const handler: Handler = async event => {
  const slug = event.queryStringParameters?.slug || 'resources';
  const preview =
    event.queryStringParameters?.preview?.toLowerCase() === 'true';

  const spaceId = process.env.CONTENTFUL_SPACE_ID;
  const environmentId = process.env.CONTENTFUL_ENVIRONMENT;
  const deliveryToken = process.env.CONTENTFUL_DELIVERY_TOKEN;
  const previewToken = process.env.CONTENTFUL_PREVIEW_TOKEN;

  if (!spaceId || !deliveryToken || !environmentId) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error:
          'Contentful space ID, environment, or delivery token is missing. Please set CONTENTFUL_SPACE_ID, CONTENTFUL_ENVIRONMENT, and CONTENTFUL_DELIVERY_TOKEN.',
      }),
    };
  }

  try {
    const data = await fetchContentfulResourcePageServer(slug, {
      spaceId,
      environmentId,
      deliveryToken,
      previewToken,
      preview,
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=30',
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('Contentful function error', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error:
          error instanceof Error ? error.message : 'Contentful request failed',
      }),
    };
  }
};

export { handler };
