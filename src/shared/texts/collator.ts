// SPDX-License-Identifier: LicenseRef-Blockscout

// Shared collator instance, created once and pinned to the 'en' locale.
// This keeps comparisons consistent and avoids the cost of creating a collator on every comparison

// eslint-disable-next-line no-restricted-syntax
export const collator = new Intl.Collator('en');
