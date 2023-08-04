export type WalletType = 'metamask' | 'coinbase' | 'none';

export interface WalletInfo {
  name: string;
  icon: React.ElementType;
}
