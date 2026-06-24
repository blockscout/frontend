// SPDX-License-Identifier: LicenseRef-Blockscout

import type { schemas } from '@blockscout/api-types';

export interface ContractLicense {
  type: NonNullable<schemas['SmartContract']['license_type']>;
  url: string;
  label: string;
  title: string;
}
