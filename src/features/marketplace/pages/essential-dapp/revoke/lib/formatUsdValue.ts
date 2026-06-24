// SPDX-License-Identifier: LicenseRef-Blockscout

export default function formatUsdValue(value: number | undefined): string | undefined {
  if (value === undefined) return undefined;
  if (value > 0 && value < 0.01) return '< $0.01';

  return `$${ Number(value.toFixed(2)).toLocaleString() }`;
}
