import type { SolidityScanReport, SolidityScanReportSeverityDistribution } from 'lib/solidityScan/schema';

export type MarketplaceAppPreview = {
  id: string;
  external?: boolean;
  title: string;
  logo: string;
  logoDarkMode?: string;
  shortDescription: string;
  categories: Array<string>;
  url: string;
  internalWallet?: boolean;
  priority?: number;
  rating?: number;
  ratingsTotalCount?: string;
  userRating?: number;
};

export type MarketplaceAppSocialInfo = {
  twitter?: string;
  telegram?: string;
  github?: string | Array<string>;
  discord?: string;
};

export type MarketplaceAppOverview = MarketplaceAppPreview & MarketplaceAppSocialInfo & {
  author: string;
  description: string;
  site?: string;
};

export type MarketplaceAppWithSecurityReport = MarketplaceAppOverview & {
  securityReport?: MarketplaceAppSecurityReport;
};

export enum MarketplaceCategory {
  ALL = 'All',
  FAVORITES = 'Favorites',
}

export enum ContractListTypes {
  ANALYZED = 'Analyzed',
  ALL = 'All',
  VERIFIED = 'Verified',
}

export type MarketplaceAppSecurityReport = {
  overallInfo: {
    verifiedNumber: number;
    totalContractsNumber: number;
    solidityScanContractsNumber: number;
    securityScore: number;
    totalIssues?: number;
    issueSeverityDistribution: SolidityScanReportSeverityDistribution;
  };
  contractsData: Array<{
    address: string;
    isVerified: boolean;
    solidityScanReport?: SolidityScanReport['scan_report'] | null;
  }>;
};

export type MarketplaceAppSecurityReportRaw = {
  appName: string;
  chainsData: {
    [chainId: string]: MarketplaceAppSecurityReport;
  };
};
