import type { SolidityscanReport } from 'types/api/contract';

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
}

export type MarketplaceAppSocialInfo = {
  twitter?: string;
  telegram?: string;
  github?: string | Array<string>;
  discord?: string;
}

export type MarketplaceAppOverview = MarketplaceAppPreview & MarketplaceAppSocialInfo & {
  author: string;
  description: string;
  site?: string;
}

export type MarketplaceAppWithSecurityReport = MarketplaceAppOverview & {
  securityReport?: MarketplaceAppSecurityReport;
}

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
    issueSeverityDistribution: SolidityscanReport['scan_report']['scan_summary']['issue_severity_distribution'];
  };
  contractsData: Array<{
    address: string;
    isVerified: boolean;
    solidityScanReport?: SolidityscanReport['scan_report'] | null;
  }>;
}

export type MarketplaceAppSecurityReportRaw = {
  appName: string;
  chainsData: {
    [chainId: string]: MarketplaceAppSecurityReport;
  };
}
