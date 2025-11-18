const apiBase = import.meta.env.VITE_CONTENTFUL_API_BASE || '/api/contentful';

export const contentfulClientConfig = {
  apiBase: apiBase === 'disabled' ? '' : apiBase,
};

export const isContentfulConfigured = () =>
  Boolean(contentfulClientConfig.apiBase);
