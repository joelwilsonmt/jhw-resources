import { contentfulClientConfig, isContentfulConfigured } from './config';
import type { FetchOptions, ResourceLandingPage } from './types';

const buildClientEndpoint = (slug: string, preview?: boolean) => {
  if (!contentfulClientConfig.apiBase) {
    throw new Error('Contentful API base is not configured');
  }

  const url = new URL(
    contentfulClientConfig.apiBase,
    typeof window === 'undefined' ? 'http://localhost' : window.location.origin
  );
  url.searchParams.set('slug', slug);
  if (preview) {
    url.searchParams.set('preview', 'true');
  }
  return url.toString();
};

export const fetchContentfulResourcePage = async (
  slug: string,
  options: FetchOptions = {}
): Promise<ResourceLandingPage> => {
  if (!isContentfulConfigured()) {
    throw new Error('Contentful API is disabled');
  }

  const endpoint = buildClientEndpoint(slug, options.preview);
  const response = await fetch(endpoint, {
    headers: {
      Accept: 'application/json',
    },
    credentials: 'same-origin',
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(
      `Contentful proxy error (${response.status}): ${message || response.statusText}`
    );
  }

  return (await response.json()) as ResourceLandingPage;
};
