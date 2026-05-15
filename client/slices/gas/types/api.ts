// SPDX-License-Identifier: LicenseRef-Blockscout

export type GasPrices = {
  average: GasPriceInfo | null;
  fast: GasPriceInfo | null;
  slow: GasPriceInfo | null;
};

export interface GasPriceInfo {
  fiat_price: string | null;
  price: number | null;
  time: number | null;
  base_fee: number | null;
  priority_fee: number | null;
}
