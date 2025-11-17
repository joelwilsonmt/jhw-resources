import { createFileRoute } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  fetchContentfulResourcePage,
  fallbackResourcePage,
  isContentfulConfigured,
} from '@/lib/contentful';
import type {
  FilterField,
  ResourceCategory,
  ResourceItem,
} from '@/lib/contentful';
import { PageTransition } from '@/components/PageTransition';
import { AnimatedText } from '@/components/AnimatedText';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import {
  Sparkles,
  Filter,
  RefreshCw,
  ExternalLink,
  AlertTriangle,
  Loader2,
  Columns,
  ArrowRight,
  Zap,
  Link,
  Heart,
  Github,
  FormInput,
  Search,
  Palette,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const Route = createFileRoute('/contentful')({
  component: ContentfulResourcesPage,
});

const CATEGORY_ICON_MAP: Record<string, LucideIcon> = {
  Zap,
  Sparkles,
  Link,
  Heart,
  Github,
  FormInput,
  Search,
  Palette,
};

const CategoryIcon = ({
  name,
  className,
}: {
  name?: string;
  className?: string;
}) => {
  const IconComponent = (name && CATEGORY_ICON_MAP[name]) || Sparkles;
  return <IconComponent className={className} aria-hidden="true" />;
};

function ContentfulResourcesPage() {
  const configured = isContentfulConfigured();
  const [activeFilters, setActiveFilters] = useState<
    Partial<Record<FilterField, string>>
  >({});

  const query = useQuery({
    queryKey: ['contentfulResources', 'resources'],
    queryFn: () => fetchContentfulResourcePage('resources'),
    enabled: configured,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const pageData = configured
    ? (query.data ?? fallbackResourcePage)
    : fallbackResourcePage;

  const categoryMap = useMemo(() => {
    const map = new Map<string, ResourceCategory>();
    pageData.categories?.forEach(category => map.set(category.id, category));
    return map;
  }, [pageData.categories]);

  const normalizedResources = useMemo(() => {
    return (pageData.resources ?? []).map(resource => {
      if (resource.category || !resource.categoryId) {
        return resource;
      }
      const resolved = categoryMap.get(resource.categoryId);
      return resolved ? { ...resource, category: resolved } : resource;
    });
  }, [pageData.resources, categoryMap]);

  const normalizedFeatured = useMemo(() => {
    return (pageData.featuredResources ?? []).map(resource => {
      if (resource.category || !resource.categoryId) {
        return resource;
      }
      const resolved = resource.categoryId
        ? categoryMap.get(resource.categoryId)
        : undefined;
      return resolved ? { ...resource, category: resolved } : resource;
    });
  }, [pageData.featuredResources, categoryMap]);

  const appliedFilters = Object.entries(activeFilters).filter(([, value]) =>
    Boolean(value)
  ) as Array<[FilterField, string]>;

  const filteredResources = useMemo(() => {
    if (!normalizedResources.length) {
      return [];
    }

    if (!appliedFilters.length) {
      return normalizedResources;
    }

    return normalizedResources.filter(resource =>
      appliedFilters.every(([field, value]) => {
        if (field === 'tags') {
          return resource.tags?.includes(value);
        }
        if (field === 'resourceType') {
          return resource.resourceType === value;
        }
        if (field === 'difficulty') {
          return resource.difficulty === value;
        }
        return false;
      })
    );
  }, [normalizedResources, appliedFilters]);

  const groupedResources = useMemo(() => {
    const map = new Map<string, ResourceItem[]>();

    pageData.categories?.forEach(category => map.set(category.id, []));

    filteredResources.forEach(resource => {
      const categoryId = resource.categoryId || resource.category?.id;
      if (!categoryId) {
        return;
      }

      if (!map.has(categoryId)) {
        map.set(categoryId, []);
      }

      map.get(categoryId)?.push(resource);
    });

    return map;
  }, [filteredResources, pageData.categories]);

  const toggleFilter = (field: FilterField, option: string) => {
    setActiveFilters(previous => ({
      ...previous,
      [field]: previous[field] === option ? undefined : option,
    }));
  };

  const clearFilters = () => setActiveFilters({});
  const isUsingFallback = !configured || (!query.data && query.isFetched);
  const lastUpdatedLabel = pageData.lastUpdated
    ? new Date(pageData.lastUpdated).toLocaleDateString()
    : undefined;

  return (
    <PageTransition>
      <div className="space-y-8 max-w-6xl mx-auto">
        <section className="space-y-5 text-center">
          <AnimatedText
            type="slideUp"
            className="text-sm uppercase tracking-[0.3em] text-primary/70 flex items-center justify-center gap-2"
          >
            <Sparkles className="h-4 w-4" />
            {pageData.heroEyebrow ?? 'Contentful demo'}
          </AnimatedText>
          <AnimatedText
            type="slideUp"
            delay={0.15}
            className="text-4xl font-bold tracking-tight"
          >
            {pageData.title}
          </AnimatedText>
          {pageData.subtitle && (
            <AnimatedText
              type="fadeIn"
              delay={0.25}
              className="text-lg text-muted-foreground max-w-3xl mx-auto"
            >
              {pageData.subtitle}
            </AnimatedText>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3">
            {pageData.primaryCtaLabel && pageData.primaryCtaUrl && (
              <Button asChild size="lg">
                <a
                  href={pageData.primaryCtaUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {pageData.primaryCtaLabel}
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            )}
            {pageData.secondaryCtaLabel && pageData.secondaryCtaUrl && (
              <Button asChild variant="outline" size="lg">
                <a
                  href={pageData.secondaryCtaUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {pageData.secondaryCtaLabel}
                </a>
              </Button>
            )}
          </div>
          <div className="text-xs text-muted-foreground flex items-center justify-center gap-2">
            <Columns className="h-4 w-4" />
            <span>
              {configured
                ? 'Live data from Contentful'
                : 'Mock data – connect Contentful to go live'}
            </span>
            {isUsingFallback && (
              <span className="inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-amber-600 border-amber-500/60">
                Fallback content
              </span>
            )}
          </div>
        </section>

        {!configured && (
          <Card className="border-dashed border-primary/40 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-primary" />
                Connect Contentful to replace mock data
              </CardTitle>
              <CardDescription>
                Add your Contentful credentials to <code>.env.local</code> and
                run <code>pnpm contentful:migrate</code> to create the content
                model, then input entries in the Contentful UI.
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {query.error && (
          <Card className="border-destructive/40 bg-destructive/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                Something went wrong
              </CardTitle>
              <CardDescription className="text-destructive/80">
                {(query.error as Error).message}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="destructive"
                onClick={() => query.refetch()}
                disabled={query.isFetching}
              >
                <RefreshCw
                  className={cn('mr-2 h-4 w-4', {
                    'animate-spin': query.isFetching,
                  })}
                />
                Retry
              </Button>
            </CardContent>
          </Card>
        )}

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                Featured resources
              </h2>
              <p className="text-sm text-muted-foreground">
                Curated highlights sourced from the Contentful landing page
                entry.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => query.refetch()}
              disabled={query.isFetching || !configured}
            >
              <RefreshCw
                className={cn('mr-2 h-4 w-4', {
                  'animate-spin': query.isFetching,
                })}
              />
              Refresh data
            </Button>
          </div>

          {query.isLoading && configured ? (
            <div className="flex items-center gap-3 rounded-xl border border-dashed border-muted px-4 py-6 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Loading from Contentful…</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {normalizedFeatured.length > 0 ? (
                normalizedFeatured.map(resource => (
                  <ResourceCard
                    key={resource.id}
                    resource={resource}
                    featured
                  />
                ))
              ) : (
                <Card>
                  <CardContent className="py-6">
                    <p className="text-sm text-muted-foreground">
                      No featured resources have been selected in Contentful
                      yet.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </section>

        <section>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter resources
              </CardTitle>
              <CardDescription>
                Filter definitions live in Contentful on the landing page entry
                (the <code>filterGroups</code> field).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {pageData.filterGroups?.length ? (
                pageData.filterGroups.map(group => (
                  <div
                    key={group.id}
                    className="border rounded-xl p-4 space-y-3 bg-muted/30"
                  >
                    <div className="text-sm font-medium">
                      {group.title}
                      <span className="ml-2 text-xs text-muted-foreground uppercase tracking-wider">
                        {group.options.length} options
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {group.options.map(option => {
                        const isActive = activeFilters[group.field] === option;
                        return (
                          <Button
                            key={option}
                            variant={isActive ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => toggleFilter(group.field, option)}
                          >
                            {option}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No filters have been configured yet. Update the{' '}
                  <code>filterGroups</code> field in Contentful to make filters
                  appear here.
                </p>
              )}

              {appliedFilters.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                  onClick={clearFilters}
                >
                  Clear filters
                </Button>
              )}
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                Resource catalog
              </h2>
              <p className="text-sm text-muted-foreground">
                {filteredResources.length}{' '}
                {filteredResources.length === 1 ? 'resource' : 'resources'}{' '}
                available
                {lastUpdatedLabel && ` · Updated ${lastUpdatedLabel}`}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {pageData.categories?.map(category => {
              const resourcesForCategory =
                groupedResources.get(category.id) ?? [];

              return (
                <Card key={category.id} className="overflow-hidden">
                  <CardHeader
                    className={cn(
                      'bg-gradient-to-r',
                      category.themeColor ?? 'from-primary/20 to-primary/0'
                    )}
                  >
                    <CardTitle className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-background/20 text-primary-background">
                          <CategoryIcon
                            name={category.icon ?? undefined}
                            className="h-5 w-5"
                          />
                        </span>
                        <div>
                          <div className="text-xs uppercase tracking-widest text-primary-background">
                            {category.slug || 'Category'}
                          </div>
                          <div className="text-xl text-primary-background">
                            {category.title}
                          </div>
                        </div>
                      </div>
                      <span className="text-sm text-primary-background/70">
                        {resourcesForCategory.length}{' '}
                        {resourcesForCategory.length === 1
                          ? 'resource'
                          : 'resources'}
                      </span>
                    </CardTitle>
                    {category.summary && (
                      <CardDescription className="text-primary-background/80">
                        {category.summary}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="pt-6">
                    {resourcesForCategory.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {resourcesForCategory.map(resource => (
                          <ResourceCard
                            key={resource.id}
                            resource={resource}
                            featured={Boolean(resource.highlighted)}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-between rounded-lg border border-dashed border-muted-foreground/30 px-4 py-3 text-sm text-muted-foreground">
                        <span>
                          No resources match the current filters for this
                          category.
                        </span>
                        {appliedFilters.length > 0 && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={clearFilters}
                          >
                            Reset filters
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      </div>
    </PageTransition>
  );
}

interface ResourceCardProps {
  resource: ResourceItem;
  featured?: boolean;
}

const ResourceCard = ({ resource, featured = false }: ResourceCardProps) => (
  <div
    className={cn(
      'rounded-2xl border bg-card/80 p-5 shadow-sm transition hover:shadow-lg flex flex-col gap-4',
      featured && 'border-primary/50 bg-primary/5 shadow-primary/20'
    )}
  >
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          {resource.resourceType}
        </p>
        <h3 className="text-lg font-semibold leading-tight">{resource.name}</h3>
      </div>
      {resource.metrics && (
        <div className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground whitespace-nowrap">
          {resource.metrics.label}: {resource.metrics.value}
        </div>
      )}
    </div>
    {resource.summary && (
      <p className="text-sm text-muted-foreground">{resource.summary}</p>
    )}

    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
      {resource.difficulty && (
        <span className="rounded-full bg-muted px-2 py-1 capitalize">
          {resource.difficulty}
        </span>
      )}
      {resource.tags?.slice(0, 3).map(tag => (
        <span
          key={tag}
          className="rounded-full border border-muted px-2 py-1 text-[11px]"
        >
          #{tag}
        </span>
      ))}
      {resource.category && (
        <span className="rounded-full border border-primary/40 px-2 py-1 text-[11px] text-primary">
          {resource.category.title}
        </span>
      )}
    </div>
    <div className="flex items-center justify-between">
      {resource.lastReviewed && (
        <span className="text-xs text-muted-foreground">
          Updated {new Date(resource.lastReviewed).toLocaleDateString()}
        </span>
      )}
      <div className="flex flex-wrap items-center gap-2 ml-auto">
        {resource.ctaLabel && resource.ctaUrl && (
          <Button asChild variant="outline" size="sm">
            <a href={resource.ctaUrl} target="_blank" rel="noreferrer">
              {resource.ctaLabel}
            </a>
          </Button>
        )}
        <Button asChild size="sm">
          <a href={resource.url} target="_blank" rel="noreferrer">
            Visit
            <ExternalLink className="ml-2 h-3.5 w-3.5" />
          </a>
        </Button>
      </div>
    </div>
  </div>
);
