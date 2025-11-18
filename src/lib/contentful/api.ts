import { getAuthToken, getContentfulBaseUrl, shouldUsePreview } from './config';
import type {
  ContentfulEntry,
  ContentfulResponse,
  ContentfulSysLink,
  FetchOptions,
  ResourceCategory,
  ResourceItem,
  ResourceLandingPage,
} from './types';
import {
  buildLookupTables,
  extractFilterGroups,
  normalizeFilterGroups,
  resolveEntry,
  toCategory,
  toResource,
} from './transformers';

const parseContentfulError = async (response: Response) => {
  const text = await response.text();
  try {
    const data = JSON.parse(text);
    const detailed =
      data?.message ||
      data?.details?.errors
        ?.map((err: { message?: string }) => err.message)
        .filter(Boolean)
        .join(', ');
    return detailed || text || response.statusText;
  } catch {
    return text || response.statusText;
  }
};

export const fetchContentfulResourcePage = async (
  slug: string,
  options: FetchOptions = {}
): Promise<ResourceLandingPage> => {
  const usePreview = shouldUsePreview(options.preview);
  const token = getAuthToken(usePreview);

  if (!token) {
    throw new Error(
      'Missing Contentful Delivery/Preview token. Update your environment variables.'
    );
  }

  const buildUrl = (query: Record<string, string>) => {
    const url = new URL(`${getContentfulBaseUrl(usePreview)}/entries`);
    Object.entries(query).forEach(([key, value]) =>
      url.searchParams.set(key, value)
    );
    url.searchParams.set('access_token', token);
    return url.toString();
  };

  const landingResponse = await fetch(
    buildUrl({
      content_type: 'resourceLandingPage',
      'fields.slug': slug,
      include: '3',
      limit: '1',
    })
  );

  if (!landingResponse.ok) {
    throw new Error(
      `Contentful request failed (${landingResponse.status} ${landingResponse.statusText}): ${await parseContentfulError(
        landingResponse
      )}`
    );
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
  const landingFields = landingEntry.fields ?? {};
  const getStringField = (key: string) => {
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

  const resourceResponse = await fetch(
    buildUrl({
      content_type: 'resourceEntry',
      include: '2',
      limit: '1000',
      ...(categoryIds.length > 0 && {
        'fields.category.sys.id[in]': categoryIds.join(','),
      }),
    })
  );

  if (!resourceResponse.ok) {
    throw new Error(
      `Failed to fetch resource entries (${resourceResponse.status} ${resourceResponse.statusText}): ${await parseContentfulError(
        resourceResponse
      )}`
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
    slug: getStringField('slug') ?? slug,
    heroEyebrow: getStringField('heroEyebrow'),
    title: getStringField('title') ?? 'Resources',
    subtitle: getStringField('subtitle'),
    helperText: getStringField('helperText'),
    primaryCtaLabel: getStringField('primaryCtaLabel'),
    primaryCtaUrl: getStringField('primaryCtaUrl'),
    secondaryCtaLabel: getStringField('secondaryCtaLabel'),
    secondaryCtaUrl: getStringField('secondaryCtaUrl'),
    seoDescription: getStringField('seoDescription'),
    lastUpdated: getStringField('lastUpdated'),
    featuredResources,
    resources,
    categories,
    filterGroups,
  };
};
