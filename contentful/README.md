# Contentful migrations

This folder hosts the Contentful migration scripts that describe the content
model in TypeScript. The workflow is:

1. Create or update migration files inside `contentful/migrations`.
2. Compile the TypeScript files into CommonJS using `pnpm contentful:build`.
3. Run the compiled file with the Contentful CLI to apply the migration.

## Required environment variables

Copy `.env.local.example` to `.env.local` (or export the values in your shell)
and update the tokens:

- `CONTENTFUL_SPACE_ID`
- `CONTENTFUL_ENVIRONMENT`
- `CONTENTFUL_MANAGEMENT_TOKEN`

The same values prefixed with `VITE_` are used in the React application when
querying the Delivery or Preview APIs.

## Running a migration

```bash
pnpm contentful:migrate
```

The script compiles the TypeScript files with `tsc` and then proxies the
`contentful space migration` command. The CLI must already be installed on your
machine (the repo does not ship it as a dependency).

If you need to run a specific file you can override
`CONTENTFUL_MIGRATION_FILE=path/to/file.js pnpm contentful:migrate`.
