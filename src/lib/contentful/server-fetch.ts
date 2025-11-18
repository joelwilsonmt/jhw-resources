import {
  buildLookupTables,
  extractFilterGroups,
  normalizeFilterGroups,
  resolveEntry,
  toCategory,
  toResource,
} from './transformers';
import type {
  ContentfulEntry,
  ContentfulResponse,
  ContentfulSysLink,
  ResourceCategory,
  ResourceItem,
  ResourceLandingPage,
} from './types';

export interface ServerFetchOptions {
  spaceId: string;
  environmentId: string;
  deliveryToken: string;
  previewToken?: string;
  preview?: boolean;
}

const buildBaseUrl = (
  spaceId: string,
  environmentId: string,
  usePreview: boolean
) => {
  const host = usePreview ? 'preview.contentful.com' : 'cdn.contentful.com';
  return `https://${host}/spaces/${spaceId}/environments/${environmentId}`;
};

const resolveToken = (options: ServerFetchOptions) => {
  const usePreview = options.preview ?? false;
  if (usePreview) {
    return options.previewToken ?? options.deliveryToken;
  }
  return options.deliveryToken;
};

export const fetchContentfulResourcePageServer = async (
  slug: string,
  options: ServerFetchOptions
): Promise<ResourceLandingPage> => {
  if (!options.spaceId) {
    throw new Error('Missing Contentful space ID');
  }

  if (!options.environmentId) {
    throw new Error('Missing Contentful environment ID');
  }

  const token = resolveToken(options);
  if (!token) {
    throw new Error('Missing Contentful delivery token');
  }

  const environmentId = options.environmentId;
  const usePreview = options.preview ?? false;
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const landingParams = new URLSearchParams({
    content_type: 'resourceLandingPage',
    'fields.slug': slug,
    include: '3',
    limit: '1',
  });

  const landingResponse = await fetch(
    `${buildBaseUrl(
      options.spaceId,
      environmentId,
      usePreview
    )}/entries?${landingParams.toString()}`,
    { headers }
  );

  if (!landingResponse.ok) {
    throw new Error(`Contentful error: ${landingResponse.statusText}`);
  }

  const landingJson =
    (await landingResponse.json()) as ContentfulResponse<ContentfulEntry>;

  const landingEntry = landingJson.items?.[0];
  if (!landingEntry || !landingEntry.sys?.id) {
    throw new Error('Landing page entry not found in Contentful');
  }

  const landingLookup = buildLookupTables(landingJson);
  const landingFields = (landingEntry.fields ?? {}) as Record<string, unknown>;
  const landingFieldString = (key: string) => {
    const value = landingFields[key];
    return typeof value === 'string' ? value : undefined;
  };

  const rawCategoryLinks = Array.isArray(landingFields.categories)
    ? (landingFields.categories as ContentfulSysLink[])
    : [];

  const categoryEntries = rawCategoryLinks
    .map(link => resolveEntry(link, landingLookup))
    .filter((entry): entry is ContentfulEntry =>
      Boolean(entry && entry.sys?.id)
    );

  const categories = categoryEntries
    .map(entry => toCategory(entry))
    .filter((category): category is ResourceCategory => Boolean(category))
    .sort(
      (a, b) =>
        (a.weight ?? 0) - (b.weight ?? 0) || a.title.localeCompare(b.title)
    );

  const categoryCache: Map<string, ResourceCategory> = new Map(
    categories.map(category => [category.id, category] as const)
  );

  const rawFeaturedLinks = Array.isArray(landingFields.featuredResources)
    ? (landingFields.featuredResources as ContentfulSysLink[])
    : [];

  const featuredResources = rawFeaturedLinks
    .map(link =>
      toResource(
        resolveEntry(link, landingLookup),
        landingLookup,
        categoryCache
      )
    )
    .filter((resource): resource is ResourceItem =>
      Boolean(resource && resource.url)
    );

  const categoryIds = categories.map(category => category.id);

  const resourceParams = new URLSearchParams({
    content_type: 'resourceEntry',
    include: '2',
    limit: '1000',
  });

  if (categoryIds.length > 0) {
    resourceParams.set('fields.category.sys.id[in]', categoryIds.join(','));
  }

  const resourceResponse = await fetch(
    `${buildBaseUrl(
      options.spaceId,
      environmentId,
      usePreview
    )}/entries?${resourceParams.toString()}`,
    { headers }
  );

  if (!resourceResponse.ok) {
    throw new Error(
      `Failed to fetch resource entries: ${resourceResponse.statusText}`
    );
  }

  const resourceJson =
    (await resourceResponse.json()) as ContentfulResponse<ContentfulEntry>;
  const resourceLookup = buildLookupTables(resourceJson);

  const resources = resourceJson.items
    .map(entry => toResource(entry, resourceLookup, categoryCache))
    .filter((resource): resource is ResourceItem =>
      Boolean(resource && resource.url)
    );

  const filterGroups = normalizeFilterGroups(
    extractFilterGroups(landingFields.filterGroups)
  );

  return {
    id: landingEntry.sys.id,
    slug: landingFieldString('slug') ?? slug,
    heroEyebrow: landingFieldString('heroEyebrow'),
    title: landingFieldString('title') ?? 'Resources',
    subtitle: landingFieldString('subtitle'),
    helperText: landingFieldString('helperText'),
    primaryCtaLabel: landingFieldString('primaryCtaLabel'),
    primaryCtaUrl: landingFieldString('primaryCtaUrl'),
    secondaryCtaLabel: landingFieldString('secondaryCtaLabel'),
    secondaryCtaUrl: landingFieldString('secondaryCtaUrl'),
    seoDescription: landingFieldString('seoDescription'),
    lastUpdated: landingFieldString('lastUpdated'),
    featuredResources,
    resources,
    categories,
    filterGroups,
  };
};
