import type { ArrayElement } from 'types/utils';

export const PROVIDERS = [
  'blockscout',
  'none',
] as const;

export type Provider = ArrayElement<typeof PROVIDERS>;
