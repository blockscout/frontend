export type NetworkGroup = 'Mainnets' | 'Testnets' | 'Other';

export interface FeaturedNetwork {
  title: string;
  url: string;
  group: NetworkGroup;
  icon?: string;
  isActive?: boolean;
  invertIconInDarkMode?: boolean;
}

export interface NetworkExplorer {
  title: string;
  baseUrl: string;
  paths: {
    tx?: string;
    address?: string;
    token?: string;
    block?: string;
  };
}

export type NetworkVerificationType = 'mining' | 'validation';
