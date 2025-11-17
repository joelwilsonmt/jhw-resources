export type FilterField = 'resourceType' | 'difficulty' | 'tags';

export interface FilterGroup {
  id: string;
  title: string;
  field: FilterField;
  options: string[];
}

export interface ResourceMetric {
  label: string;
  value: string;
  helper?: string;
}

export interface ResourceCategory {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  icon?: string;
  themeColor?: string;
  weight?: number;
}

export interface ResourceItem {
  id: string;
  slug: string;
  name: string;
  summary?: string;
  url: string;
  resourceType: string;
  difficulty?: string;
  tags: string[];
  ctaLabel?: string;
  ctaUrl?: string;
  highlighted?: boolean;
  lastReviewed?: string;
  metrics?: ResourceMetric;
  logoUrl?: string;
  categoryId?: string;
  category?: ResourceCategory;
}

export interface ResourceLandingPage {
  id: string;
  slug: string;
  heroEyebrow?: string;
  title: string;
  subtitle?: string;
  helperText?: string;
  primaryCtaLabel?: string;
  primaryCtaUrl?: string;
  secondaryCtaLabel?: string;
  secondaryCtaUrl?: string;
  seoDescription?: string;
  lastUpdated?: string;
  featuredResources: ResourceItem[];
  resources: ResourceItem[];
  categories: ResourceCategory[];
  filterGroups: FilterGroup[];
}

export interface ContentfulSysLink {
  sys?: {
    id?: string;
    linkType?: string;
  };
}

export interface ContentfulEntry {
  sys?: {
    id?: string;
  };
  fields?: Record<string, unknown>;
}

export interface ContentfulAsset {
  sys?: {
    id?: string;
  };
  fields?: {
    file?: {
      url?: string;
    };
  };
}

export interface ContentfulResponse<T = ContentfulEntry> {
  items: T[];
  includes?: {
    Entry?: ContentfulEntry[];
    Asset?: ContentfulAsset[];
  };
}

export interface LookupTables {
  entryMap: Map<string, ContentfulEntry>;
  assetMap: Map<string, ContentfulAsset>;
}

export interface FetchOptions {
  preview?: boolean;
}
