import { spawn } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const spaceId = process.env.CONTENTFUL_SPACE_ID;
const environmentId = process.env.CONTENTFUL_ENVIRONMENT || 'master';
const managementToken = process.env.CONTENTFUL_MANAGEMENT_TOKEN;

const requiredVars = {
  CONTENTFUL_SPACE_ID: spaceId,
  CONTENTFUL_MANAGEMENT_TOKEN: managementToken,
};

const missingVars = Object.entries(requiredVars)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  console.error(
    `Missing Contentful configuration: ${missingVars.join(', ')}. ` +
      'Set them in .env.local or export them in your shell.'
  );
  process.exit(1);
}

const explicitFile = process.env.CONTENTFUL_MIGRATION_FILE;
const migrationsDir = path.join(repoRoot, 'dist', 'contentful', 'migrations');

const findLatestMigration = () => {
  if (!existsSync(migrationsDir)) {
    return null;
  }

  const files = readdirSync(migrationsDir)
    .filter(file => file.endsWith('.js') || file.endsWith('.cjs'))
    .sort();

  if (files.length === 0) {
    return null;
  }

  return path.join(migrationsDir, files[files.length - 1]);
};

const migrationFile = explicitFile
  ? path.resolve(explicitFile)
  : findLatestMigration();

if (!migrationFile || !existsSync(migrationFile)) {
  console.error(
    `Could not find a compiled migration file. ` +
      `Run "pnpm contentful:build" first or set CONTENTFUL_MIGRATION_FILE`
  );
  process.exit(1);
}

const cliCommand = process.env.CONTENTFUL_CLI_COMMAND || 'contentful';
const args = [
  'space',
  'migration',
  '--space-id',
  spaceId,
  '--environment-id',
  environmentId,
  '--management-token',
  managementToken,
  '--yes',
  migrationFile,
];

console.log(
  `Running ${cliCommand} space migration against ${spaceId}/${environmentId}`
);

const child = spawn(cliCommand, args, {
  stdio: 'inherit',
});

child.on('exit', code => {
  process.exit(code ?? 0);
});

child.on('error', error => {
  console.error('Failed to run Contentful CLI', error);
  process.exit(1);
});
