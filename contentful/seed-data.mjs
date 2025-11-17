import contentfulManagement from 'contentful-management';
import process from 'node:process';

const spaceId = process.env.CONTENTFUL_SPACE_ID;
const environmentId = process.env.CONTENTFUL_ENVIRONMENT || 'master';
const managementToken = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
const locale = process.env.CONTENTFUL_DEFAULT_LOCALE || 'en-US';

const requiredVars = {
  CONTENTFUL_SPACE_ID: spaceId,
  CONTENTFUL_MANAGEMENT_TOKEN: managementToken,
};

const missing = Object.entries(requiredVars)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missing.length > 0) {
  console.error(
    `Missing required Contentful env variables: ${missing.join(', ')}`
  );
  process.exit(1);
}

const localized = value =>
  value === undefined || value === null
    ? undefined
    : {
        [locale]: value,
      };

const assignField = (fields, key, value) => {
  const localizedValue = localized(value);
  if (localizedValue !== undefined) {
    fields[key] = localizedValue;
  }
};

const linkToEntry = entryId => ({
  [locale]: {
    sys: {
      type: 'Link',
      linkType: 'Entry',
      id: entryId,
    },
  },
});

const client = contentfulManagement.createClient({
  accessToken: managementToken,
});

const categorySeeds = [
  {
    slug: 'accelerators',
    internalName: 'Launch Accelerators',
    summary: 'Templates and starter kits that help teams ship faster.',
    icon: 'Zap',
    themeColor: 'from-purple-500/20 to-purple-700/10',
    weight: 0,
  },
  {
    slug: 'integrations',
    internalName: 'Integrations',
    summary: 'Connect Contentful to the rest of your stack.',
    icon: 'Link',
    themeColor: 'from-emerald-500/20 to-emerald-700/10',
    weight: 1,
  },
  {
    slug: 'experience',
    internalName: 'Experience Enhancers',
    summary: 'Delightful add-ons for UX teams.',
    icon: 'Sparkles',
    themeColor: 'from-amber-500/20 to-amber-700/10',
    weight: 2,
  },
];

const resourceSeeds = [
  {
    slug: 'astro-ui-kit',
    internalName: 'Astro UI Kit',
    summary: 'Composable components for rapidly prototyping Astro projects.',
    url: 'https://astro.build/themes',
    resourceType: 'template',
    difficulty: 'intermediate',
    tags: ['astro', 'starter', 'design'],
    highlighted: true,
    metrics: { label: 'Downloads', value: '12.4k', helper: 'Past 30 days' },
    categorySlug: 'accelerators',
  },
  {
    slug: 'zapier-contentful',
    internalName: 'Zapier + Contentful',
    summary:
      'Automate editorial workflows with Zapier triggers targeting Contentful.',
    url: 'https://zapier.com/apps/contentful/integrations',
    resourceType: 'api',
    difficulty: 'beginner',
    tags: ['automation', 'ops'],
    highlighted: true,
    metrics: { label: 'Automations', value: '350+' },
    categorySlug: 'integrations',
  },
  {
    slug: 'nextra-docs',
    internalName: 'Nextra Docs Theme',
    summary: 'Opinionated docs framework powered by Next.js and MDX.',
    url: 'https://nextra.site/',
    resourceType: 'template',
    difficulty: 'intermediate',
    tags: ['docs', 'nextjs'],
    ctaLabel: 'View GitHub',
    ctaUrl: 'https://github.com/shuding/nextra',
    metrics: { label: 'GitHub Stars', value: '11k+' },
    categorySlug: 'accelerators',
  },
  {
    slug: 'formbricks',
    internalName: 'Formbricks',
    summary:
      'Open source product research suite with Contentful webhooks integration.',
    url: 'https://formbricks.com/integrations/contentful',
    resourceType: 'tool',
    difficulty: 'beginner',
    tags: ['research', 'automation'],
    categorySlug: 'integrations',
  },
  {
    slug: 'edgesse-commerce',
    internalName: 'Edgesse Headless Commerce',
    summary:
      'Composable commerce starter blending Contentful, Stripe, and Next.js.',
    url: 'https://www.edgesse.com/',
    resourceType: 'template',
    difficulty: 'advanced',
    tags: ['commerce', 'nextjs'],
    metrics: { label: 'Time to launch', value: '2 weeks' },
    categorySlug: 'accelerators',
  },
  {
    slug: 'lottiefiles',
    internalName: 'LottieFiles animations',
    summary:
      'Drop-in micro-interactions you can reference from Contentful assets.',
    url: 'https://lottiefiles.com/',
    resourceType: 'tool',
    difficulty: 'beginner',
    tags: ['animation', 'motion'],
    categorySlug: 'experience',
  },
];

