// SPDX-License-Identifier: LicenseRef-Blockscout

export const TIME_FORMAT = [ 'relative', 'absolute' ] as const;
export type TimeFormat = typeof TIME_FORMAT[number];
