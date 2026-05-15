// SPDX-License-Identifier: LicenseRef-Blockscout

const old = Number.prototype.toLocaleString;
Number.prototype.toLocaleString = function(locale, ...args) {
  return old.call(this, 'en', ...args);
};

export {};
