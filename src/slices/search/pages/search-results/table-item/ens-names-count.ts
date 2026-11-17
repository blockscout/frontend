// SPDX-License-Identifier: LicenseRef-Blockscout

const MAX_DISPLAYED_EXTRA_NAMES = 39;

export const getEnsNamesCountLabel = (namesCount: number): string | undefined => {
  if (namesCount <= 1) {
    return undefined;
  }

  return namesCount > MAX_DISPLAYED_EXTRA_NAMES ? '40+' : `+${ namesCount - 1 }`;
};
