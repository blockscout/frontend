import type { ArrayElement } from 'types/utils';

export const SUPPORTED_WALLETS = [
  'metamask',
  'coinbase',
  'token_pocket',
] as const;

export type WalletType = ArrayElement<typeof SUPPORTED_WALLETS>;

export interface WalletInfo {
  name: string;
  icon: React.ElementType;
}
