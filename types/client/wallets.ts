export type WalletType = 'metamask' | 'coinbase' | 'token_pocket';

export interface WalletInfo {
  name: string;
  icon: React.ElementType;
}
