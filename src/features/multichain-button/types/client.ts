// SPDX-License-Identifier: LicenseRef-Blockscout

export type MultichainProviderView = 'full' | 'icon';

export interface MultichainProviderConfig {
  name: string;
  dapp_id?: string;
  url_template: string;
  logo: string;
  view?: MultichainProviderView;
};
