const sanitizeEnv = (value?: string) =>
  value && value !== 'undefined' ? value : undefined;

const spaceId = sanitizeEnv(import.meta.env.VITE_CONTENTFUL_SPACE_ID);
const environmentId =
  sanitizeEnv(import.meta.env.VITE_CONTENTFUL_ENVIRONMENT) || 'master';
const deliveryToken = sanitizeEnv(
  import.meta.env.VITE_CONTENTFUL_DELIVERY_TOKEN
);
const previewToken = sanitizeEnv(import.meta.env.VITE_CONTENTFUL_PREVIEW_TOKEN);

export const contentfulConfig = {
  spaceId,
  environmentId,
  deliveryToken,
  previewToken,
};

export const shouldUsePreview = (preview?: boolean) => {
  if (typeof preview === 'boolean') {
    return preview;
  }

  return !deliveryToken && Boolean(previewToken);
};

export const getContentfulBaseUrl = (usePreview: boolean) => {
  if (!spaceId) {
    throw new Error(
      'VITE_CONTENTFUL_SPACE_ID is missing. Add it to .env.local.'
    );
  }

  const host = usePreview ? 'preview.contentful.com' : 'cdn.contentful.com';
  return `https://${host}/spaces/${spaceId}/environments/${environmentId}`;
};

export const getAuthToken = (usePreview: boolean) =>
  usePreview ? previewToken : deliveryToken;
