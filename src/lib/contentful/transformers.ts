import type {
  ContentfulAsset,
  ContentfulEntry,
  ContentfulResponse,
  ContentfulSysLink,
  FilterField,
  FilterGroup,
  LookupTables,
  ResourceCategory,
  ResourceItem,
  ResourceMetric,
} from './types';

export const buildLookupTables = (
  response: ContentfulResponse
): LookupTables => {
  const entryMap = new Map<string, ContentfulEntry>();
  const assetMap = new Map<string, ContentfulAsset>();

  [...(response.items ?? []), ...(response.includes?.Entry ?? [])].forEach(
    entry => {
      if (entry?.sys?.id) {
        entryMap.set(entry.sys.id, entry);
      }
    }
  );

  (response.includes?.Asset ?? []).forEach(asset => {
    if (asset?.sys?.id) {
      assetMap.set(asset.sys.id, asset);
    }
  });

  return { entryMap, assetMap };
};

export const resolveEntry = (
  link: ContentfulSysLink | undefined,
  lookup: LookupTables
) => {
  const entryId = link?.sys?.id;
  if (!entryId) {
    return undefined;
  }
  return lookup.entryMap.get(entryId);
};

const resolveAssetUrl = (
  link: ContentfulSysLink | undefined,
  lookup: LookupTables
) => {
  const assetId = link?.sys?.id;
  if (!assetId) {
    return undefined;
  }

  const asset = lookup.assetMap.get(assetId);
  const url: string | undefined = asset?.fields?.file?.url;
  if (!url) {
    return undefined;
  }

  return url.startsWith('http') ? url : `https:${url}`;
};

const isObject = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object';

const getString = (value: unknown): string | undefined =>
  typeof value === 'string' ? value : undefined;

const getBoolean = (value: unknown): boolean | undefined =>
  typeof value === 'boolean' ? value : undefined;

const getNumber = (value: unknown): number | undefined =>
  typeof value === 'number' ? value : undefined;

const getStringArray = (value: unknown): string[] =>
  Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : [];

export const toCategory = (
  entry: ContentfulEntry | undefined
): ResourceCategory | undefined => {
  if (!entry?.sys?.id) {
    return undefined;
  }

  const fields = entry.fields ?? {};

  return {
    id: entry.sys.id,
    slug: getString(fields.slug) ?? entry.sys.id,
    title:
      getString(fields.internalName) ?? getString(fields.slug) ?? 'Category',
    summary: getString(fields.summary),
    icon: getString(fields.icon),
    themeColor: getString(fields.themeColor),
    weight: getNumber(fields.weight),
  };
};

const normalizeMetric = (rawMetric: unknown): ResourceMetric | undefined => {
  if (!isObject(rawMetric)) {
    return undefined;
  }

  const label = getString(rawMetric.label);
  const value = getString(rawMetric.value);

  if (!label && !value) {
    return undefined;
  }

  return {
    label: label ?? 'Metric',
    value: value ?? '',
    helper: getString(rawMetric.helper) ?? getString(rawMetric.description),
  };
};

export const toResource = (
  entry: ContentfulEntry | undefined,
  lookup: LookupTables,
  categoryCache: Map<string, ResourceCategory>
): ResourceItem | undefined => {
  if (!entry?.sys?.id) {
    return undefined;
  }

  const fields = entry.fields ?? {};
  const categoryLink = isObject(fields.category)
    ? (fields.category as ContentfulSysLink)
    : undefined;
  const categoryId: string | undefined = categoryLink?.sys?.id;

  let category: ResourceCategory | undefined = categoryId
    ? categoryCache.get(categoryId)
    : undefined;

  if (!category && categoryId) {
    const categoryEntry = lookup.entryMap.get(categoryId);
    category = toCategory(categoryEntry);
    if (category) {
      categoryCache.set(categoryId, category);
    }
  }

  return {
    id: entry.sys.id,
    slug: getString(fields.slug) ?? entry.sys.id,
    name:
      getString(fields.internalName) ?? getString(fields.slug) ?? 'Resource',
    summary: getString(fields.summary),
    url: getString(fields.url) ?? '',
    resourceType: getString(fields.resourceType) ?? 'tool',
    difficulty: getString(fields.difficulty),
    tags: getStringArray(fields.tags),
    ctaLabel: getString(fields.ctaLabel),
    ctaUrl: getString(fields.ctaUrl),
    highlighted: Boolean(getBoolean(fields.highlighted)),
    lastReviewed: getString(fields.lastReviewed),
    metrics: normalizeMetric(fields.metrics),
    logoUrl: resolveAssetUrl(
      isObject(fields.logo) ? (fields.logo as ContentfulSysLink) : undefined,
      lookup
    ),
    categoryId,
    category,
  };
};

export const extractFilterGroups = (rawValue: unknown): unknown[] => {
  if (Array.isArray(rawValue)) {
    return rawValue;
  }

  if (isObject(rawValue) && Array.isArray(rawValue.groups)) {
    return rawValue.groups;
  }

  return [];
};

export const normalizeFilterGroups = (rawGroups: unknown[]): FilterGroup[] => {
  return rawGroups.map((group, index) => {
    const groupObject = isObject(group) ? group : undefined;
    const field = groupObject
      ? (groupObject.field as FilterField | undefined)
      : undefined;
    const options =
      groupObject && Array.isArray(groupObject.options)
        ? groupObject.options.map(option => String(option))
        : [];
    const id = groupObject ? getString(groupObject.id) : undefined;
    const title = groupObject ? getString(groupObject.title) : undefined;

    return {
      id: id ?? `group-${index}`,
      title: title ?? 'Filters',
      field:
        field && ['resourceType', 'difficulty', 'tags'].includes(field)
          ? field
          : 'resourceType',
      options,
    };
  });
};
