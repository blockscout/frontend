import type { MetaMaskInpageProvider } from '@metamask/providers';

type CPreferences = {
  zone: string;
  width: string;
  height: string;
}

declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider;
    coinzilla_display: Array<CPreferences>;
  }
}
