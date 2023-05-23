import type { ExternalProvider } from 'types/client/wallets';

type CPreferences = {
  zone: string;
  width: string;
  height: string;
}

declare global {
  export interface Window {
    ethereum?: {
      providers?: Array<ExternalProvider>;
    };
    coinzilla_display: Array<CPreferences>;
    ga?: {
      getAll: () => Array<{ get: (prop: string) => string }>;
    };
  }
}
