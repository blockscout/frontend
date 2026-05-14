import type { SmartContractLicenseType } from './api';

export interface ContractLicense {
  type: SmartContractLicenseType;
  url: string;
  label: string;
  title: string;
}
