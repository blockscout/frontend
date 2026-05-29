// SPDX-License-Identifier: LicenseRef-Blockscout

export interface BridgedTokenChain {
  id: string;
  title: string;
  short_title: string;
  base_url: string;
}

export interface TokenBridge {
  type: string;
  title: string;
  short_title: string;
}
