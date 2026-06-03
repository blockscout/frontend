// SPDX-License-Identifier: LicenseRef-Blockscout

const STORAGE_KEY = 'marketplace-disclaimer-shown';

export const isDisclaimerShown = () => {
  return window.localStorage.getItem(STORAGE_KEY) === 'true';
};

export const setDisclaimerShown = () => {
  window.localStorage.setItem(STORAGE_KEY, 'true');
};
