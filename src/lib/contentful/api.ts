import {
  contentfulConfig,
  getAuthToken,
  getContentfulBaseUrl,
  shouldUsePreview,
} from './config';
import type {
  ContentfulEntry,
  ContentfulResponse,
  ContentfulSysLink,
  FetchOptions,
  ResourceLandingPage,
  ResourceCategory,
  ResourceItem,
} from './types';
import {
  buildLookupTables,
  extractFilterGroups,
  normalizeFilterGroups,
  resolveEntry,
  toCategory,
  toResource,
} from './transformers';

export const fetchContentfulResourcePage = async (
  slug: string,
  options: FetchOptions = {}
): Promise<ResourceLandingPage> => {
  const { spaceId } = contentfulConfig;
  if (!spaceId) {
    throw new Error('Missing Contentful space id');
  }

  const usePreview = shouldUsePreview(options.preview);
  const token = getAuthToken(usePreview);

  if (!token) {
    throw new Error(
      'Missing Contentful Delivery/Preview token. Update your environment variables.'
    );
  }

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
    `${getContentfulBaseUrl(usePreview)}/entries?${landingParams.toString()}`,
    { headers }
  );

  if (!landingResponse.ok) {
    throw new Error(`Contentful error: ${landingResponse.statusText}`);
  }

  const landingJson =
    (await landingResponse.json()) as ContentfulResponse<ContentfulEntry>;

  const landingEntry = landingJson.items?.[0];
  if (!landingEntry) {
    throw new Error(
      'Landing page entry not found. Run the migration and add content first.'
    );
  }

  if (!landingEntry.sys?.id) {
    throw new Error('Landing page entry is missing a sys.id');
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
    `${getContentfulBaseUrl(usePreview)}/entries?${resourceParams.toString()}`,
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
