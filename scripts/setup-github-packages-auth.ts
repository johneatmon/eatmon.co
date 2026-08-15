/**
 * Configure GitHub Packages auth for pnpm (user-level config).
 * Project .npmrc cannot expand ${GITHUB_PAT} anymore — see
 * https://pnpm.io/blog/2026/06/11/env-variables-in-repository-npmrc
 */

import { spawnSync } from 'node:child_process';
import { config as loadEnv } from 'dotenv';

loadEnv({ path: '.env' });
loadEnv({ path: '.env.local' });

const token = process.env.GITHUB_PAT;
if (!token) {
  console.error('GITHUB_PAT is required to install @johneatmon/* packages from GitHub Packages.');
  process.exit(1);
}

const result = spawnSync('pnpm', ['config', 'set', '//npm.pkg.github.com/:_authToken', token], {
  stdio: 'inherit',
  env: process.env,
});

process.exit(result.status ?? 1);
