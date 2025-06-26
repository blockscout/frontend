export type NetworkGroup = 'Mainnet' | 'Testnet' | 'Devnet' | string & {} ;

export interface FeaturedNetwork {
  title: string;
  url: string;
  group: NetworkGroup;
  icon?: string;
  invertIconInDarkMode?: boolean;
}

export interface NetworkExplorer {
  logo?: string;
  title: string;
  baseUrl: string;
  paths: {
    tx?: string;
    address?: string;
    token?: string;
    block?: string;
  };
}

export type NetworkVerificationTypeEnvs = 'mining' | 'validation';
export type NetworkVerificationTypeComputed = 'posting' | 'sequencing';
export type NetworkVerificationType = NetworkVerificationTypeEnvs | NetworkVerificationTypeComputed;
