import type { MigrationFunction } from 'contentful-migration';

type ContentTypeMigration = Parameters<MigrationFunction>[0];

const slugValidation = [
  {
    size: { min: 1, max: 64 },
  },
  {
    regexp: {
      pattern: '^[a-z0-9-]+$',
    },
    message: 'Use lowercase letters, numbers, and hyphens only.',
  },
  { unique: true },
] as const;

const createResourceCategory = (migration: ContentTypeMigration) => {
  const category = migration.createContentType('resourceCategory', {
    name: 'Resource Category',
    description: 'Logical grouping for curated developer resources',
    displayField: 'internalName',
  });

  category.createField('internalName', {
    name: 'Internal name',
    type: 'Symbol',
    required: true,
  });

  category.createField('slug', {
    name: 'Slug',
    type: 'Symbol',
    required: true,
    validations: slugValidation as any,
  });

  category.createField('summary', {
    name: 'Summary',
    type: 'Text',
    required: false,
  });

  category.createField('icon', {
    name: 'Icon',
    type: 'Symbol',
    required: false,
    validations: [
      {
        size: { max: 32 },
      },
    ],
  });

  category.createField('themeColor', {
    name: 'Theme color',
    type: 'Symbol',
    required: false,
  });

  category.createField('weight', {
    name: 'Weight',
    type: 'Integer',
    required: false,
  });
};

const createResourceEntry = (migration: ContentTypeMigration) => {
  const resource = migration.createContentType('resourceEntry', {
    name: 'Resource Entry',
    description: 'Individual resource cards surfaced on the landing page',
    displayField: 'internalName',
  });

  resource.createField('internalName', {
    name: 'Internal name',
    type: 'Symbol',
    required: true,
  });

  resource.createField('slug', {
    name: 'Slug',
    type: 'Symbol',
    required: true,
    validations: slugValidation as any,
  });

  resource.createField('summary', {
    name: 'Summary',
    type: 'Text',
  });

  resource.createField('url', {
    name: 'Primary URL',
    type: 'Symbol',
    required: true,
    validations: [
      {
        regexp: {
          pattern: '^https?://',
        },
        message: 'Include the protocol, e.g. https://example.com',
      },
    ],
  });

  resource.createField('resourceType', {
    name: 'Resource type',
    type: 'Symbol',
    required: true,
    validations: [
      {
        in: ['tool', 'article', 'template', 'video', 'api'],
      },
    ],
  });

  resource.createField('difficulty', {
    name: 'Difficulty / Level',
    type: 'Symbol',
    required: false,
    validations: [
      {
        in: ['beginner', 'intermediate', 'advanced'],
      },
    ],
  });

  resource.createField('tags', {
    name: 'Tags',
    type: 'Array',
    items: {
      type: 'Symbol',
    },
    validations: [
      {
        size: { max: 8 },
      },
    ],
  });

  resource.createField('ctaLabel', {
    name: 'CTA label',
    type: 'Symbol',
  });

  resource.createField('ctaUrl', {
    name: 'Secondary CTA URL',
    type: 'Symbol',
    validations: [
      {
        regexp: {
          pattern: '^https?://',
        },
        message: 'Include the protocol, e.g. https://example.com',
      },
    ],
  });

  resource.createField('logo', {
    name: 'Logo or thumbnail',
    type: 'Link',
    linkType: 'Asset',
  });

  resource.createField('category', {
    name: 'Primary category',
    type: 'Link',
    linkType: 'Entry',
    required: true,
    validations: [
      {
        linkContentType: ['resourceCategory'],
      },
    ],
  });

  resource.createField('metrics', {
    name: 'Metrics',
    type: 'Object',
  });

  resource.createField('highlighted', {
    name: 'Highlighted resource',
    type: 'Boolean',
    required: false,
    defaultValue: {
      'en-US': false,
    } as any,
  });

  resource.createField('lastReviewed', {
    name: 'Last reviewed',
    type: 'Date',
  });
};

const createLandingPage = (migration: ContentTypeMigration) => {
  const landingPage = migration.createContentType('resourceLandingPage', {
    name: 'Resource Landing Page',
    description: 'Page container that assembles categories and featured items',
    displayField: 'internalName',
  });

  landingPage.createField('internalName', {
    name: 'Internal name',
    type: 'Symbol',
    required: true,
  });

  landingPage.createField('slug', {
    name: 'Slug',
    type: 'Symbol',
    required: true,
    validations: slugValidation as any,
  });

  landingPage.createField('heroEyebrow', {
    name: 'Hero eyebrow',
    type: 'Symbol',
  });

  landingPage.createField('title', {
    name: 'Hero title',
    type: 'Symbol',
    required: true,
  });

  landingPage.createField('subtitle', {
    name: 'Hero subtitle',
    type: 'Text',
  });

  landingPage.createField('helperText', {
    name: 'Helper text',
    type: 'Symbol',
  });

  landingPage.createField('primaryCtaLabel', {
    name: 'Primary CTA label',
    type: 'Symbol',
  });

  landingPage.createField('primaryCtaUrl', {
    name: 'Primary CTA URL',
    type: 'Symbol',
  });

  landingPage.createField('secondaryCtaLabel', {
    name: 'Secondary CTA label',
    type: 'Symbol',
  });

  landingPage.createField('secondaryCtaUrl', {
    name: 'Secondary CTA URL',
    type: 'Symbol',
  });

  landingPage.createField('featuredResources', {
    name: 'Featured resources',
    type: 'Array',
    items: {
      type: 'Link',
      linkType: 'Entry',
      validations: [
        {
          linkContentType: ['resourceEntry'],
        },
      ],
    },
    validations: [
      {
        size: { max: 6 },
      },
    ],
  });

  landingPage.createField('categories', {
    name: 'Categories',
    type: 'Array',
    required: true,
    items: {
      type: 'Link',
      linkType: 'Entry',
      validations: [
        {
          linkContentType: ['resourceCategory'],
        },
      ],
    },
  });

  landingPage.createField('filterGroups', {
    name: 'Filter groups',
    type: 'Object',
  });

  landingPage.createField('seoDescription', {
    name: 'SEO description',
    type: 'Text',
  });

  landingPage.createField('lastUpdated', {
    name: 'Last updated',
    type: 'Date',
  });
};

const migration: MigrationFunction = migrationCreator => {
  createResourceCategory(migrationCreator);
  createResourceEntry(migrationCreator);
  createLandingPage(migrationCreator);
};

export = migration;