const landingPageSeed = {
  slug: 'resources',
  internalName: 'Contentful Resource Hub',
  heroEyebrow: 'Contentful Demo',
  title: 'Contentful Resources Showcase',
  subtitle:
    'Connect your Contentful space to see real data. This dataset mirrors the content model defined in the migration.',
  helperText: 'Run pnpm contentful:migrate & contentful:seed to re-create it.',
  primaryCtaLabel: 'Open Contentful',
  primaryCtaUrl: 'https://app.contentful.com/',
  secondaryCtaLabel: 'View Migration',
  secondaryCtaUrl: 'https://github.com/contentful/contentful-migration',
  seoDescription:
    'A curated catalog of developer resources stored in Contentful.',
  filterGroups: [
    {
      id: 'type-filter',
      title: 'Resource type',
      field: 'resourceType',
      options: ['tool', 'template', 'api'],
    },
    {
      id: 'level-filter',
      title: 'Level',
      field: 'difficulty',
      options: ['beginner', 'intermediate', 'advanced'],
    },
  ],
  featuredSlugs: ['astro-ui-kit', 'zapier-contentful'],
};

const run = async () => {
  const space = await client.getSpace(spaceId);
  const environment = await space.getEnvironment(environmentId);
  console.log(`Seeding Contentful data into ${spaceId}/${environmentId}`);

  const upsertEntry = async (contentTypeId, slug, fields) => {
    if (!slug) {
      throw new Error(`Missing slug for ${contentTypeId}`);
    }

    const existing = await environment.getEntries({
      content_type: contentTypeId,
      'fields.slug': slug,
      limit: 1,
    });

    if (existing.items.length > 0) {
      const entry = existing.items[0];
      entry.fields = { ...entry.fields, ...fields };
      const updated = await entry.update();
      await updated.publish();
      console.log(`Updated ${contentTypeId} (${slug})`);
      return updated;
    }

    const entry = await environment.createEntry(contentTypeId, { fields });
    await entry.publish();
    console.log(`Created ${contentTypeId} (${slug})`);
    return entry;
  };

  const categoryMap = new Map();

  for (const category of categorySeeds) {
    const fields = {};
    assignField(fields, 'internalName', category.internalName);
    assignField(fields, 'slug', category.slug);
    assignField(fields, 'summary', category.summary);
    assignField(fields, 'icon', category.icon);
    assignField(fields, 'themeColor', category.themeColor);
    assignField(fields, 'weight', category.weight);

    const entry = await upsertEntry('resourceCategory', category.slug, fields);
    categoryMap.set(category.slug, entry);
  }

  const resourceMap = new Map();

  for (const resource of resourceSeeds) {
    const categoryEntry = categoryMap.get(resource.categorySlug);
    if (!categoryEntry) {
      throw new Error(`Missing category ${resource.categorySlug}`);
    }

    const fields = {
      category: linkToEntry(categoryEntry.sys.id),
    };
    assignField(fields, 'internalName', resource.internalName);
    assignField(fields, 'slug', resource.slug);
    assignField(fields, 'summary', resource.summary);
    assignField(fields, 'url', resource.url);
    assignField(fields, 'resourceType', resource.resourceType);
    assignField(fields, 'difficulty', resource.difficulty);
    assignField(fields, 'tags', resource.tags ?? []);
    assignField(fields, 'ctaLabel', resource.ctaLabel);
    assignField(fields, 'ctaUrl', resource.ctaUrl);
    assignField(fields, 'highlighted', Boolean(resource.highlighted));
    assignField(fields, 'metrics', resource.metrics);
    assignField(fields, 'lastReviewed', new Date().toISOString());

    const entry = await upsertEntry('resourceEntry', resource.slug, fields);
    resourceMap.set(resource.slug, entry);
  }

  const featuredLinks = landingPageSeed.featuredSlugs
    .map(slug => resourceMap.get(slug))
    .filter(Boolean)
    .map(entry => ({
      sys: {
        type: 'Link',
        linkType: 'Entry',
        id: entry.sys.id,
      },
    }));

  const landingFields = {
    featuredResources: localized(featuredLinks),
    categories: localized(
      categorySeeds.map(seed => ({
        sys: {
          type: 'Link',
          linkType: 'Entry',
          id: categoryMap.get(seed.slug).sys.id,
        },
      }))
    ),
  };
  assignField(landingFields, 'internalName', landingPageSeed.internalName);
  assignField(landingFields, 'slug', landingPageSeed.slug);
  assignField(landingFields, 'heroEyebrow', landingPageSeed.heroEyebrow);
  assignField(landingFields, 'title', landingPageSeed.title);
  assignField(landingFields, 'subtitle', landingPageSeed.subtitle);
  assignField(landingFields, 'helperText', landingPageSeed.helperText);
  assignField(
    landingFields,
    'primaryCtaLabel',
    landingPageSeed.primaryCtaLabel
  );
  assignField(landingFields, 'primaryCtaUrl', landingPageSeed.primaryCtaUrl);
  assignField(
    landingFields,
    'secondaryCtaLabel',
    landingPageSeed.secondaryCtaLabel
  );
  assignField(
    landingFields,
    'secondaryCtaUrl',
    landingPageSeed.secondaryCtaUrl
  );
  assignField(landingFields, 'seoDescription', landingPageSeed.seoDescription);
  assignField(landingFields, 'lastUpdated', new Date().toISOString());
  assignField(landingFields, 'filterGroups', {
    groups: landingPageSeed.filterGroups,
  });

  await upsertEntry(
    'resourceLandingPage',
    landingPageSeed.slug,
    landingFields
  );

  console.log('✅ Contentful seeding complete');
};

run().catch(error => {
  console.error('Failed to seed Contentful data');
  console.error(error);
  process.exit(1);
});
