// SPDX-License-Identifier: LicenseRef-Blockscout

const DECIMALS_OF_TOKEN_WITHOUT_DECIMALS_INFO = 18;

export function getWatchAssetDecimals(tokenDecimals: string | null | undefined): number {
  const isDecimalsInfoMissing = tokenDecimals === null || tokenDecimals === undefined;

  return isDecimalsInfoMissing ? DECIMALS_OF_TOKEN_WITHOUT_DECIMALS_INFO : Number(tokenDecimals);
}
