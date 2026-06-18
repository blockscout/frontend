// SPDX-License-Identifier: LicenseRef-Blockscout

// The shared instance is of collator created once and pinned to the `'en'` locale,
// which keeps comparisons consistent and avoids the cost of building a collator on every comparison
// (significant inside sort callbacks, which run O(n log n) times).

// eslint-disable-next-line no-restricted-syntax
export const collator = new Intl.Collator('en');
