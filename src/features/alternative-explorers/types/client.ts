// SPDX-License-Identifier: LicenseRef-Blockscout

export interface AlternativeExplorer {
  logo?: string;
  title: string;
  baseUrl: string;
  paths: {
    tx?: string;
    address?: string;
    token?: string;
    block?: string;
    blob?: string;
  };
}
