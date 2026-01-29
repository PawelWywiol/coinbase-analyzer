import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  entry: ['src/app/**/page.tsx', 'src/app/**/layout.tsx', 'src/app/**/route.ts'],
  project: ['src/**/*.{ts,tsx}'],
  ignore: ['**/*.d.ts'],

  tags: ['-internal'],

  ignoreDependencies: ['tailwindcss', 'daisyui', 'autoprefixer'],

  rules: {
    files: 'error',
    dependencies: 'error',
    devDependencies: 'error',
    unlisted: 'error',
    binaries: 'error',
    unresolved: 'error',
    exports: 'error',
    nsExports: 'error',
    classMembers: 'error',
    types: 'error',
    nsTypes: 'error',
    enumMembers: 'off',
    duplicates: 'error',
  },
};

export default config;
