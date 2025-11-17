const spaceId = import.meta.env.VITE_CONTENTFUL_SPACE_ID;
const environmentId = import.meta.env.VITE_CONTENTFUL_ENVIRONMENT || 'master';
const deliveryToken = import.meta.env.VITE_CONTENTFUL_DELIVERY_TOKEN;
const previewToken = import.meta.env.VITE_CONTENTFUL_PREVIEW_TOKEN;

export const contentfulConfig = {
  spaceId,
  environmentId,
  deliveryToken,
  previewToken,
};

export const isContentfulConfigured = () =>
  Boolean(spaceId && environmentId && (deliveryToken || previewToken));

export const shouldUsePreview = (preview?: boolean) => {
  if (typeof preview === 'boolean') {
    return preview;
  }

  return !deliveryToken && Boolean(previewToken);
};

export const getContentfulBaseUrl = (usePreview: boolean) => {
  const host = usePreview ? 'preview.contentful.com' : 'cdn.contentful.com';
  return `https://${host}/spaces/${spaceId}/environments/${environmentId}`;
};

export const getAuthToken = (usePreview: boolean) =>
  usePreview ? previewToken : deliveryToken;
