import type { SmartContractLicenseType } from './api';

export interface ContractCodeIde {
  title: string;
  url: string;
  icon_url: string;
}

export interface ContractLicense {
  type: SmartContractLicenseType;
  url: string;
  label: string;
  title: string;
}
