module.exports = {
  '**/*': () => [
    'pnpm audit:ci',
    'pnpm knip',
    'pnpm format',
    'pnpm lint',
    'pnpm tsc',
    'pnpm test',
  ],
};
