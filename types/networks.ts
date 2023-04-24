export type NetworkGroup = 'Mainnets' | 'Testnets' | 'Other';

export interface FeaturedNetwork {
  title: string;
  url: string;
  group: NetworkGroup;
  icon?: string;
  isActive?: boolean;
}

export interface NetworkExplorer {
  title: string;
  baseUrl: string;
  paths: {
    tx?: string;
    address?: string;
  };
}

export type NetworkVerificationType = 'mining' | 'validation';
