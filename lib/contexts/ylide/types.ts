import type { AbstractWalletController, WalletAccount } from '@ylide/sdk';

export interface IAppEntry {
  id: string;
  name: string;
  homepage: string;
  chains: Array<string>;
  image_id: string;
  image_url: {
    sm: string;
    md: string;
    lg: string;
  };
  app: {
    browser: string;
    ios: string;
    android: string;
    mac: string;
    windows: string;
    linux: string;
  };
  mobile: {
    native: string;
    universal: string;
  };
  desktop: {
    native: string;
    universal: string;
  };
  metadata: {
    shortName: string;
    colors: {
      primary: string;
      secondary: string;
    };
  };
}

export interface IAppRegistry {
  [id: string]: IAppEntry;
}

export interface DomainAccount {
  name: string;
  backendAuthKey: string | null;
  wallet: AbstractWalletController;
  account: WalletAccount;
  reloadKeys: () => Promise<void>;
}

export interface YlideSavedAccount {
  name: string;
  account: WalletAccount;
  wallet: string;
  backendAuthKey: string | null;
}

export interface YlideAccountPushes {
  lowercaseAddress: string;
  isEnabled: boolean;
}
